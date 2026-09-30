import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { query } from '../db.js';

const router = Router();
const credentials = z.object({ email: z.string().email(), password: z.string().min(8) });

router.post('/register', async (req, res, next) => {
  try {
    const body = credentials.extend({ fullName: z.string().min(2), departmentId: z.string().uuid().optional() }).parse(req.body);
    const hash = await bcrypt.hash(body.password, 12);
    const result = await query(
      `INSERT INTO users (full_name, email, password_hash, department_id)
       VALUES ($1, LOWER($2), $3, $4) RETURNING id, full_name, email, role`,
      [body.fullName, body.email, hash, body.departmentId || null]
    );
    const user = result.rows[0];
    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role, name: user.full_name }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.status(201).json({ token, user });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'An account with this email already exists.' });
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const body = credentials.parse(req.body);
    const result = await query('SELECT id, full_name, email, role, password_hash FROM users WHERE email = LOWER($1)', [body.email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(body.password, user.password_hash))) return res.status(401).json({ error: 'Invalid email or password.' });
    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role, name: user.full_name }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } });
  } catch (error) { next(error); }
});

export default router;
