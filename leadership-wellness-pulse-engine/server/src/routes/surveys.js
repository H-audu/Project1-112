import { Router } from 'express';
import { z } from 'zod';
import { pool, query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { calculateScores, createAlerts } from '../services/scoring.js';

const router = Router();
router.use(requireAuth);

router.get('/questions', async (_req, res, next) => {
  try {
    const result = await query('SELECT id, prompt, domain, is_negative FROM survey_questions WHERE active = TRUE ORDER BY display_order');
    res.json(result.rows);
  } catch (error) { next(error); }
});

router.post('/submissions', async (req, res, next) => {
  const schema = z.object({
    reportingWeek: z.string().date(),
    answers: z.array(z.object({ questionId: z.string().uuid(), response: z.number().int().min(1).max(5) })).min(1),
    hoursWorked: z.number().min(0).max(168).optional(),
    vacationDays: z.number().min(0).max(7).optional(),
    sickDays: z.number().min(0).max(7).optional(),
    comments: z.string().max(2000).optional()
  });

  const client = await pool.connect();
  try {
    const body = schema.parse(req.body);
    const qResult = await client.query('SELECT id, domain, is_negative FROM survey_questions WHERE active = TRUE');
    const questions = qResult.rows;
    if (body.answers.length !== questions.length) return res.status(400).json({ error: 'Please answer every active survey question.' });
    const scores = calculateScores(questions, body.answers);
    await client.query('BEGIN');
    const submission = await client.query(
      `INSERT INTO survey_submissions
       (user_id, reporting_week, hours_worked, vacation_days, sick_days, comments, stress_score, workload_score, recovery_score, support_score, burnout_risk)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [req.user.sub, body.reportingWeek, body.hoursWorked || null, body.vacationDays || 0, body.sickDays || 0, body.comments || null,
       scores.stressScore, scores.workloadScore, scores.recoveryScore, scores.supportScore, scores.burnoutRisk]
    );
    for (const answer of body.answers) {
      await client.query('INSERT INTO survey_answers (submission_id, question_id, response) VALUES ($1,$2,$3)', [submission.rows[0].id, answer.questionId, answer.response]);
    }
    for (const alert of createAlerts(scores)) {
      await client.query('INSERT INTO alerts (submission_id, alert_type, message) VALUES ($1,$2,$3)', [submission.rows[0].id, alert.alertType, alert.message]);
    }
    await client.query('COMMIT');
    res.status(201).json(submission.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') return res.status(409).json({ error: 'A survey has already been submitted for this reporting week.' });
    next(error);
  } finally { client.release(); }
});

router.get('/history', async (req, res, next) => {
  try {
    const result = await query(`SELECT id, reporting_week, stress_score, workload_score, recovery_score, support_score, burnout_risk, created_at
      FROM survey_submissions WHERE user_id = $1 ORDER BY reporting_week DESC LIMIT 26`, [req.user.sub]);
    res.json(result.rows);
  } catch (error) { next(error); }
});

export default router;
