-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  participant_id VARCHAR(50) NOT NULL,
  session_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  sync_timestamp BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES sessions(id),
  event_type VARCHAR(100) NOT NULL,
  event_time BIGINT NOT NULL,
  response_value VARCHAR(255),
  accuracy VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sync markers table
CREATE TABLE sync_markers (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES sessions(id),
  marker_id VARCHAR(50),
  timestamp BIGINT NOT NULL,
  source VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
