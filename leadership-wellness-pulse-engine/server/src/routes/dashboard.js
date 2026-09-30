import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const latest = await query(`SELECT reporting_week, stress_score, workload_score, recovery_score, support_score, burnout_risk
      FROM survey_submissions WHERE user_id=$1 ORDER BY reporting_week DESC LIMIT 1`, [req.user.sub]);
    const trends = await query(`SELECT reporting_week, stress_score, workload_score, recovery_score, support_score
      FROM survey_submissions WHERE user_id=$1 ORDER BY reporting_week ASC LIMIT 12`, [req.user.sub]);
    const alerts = await query(`SELECT a.id, a.alert_type, a.message, a.acknowledged, a.created_at
      FROM alerts a JOIN survey_submissions s ON s.id=a.submission_id
      WHERE s.user_id=$1 ORDER BY a.created_at DESC LIMIT 10`, [req.user.sub]);
    res.json({ latest: latest.rows[0] || null, trends: trends.rows, alerts: alerts.rows });
  } catch (error) { next(error); }
});

export default router;
