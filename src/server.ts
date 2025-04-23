import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { analyzeDocument } from './api/analyze';
import { BANKRUPTCY_ANALYZER_API } from './config/apiConfig';

// Create Express server
const app = express();
const port = 8080;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// API endpoints
app.post(BANKRUPTCY_ANALYZER_API.endpoints.analyze, upload.single('file'), analyzeDocument);

// Status endpoint
app.get(BANKRUPTCY_ANALYZER_API.endpoints.status, (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Bankruptcy analyzer API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Bankruptcy analyzer API running at http://localhost:${port}`);
});
