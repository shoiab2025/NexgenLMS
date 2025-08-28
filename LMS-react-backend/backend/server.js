// import express from 'express';
// import 'dotenv/config';
// import mangoDb from './db/mangoos.js';
// import chalk from 'chalk';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import fs from 'fs';
// import https from 'https';
// import http from 'http';

// // Routes
// import authRoutes from './routes/userRoutes.js';
// import MaterialRoutes from './routes/materialsRoutes.js';
// import GroupRoutes from './routes/groupsRoutes.js';
// import CoursesRoutes from './routes/coursesRoutes.js';
// import SubjectRoutes from './routes/subjectsRoutes.js';
// import CreateFullCourse from './routes/createFullCourse.js';
// import UpdateFullCourse from './routes/updateFullCourse.js';
// import TestRoutes from './routes/testRoutes.js';
// import ResultRoutes from './routes/testSubmissionRoutes.js';
// import LeaderboardRoutes from './routes/leaderBoardRoutes.js';
// import TestSubmission from './routes/testSubmissionRoutes.js';
// import authenticate from './middleware/authenticate.js';
// import InstitutionRoutes from './routes/institutionRoutes.js';

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors());

// // API Routes
// app.use('/api/users', authRoutes);
// app.use('/api/groups', GroupRoutes);
// app.use('/api/courses', CoursesRoutes, UpdateFullCourse, CreateFullCourse);
// app.use('/api/subjects', SubjectRoutes);
// app.use('/api/materials', MaterialRoutes);
// app.use('/api/tests', TestRoutes);
// app.use('/api/result', ResultRoutes);
// app.use('/api/testSubmission', TestSubmission);
// app.use('/api/leaderboard', LeaderboardRoutes);
// app.use('/api/institution', InstitutionRoutes);

// // Serve React frontend
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const clientBuildPath = path.resolve(__dirname, '../../lms-react-app/build');

// app.use(express.static(clientBuildPath));

// // Fallback: serve React app for non-API routes
// app.get('*', (req, res) => {
//   if (!req.path.startsWith('/api')) {
//     res.sendFile(path.join(clientBuildPath, 'index.html'));
//   } else {
//     res.status(404).json({ error: 'The URL is incorrect' });
//   }
// });

// const SSL_KEY = '/etc/letsencrypt/live/nexgen-e.com/privkey.pem';
// const SSL_CERT = '/etc/letsencrypt/live/nexgen-e.com/fullchain.pem';

// const PORT_HTTPS = 443;
// const PORT_HTTP = 80;

// const sslOptions = {
//   key: fs.readFileSync(SSL_KEY),
//   cert: fs.readFileSync(SSL_CERT),
// };

// // Start after DB connection
// mangoDb().then(() => {
//   // HTTPS Server
//   https.createServer(sslOptions, app).listen(PORT_HTTPS, () => {
//     console.log(chalk.green(`✅ HTTPS Server running on https://nexgen-e.com`));
//   });

//   // HTTP Redirect to HTTPS
//   http.createServer((req, res) => {
//     res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
//     res.end();
//   }).listen(PORT_HTTP, () => {
//     console.log(chalk.yellow(`⚠ Redirecting HTTP to HTTPS`));
//   });
// }).catch(err => {
//   console.error(chalk.red('❌ Failed to connect to MongoDB:', err.message));
// });


import express from 'express';
import 'dotenv/config';
import mangoDb from './db/mangoos.js';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import https from 'https';
import http from 'http';

// Routes
import authRoutes from './routes/userRoutes.js';
import MaterialRoutes from './routes/materialsRoutes.js';
import GroupRoutes from './routes/groupsRoutes.js';
import CoursesRoutes from './routes/coursesRoutes.js';
import SubjectRoutes from './routes/subjectsRoutes.js';
import CreateFullCourse from './routes/createFullCourse.js';
import UpdateFullCourse from './routes/updateFullCourse.js';
import TestRoutes from './routes/testRoutes.js';
import ResultRoutes from './routes/testSubmissionRoutes.js';
import LeaderboardRoutes from './routes/leaderBoardRoutes.js';
import TestSubmission from './routes/testSubmissionRoutes.js';
import authenticate from './middleware/authenticate.js';
import InstitutionRoutes from './routes/institutionRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// API Routes
app.use('/api/users', authRoutes);
app.use('/api/groups', GroupRoutes);
app.use('/api/courses', CoursesRoutes, UpdateFullCourse, CreateFullCourse);
app.use('/api/subjects', SubjectRoutes);
app.use('/api/materials', MaterialRoutes);
app.use('/api/tests', TestRoutes);
app.use('/api/result', ResultRoutes);
app.use('/api/testSubmission', TestSubmission);
app.use('/api/leaderboard', LeaderboardRoutes);
app.use('/api/institution', InstitutionRoutes);

// Serve React frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.resolve(__dirname, '../../lms-react-app/build');

app.use(express.static(clientBuildPath));

// Fallback: serve React app for non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  } else {
    res.status(404).json({ error: 'The URL is incorrect' });
  }
});

// === Detect environment ===
const isProduction = fs.existsSync('/etc/letsencrypt/live/nexgen-e.com/privkey.pem');

mangoDb().then(() => {
  if (isProduction) {
    // Production: HTTPS + HTTP redirect
    const sslOptions = {
      key: fs.readFileSync('/etc/letsencrypt/live/nexgen-e.com/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/nexgen-e.com/fullchain.pem'),
    };

    https.createServer(sslOptions, app).listen(443, () => {
      console.log(chalk.green(`✅ HTTPS Server running on https://nexgen-e.com`));
    });

    http.createServer((req, res) => {
      res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
      res.end();
    }).listen(80, () => {
      console.log(chalk.yellow(`⚠ Redirecting HTTP to HTTPS`));
    });

  } else {
    // Local: HTTP only on port 5000
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(chalk.green(`✅ Local server running on http://localhost:${PORT}`));
    });
  }
}).catch(err => {
  console.error(chalk.red('❌ Failed to connect to MongoDB:', err.message));
});
