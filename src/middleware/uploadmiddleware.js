const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  }
});

const uploadMiddleware = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (    
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/gif'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg, .png and .gif files are allowed!'), false);
    }
  }
});

module.exports = uploadMiddleware;