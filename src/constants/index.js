import path from 'node:path';
import fs from 'node:fs';

export const FIFTEEN_MINUTES = 1000 * 60 * 15;
export const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

//-----------------------------------------------------

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

//-----------------------------------------------------

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'API_KEY',
  API_SECRET: 'API_SECRET',
};

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

const demoNotesPath = path.resolve('./src/db/default/demo-notes.json');
export const demoNotes = JSON.parse(fs.readFileSync(demoNotesPath, 'utf-8'));
