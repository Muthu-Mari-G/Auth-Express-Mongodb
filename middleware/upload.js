// import multer from "multer";
// import path from "path";

// // Set where and how files are stored
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Folder to store images
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname); // Unique file name
//   },
// });

// // File filter for only images
// const upload = multer({
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
//       return cb(new Error("Only images are allowed"), false);
//     }
//     cb(null, true);
//   },
// });

// export default upload;



import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp + original extension
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

// File filter to allow only images by mimetype
function fileFilter(req, file, cb) {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, and .png files are allowed"), false);
  }
}

// Upload middleware with size limit 5MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;