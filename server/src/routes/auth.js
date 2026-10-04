// UC-01 Registration, UC-02 Login, UC-03 Logout, UC-04 User Management
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { createSession, requireAuth } = require('../auth');

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const publicUser = (u) => ({ user_id: u.user_id, first_name: u.first_name, last_name: u.last_name, email: u.email, role: u.role });

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, date_of_birth } = req.body || {};
    if (!first_name || !last_name || !email || !password)
      return res.status(400).json({ error: 'First name, last name, email, and password are required.' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Invalid email address.' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

    const [dup] = await db.query('SELECT user_id FROM Users WHERE email = ?', [email.toLowerCase()]);
    if (dup.length) return res.status(409).json({ error: 'An account with that email already exists.' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO Users (first_name, last_name, email, password_hash, date_of_birth) VALUES (?, ?, ?, ?, ?)',
      [first_name.trim(), last_name.trim(), email.toLowerCase(), hash, date_of_birth || null]
    );
    await db.query('INSERT INTO User_Profile (user_id) VALUES (?)', [result.insertId]);
    res.status(201).json({ message: 'Account created.', user_id: result.insertId });
  } catch (e) { next(e); }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email.toLowerCase()]);
    const ok = rows.length && (await bcrypt.compare(password, rows[0].password_hash));
    if (!ok) return res.status(401).json({ error: 'Incorrect email or password.' });
    const token = await createSession(rows[0].user_id);
    res.json({ token, user: publicUser(rows[0]) });
  } catch (e) { next(e); }
});

// POST /api/auth/logout  (ends the current session)
router.post('/logout', requireAuth, async (req, res, next) => {
  try {
    await db.query('DELETE FROM Sessions WHERE session_id = ?', [req.user.session_id]);
    res.json({ message: 'Logged out.' });
  } catch (e) { next(e); }
});

// GET /api/auth/me  (account + profile)
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT u.user_id, u.first_name, u.last_name, u.email, u.role, u.date_of_birth,
              p.height, p.clothing_size, p.preferences, p.profile_image
         FROM Users u LEFT JOIN User_Profile p ON p.user_id = u.user_id WHERE u.user_id = ?`,
      [req.user.user_id]
    );
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// PUT /api/auth/me  (update only the fields sent)
router.put('/me', requireAuth, async (req, res, next) => {
  try {
    const b = req.body || {};
    const userFields = {}, profileFields = {};
    for (const k of ['first_name', 'last_name', 'date_of_birth']) if (b[k] !== undefined) userFields[k] = b[k];
    for (const k of ['height', 'clothing_size', 'preferences', 'profile_image']) if (b[k] !== undefined) profileFields[k] = b[k];
    if (b.height !== undefined && (isNaN(Number(b.height)) || Number(b.height) <= 0))
      return res.status(400).json({ error: 'Height must be a positive number.' });
    if (userFields.first_name === '' || userFields.last_name === '')
      return res.status(400).json({ error: 'Names cannot be empty.' });
    if (!Object.keys(userFields).length && !Object.keys(profileFields).length)
      return res.status(400).json({ error: 'No valid fields to update.' });

    const set = (o) => Object.keys(o).map((k) => `${k} = ?`).join(', ');
    if (Object.keys(userFields).length)
      await db.query(`UPDATE Users SET ${set(userFields)} WHERE user_id = ?`, [...Object.values(userFields), req.user.user_id]);
    if (Object.keys(profileFields).length)
      await db.query(`UPDATE User_Profile SET ${set(profileFields)} WHERE user_id = ?`, [...Object.values(profileFields), req.user.user_id]);
    res.json({ message: 'Account updated.' });
  } catch (e) { next(e); }
});

module.exports = router;
