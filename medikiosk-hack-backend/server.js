require('dotenv').config();

const cors = require('cors');
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

const fallbackPrompts = [
  'Where exactly do you feel this symptom?',
  'When did it start, and is it getting better or worse?',
  'How severe is it from 0 to 10?',
  'What makes it better or worse?',
  'Have you noticed any other symptoms with it?'
];

async function askGemini(message, turn) {
  if (!process.env.GEMINI_API_KEY) return null;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const prompt = `You are MediKiosk, a hospital intake assistant. Ask exactly one short, plain-language follow-up question to collect only information useful to a doctor. Do not diagnose, prescribe, or give treatment advice. If the message suggests an emergency, reply exactly with URGENT: followed by a brief instruction to alert hospital staff. This is follow-up ${Number(turn || 0) + 1} of 5. Patient message: ${message}`;
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2, maxOutputTokens: 80 } }) });
  if (!response.ok) throw new Error(`Gemini request failed with ${response.status}`);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
}

// Keep this endpoint independent of external services so it can be used to
// distinguish a deployment/runtime failure from a Supabase, SMTP, or AI error.
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.status(200).json({ service: 'medikiosk-backend', status: 'ok' });
});

app.get('/api/sos', async (_req, res, next) => {
  try {
    if (!supabase) return res.json({ alerts: [] });
    const { data, error } = await supabase.from('sos_alerts').select('*').order('created_at', { ascending: false }).limit(50);
    if (error) return next(error);
    res.json({ alerts: data || [] });
  } catch (error) { next(error); }
});

app.get('/api/doctor/queue', async (_req, res, next) => {
  try {
    if (!supabase) return res.json({ submissions: [] });
    const { data, error } = await supabase.from('intake_submissions').select('id, token, language, history, doctor_summary, priority, created_at').order('created_at', { ascending: false }).limit(25);
    if (error) return next(error);
    res.json({ submissions: data || [] });
  } catch (error) { next(error); }
});

app.post('/api/sos', async (req, res, next) => {
  try {
    const record = { id: randomUUID(), token: req.body?.token || null, language: req.body?.language || 'en', history: req.body?.history || {}, status: 'open', created_at: new Date().toISOString() };
    if (supabase) {
      const { error } = await supabase.from('sos_alerts').insert(record);
      if (error) return next(error);
    }
    res.status(201).json({ ok: true, alert: record, persisted: Boolean(supabase) });
  } catch (error) { next(error); }
});

app.post('/api/intake', async (req, res, next) => {
  try {
    const payload = req.body || {};
    if (!payload.history?.complaint) {
      return res.status(400).json({ error: 'A chief complaint is required.' });
    }
    const record = {
      id: randomUUID(),
      token: `T-${Math.floor(1000 + Math.random() * 9000)}`,
      language: payload.language || 'en',
      identifier: payload.consent?.idValue || null,
      history: payload.history,
      doctor_summary: {
        chief_complaint: payload.history.complaint || null,
        onset: payload.history.onset || null,
        symptoms: payload.history.symptoms || [],
        red_flags: Boolean(payload.priority),
        ai_assisted: Boolean(payload.history.aiSummary)
      },
      document_count: Array.isArray(payload.uploads) ? payload.uploads.length : 0,
      priority: Boolean(payload.priority),
      created_at: new Date().toISOString(),
    };
    if (supabase) {
      const { error } = await supabase.from(process.env.SUPABASE_INTAKE_TABLE || 'intake_submissions').insert(record);
      if (error) return next(error);
    }
    res.status(201).json({ ok: true, submission: record, persisted: Boolean(supabase) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/chat', async (req, res) => {
  const message = String(req.body?.message || '').trim();
  if (!message) return res.status(400).json({ error: 'Message is required.' });
  const redFlags = /chest pain|difficulty breathing|breathless|one-sided weakness|facial droop|uncontrolled bleeding|seizure|unconscious|throat swelling/i;
  if (redFlags.test(message)) {
    return res.json({ emergency: true, reply: 'This may need urgent attention. Please alert hospital staff immediately.', next: null });
  }
  const index = Math.min(Number(req.body?.turn || 0), fallbackPrompts.length - 1);
  try {
    const geminiReply = await askGemini(message, index);
    const emergency = /^URGENT:/i.test(geminiReply || '');
    return res.json({ emergency, provider: geminiReply ? 'gemini' : 'fallback', reply: (geminiReply || '').replace(/^URGENT:\s*/i, '') || fallbackPrompts[index], next: emergency ? null : index + 1 });
  } catch (error) {
    console.warn('Gemini unavailable; using safe intake fallback.', error.message);
    return res.json({ emergency: false, provider: 'fallback', reply: fallbackPrompts[index], next: index + 1 });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// This must be last. It prevents uncaught route errors from terminating the
// Node.js invocation and turns them into a controlled JSON 500 response.
app.use((err, _req, res, _next) => {
  console.error('Unhandled request error:', err);
  if (res.headersSent) return;
  res.status(500).json({ error: 'Internal server error' });
});

// Vercel detects this CommonJS export and invokes it as the Express function.
module.exports = app;

// Retain a conventional local-development command without starting a second
// listener when the module is loaded by Vercel.
if (require.main === module) {
  const port = Number.parseInt(process.env.PORT, 10) || 3000;
  app.listen(port, () => {
    console.log(`MediKiosk backend listening on port ${port}`);
  });
}
