const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Session } = require('../../db/models');

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Create session
router.post('/', verifyToken, async (req, res) => {
  try {
    const { participantId, sessionDate } = req.body;
    if (!participantId || !sessionDate) {
      return res.status(400).json({ error: 'participantId and sessionDate required' });
    }

    const session = await Session.create({
      participantId,
      sessionDate: new Date(sessionDate),
      status: 'pending',
    });

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get session
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update session status
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { status, syncTimestamp } = req.body;
    const session = await Session.findByPk(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (status) session.status = status;
    if (syncTimestamp) session.syncTimestamp = syncTimestamp;
    await session.save();

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// List sessions for participant
router.get('/participant/:participantId', verifyToken, async (req, res) => {
  try {
    const sessions = await Session.findAll({
      where: { participantId: req.params.participantId },
    });
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
