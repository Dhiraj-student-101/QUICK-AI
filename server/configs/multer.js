// import multer from 'multer'
// import fs from 'fs'
// import path from 'path'

// const uploadDir = path.join(process.cwd(), 'uploads')

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true })
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir)
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
//     cb(null, uniqueSuffix + '-' + file.originalname)
//   },
// })

// const upload = multer({ storage })

// export default upload

import multer from 'multer';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Use os.tmpdir() on Vercel, and 'uploads' on local development
const uploadDir = process.env.VERCEL ? path.join(os.tmpdir(), 'uploads') : 'uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;