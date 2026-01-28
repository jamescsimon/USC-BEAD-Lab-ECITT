const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { SyncMarker, Session } = require('../../db/models');

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

// Create sync marker
router.post('/', verifyToken, async (req, res) => {
  try {
    const { sessionId, markerId, timestamp, source } = req.body;
    if (!sessionId || !timestamp) {
      return res.status(400).json({ error: 'sessionId and timestamp required' });
    }

    const marker = await SyncMarker.create({
      sessionId,
      markerId,
      timestamp,
      source,
    });

    res.json(marker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get sync markers for session
router.get('/session/:sessionId', verifyToken, async (req, res) => {
  try {
    const markers = await SyncMarker.findAll({
      where: { sessionId: req.params.sessionId },
    });
    res.json(markers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get sync info for session
router.get('/info/:sessionId', verifyToken, async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const markers = await SyncMarker.findAll({
      where: { sessionId: req.params.sessionId },
    });

    res.json({
      sessionId: session.id,
      syncTimestamp: session.syncTimestamp,
      markers: markers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
