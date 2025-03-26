const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploadspdf/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-pdf-${file.originalname}`);
    }
});

const pdfMiddleware = multer({
    storage: storage,
  limits: {
    fileSize: 10000000 // 10 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed.'));
    }
  }
});

module.exports = pdfMiddleware;

