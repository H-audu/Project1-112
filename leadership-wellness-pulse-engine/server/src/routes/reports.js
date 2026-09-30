import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/executive-summary.pdf', async (req, res, next) => {
  try {
    const result = await query(`SELECT reporting_week, stress_score, workload_score, recovery_score, support_score, burnout_risk
      FROM survey_submissions WHERE user_id=$1 ORDER BY reporting_week DESC LIMIT 8`, [req.user.sub]);
    if (!result.rows.length) return res.status(404).json({ error: 'No survey data is available.' });
    const rows = result.rows;
    const avg = (key) => (rows.reduce((s, r) => s + Number(r[key]), 0) / rows.length).toFixed(1);
    const latest = rows[0];

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="leadership-wellness-summary.pdf"');
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);
    doc.fontSize(20).text('Leadership Wellness Pulse Report');
    doc.moveDown().fontSize(11).text(`Prepared for: ${req.user.name}`);
    doc.text(`Reporting through: ${latest.reporting_week}`);
    doc.moveDown().fontSize(15).text('Overall Wellness');
    doc.fontSize(11).text(`Average Stress Score: ${avg('stress_score')}`);
    doc.text(`Average Recovery Score: ${avg('recovery_score')}`);
    doc.text(`Average Workload Score: ${avg('workload_score')}`);
    doc.text(`Average Support Score: ${avg('support_score')}`);
    doc.text(`Current Burnout Risk: ${latest.burnout_risk}`);
    doc.moveDown().fontSize(15).text('Key Findings');
    doc.fontSize(11).list([
      Number(avg('stress_score')) >= 60 ? 'Stress remains above the high-risk threshold.' : 'Stress is currently below the high-risk threshold.',
      Number(avg('recovery_score')) < 60 ? 'Recovery is below the recommended level.' : 'Recovery is within a favorable range.',
      Number(avg('workload_score')) >= 70 ? 'Workload is heavy and should be reviewed.' : 'Workload is currently manageable.'
    ]);
    doc.moveDown().fontSize(15).text('Recommendations');
    doc.fontSize(11).list(['Protect recovery time and encourage use of leave.', 'Review workload distribution and meeting burden.', 'Use occupational health or coaching support when scores remain elevated.']);
    doc.end();
  } catch (error) { next(error); }
});

export default router;
