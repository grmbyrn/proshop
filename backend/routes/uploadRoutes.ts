import path from 'path'
import express from 'express'
import multer, { type FileFilterCallback } from 'multer'
import type { Request } from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
const router = express.Router()

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploads/')
    },
    filename(req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    const filetypes = /jpe?g|png|webp/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;
  
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = mimetypes.test(file.mimetype);
  
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  }

const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB
const uploadSingleImage = upload.single('image');

router.post('/', protect, admin, (req, res) => {
    uploadSingleImage(req, res, function (err) {
        if (err) {
        return res.status(400).send({ message: err.message });
        }

        if (!req.file) {
        return res.status(400).send({ message: 'No image file provided' });
        }

        res.status(200).send({
        message: 'Image uploaded successfully',
        image: `/${req.file.path}`,
        });
    });
});

export default router