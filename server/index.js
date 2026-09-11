import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[FinGuard Server] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api', apiRouter);

// Root fallback
app.get('/', (req, res) => {
  res.json({
    name: 'FinGuard AI Backend API Server',
    version: '1.0.0',
    status: 'Running',
    docs: '/api/health'
  });
});

// Keep process alive when stdin receives EOF in background processes
process.stdin.resume();

// Start Server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 FinGuard AI Server listening on http://localhost:${PORT}`);
  console.log(`⚡ FinGuard AI Agent Workflow Engine Active`);
  console.log(`====================================================`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server terminated');
  });
});
