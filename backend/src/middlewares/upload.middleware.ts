import multer from "multer";
import path from "path";

const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];

/**
 * Configuración para comprobantes de pago
 */
const paymentProofStorage = multer.diskStorage({
  destination: "uploads/payment-proofs",
  filename: (_req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${fileExtension}`;

    cb(null, uniqueName);
  },
});

export const uploadPaymentProofImage = multer({
  storage: paymentProofStorage,
  fileFilter: (_req, file, cb) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return cb(new Error("Solo se permiten imágenes JPG o PNG"));
    }

    cb(null, true);
  },
});

/**
 * Configuración para imágenes de publicaciones
 */
const postStorage = multer.diskStorage({
  destination: "uploads/posts",
  filename: (_req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${fileExtension}`;

    cb(null, uniqueName);
  },
});

export const uploadPostImage = multer({
  storage: postStorage,
  fileFilter: (_req, file, cb) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return cb(new Error("Solo se permiten imágenes JPG o PNG"));
    }

    cb(null, true);
  },
});