import path from 'node:path';
import pdfParse from 'pdf-parse';
import { createWorker } from 'tesseract.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Map([
  ['application/pdf', 'pdf'],
  ['image/jpeg', 'image'],
  ['image/png', 'image'],
  ['image/webp', 'image']
]);

function safeName(originalName = '') {
  return path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function validateDocument(file) {
  if (!file) {
    return { valid: false, message: 'Select a PDF or supported image file.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, message: 'The document must be 5 MB or smaller.' };
  }

  if (!allowedTypes.has(file.mimetype)) {
    return { valid: false, message: 'Only PDF, JPG, PNG, or WEBP files are supported.' };
  }

  return { valid: true, kind: allowedTypes.get(file.mimetype) };
}

async function extractPdfText(buffer) {
  const result = await pdfParse(buffer);
  return result.text.trim();
}

async function extractImageText(buffer) {
  const worker = await createWorker('eng');
  try {
    const result = await worker.recognize(buffer);
    return result.data.text.trim();
  } finally {
    await worker.terminate();
  }
}

export async function processDocument(file) {
  const validation = validateDocument(file);
  if (!validation.valid) {
    const error = new Error(validation.message);
    error.statusCode = 400;
    throw error;
  }

  const extractedText = validation.kind === 'pdf'
    ? await extractPdfText(file.buffer)
    : await extractImageText(file.buffer);

  return {
    filename: safeName(file.originalname),
    mimeType: file.mimetype,
    size: file.size,
    extractedText,
    extractionStatus: extractedText ? 'needs_confirmation' : 'empty',
    sourceType: 'ocr_extracted',
    verificationStatus: 'needs_confirmation',
    stored: false
  };
}

export { MAX_FILE_SIZE };