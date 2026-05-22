import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/payment-proofs",
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const uploadPaymentProofImage = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Solo se permiten imágenes JPG o PNG"));
    }

    cb(null, true);
  },
});