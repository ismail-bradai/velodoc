import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import path from 'path';

import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();

app.use(cookieParser());
// Allow requests from localhost:8080 ....
app.use(cors({
  origin: 'https://localhost:8080',
  credentials: true, // if you're using cookies/auth
}));



// Or allow all (for dev only)
// app.use(cors());

app.use(express.json());
app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
// HTTPS configuration
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '../certificates/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../certificates/cert.pem'))
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});

//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
