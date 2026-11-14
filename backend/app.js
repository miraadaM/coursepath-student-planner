import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import connectDB from './db.js';
import coursesRoute from './routes/courses.js';
import usersRoute from './routes/users.js';
import logger from './middleware/logger.js';

const app = express();
const port = process.env.PORT || 3000;
const directory = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(directory, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use('/api/courses', coursesRoute);
app.use('/api/users', usersRoute);

try {
  await connectDB();
  // This prototype API has no authentication; keep it local by default.
  app.listen(port, '127.0.0.1', () => {
    console.log(`API running at http://127.0.0.1:${port}`);
  });
} catch {
  console.error('Database connection failed. Check MONGO_URI in backend/.env and your database access settings.');
  process.exitCode = 1;
}
