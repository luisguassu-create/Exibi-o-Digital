import { Router } from "express";
import multer from "multer";
import path from "path";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const nomeArquivo =
      `${Date.now()}-${Math.round(Math.random() * 100000)}` +
      path.extname(file.originalname);

    cb(null, nomeArquivo);
  }
});

const upload = multer({
  storage
});

router.post("/", upload.single("imagem"), (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      mensagem: "Nenhuma imagem foi enviada."
    });
  }

  const caminho = `http://localhost:3000/uploads/${req.file.filename}`;

  res.status(201).json({
    mensagem: "Imagem enviada com sucesso.",
    caminho
  });

});

export default router;