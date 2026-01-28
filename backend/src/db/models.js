const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  participantId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sessionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  syncTimestamp: {
    type: DataTypes.BIGINT,
  },
}, {
  tableName: 'sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sessionId: {
    type: DataTypes.INTEGER,
    references: { model: Session, key: 'id' },
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventTime: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  responseValue: {
    type: DataTypes.STRING,
  },
  accuracy: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

const SyncMarker = sequelize.define('SyncMarker', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sessionId: {
    type: DataTypes.INTEGER,
    references: { model: Session, key: 'id' },
  },
  markerId: {
    type: DataTypes.STRING,
  },
  timestamp: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  source: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'sync_markers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = { User, Session, Event, SyncMarker, sequelize };
