import multer from "multer";
import fs from 'fs';
import { randomUUID } from "crypto";

// Normalizes the filename to UTF-8
const normalizeFileName = (fileName) => {
    return Buffer.from(fileName.trim(), 'latin1').toString('utf8').trim();
};

// Storage configuration
const dest = multer.diskStorage({
    // Set the destination folder for each user
    destination: (req, file, callback) => {
        const dir = `public/uploads/${req.user._id}`;
        fs.mkdirSync(dir, { recursive: true });
        callback(null, dir);
    },
    // Set the filename with a UUID
    filename: (req, file, callback) => {
        const trimmedFileName = normalizeFileName(file.originalname);
        const normalizedFileName = `${randomUUID()}-${trimmedFileName}`;
        req.fileName = `http://localhost:8080/uploads/${req.user._id}/${normalizedFileName}`;
        callback(null, normalizedFileName);
    }
});

// Multer configuration
export const upload = multer({
    storage: dest,
    limits: { fileSize: 1000000 }, // 1MB limit
    fileFilter: (req, file, callback) => {
        const trimmedFileName = normalizeFileName(file.originalname);
        // Allow only PDF, Word, and image files
        if (!trimmedFileName.match(/\.(pdf|docx|doc|png|jpg|jpeg)$/)) {
            return callback(new Error("Please upload a PDF, Word document, or an image"));
        }
        callback(null, true);
    }
}).single('file');  
