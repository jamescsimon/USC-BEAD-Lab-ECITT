const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Event } = require('../../db/models');

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

// Log event
router.post('/', verifyToken, async (req, res) => {
  try {
    const { sessionId, eventType, eventTime, responseValue, accuracy } = req.body;
    if (!sessionId || !eventType || !eventTime) {
      return res.status(400).json({ error: 'sessionId, eventType, and eventTime required' });
    }

    const event = await Event.create({
      sessionId,
      eventType,
      eventTime,
      responseValue,
      accuracy,
    });

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get events for session
router.get('/session/:sessionId', verifyToken, async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { sessionId: req.params.sessionId },
    });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get events by type
router.get('/type/:eventType', verifyToken, async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { eventType: req.params.eventType },
    });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get event by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
