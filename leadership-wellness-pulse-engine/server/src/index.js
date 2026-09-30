import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import surveyRoutes from './routes/surveys.js';
import dashboardRoutes from './routes/dashboard.js';
import reportRoutes from './routes/reports.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err?.name === 'ZodError') return res.status(400).json({ error: 'Validation failed.', details: err.issues });
  res.status(500).json({ error: 'Internal server error.' });
});
app.listen(process.env.PORT || 4000, () => console.log(`API listening on port ${process.env.PORT || 4000}`));
