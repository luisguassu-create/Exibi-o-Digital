"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const nomeArquivo = `${Date.now()}-${Math.round(Math.random() * 100000)}` +
            path_1.default.extname(file.originalname);
        cb(null, nomeArquivo);
    }
});
const upload = (0, multer_1.default)({
    storage
});
router.post("/", upload.single("imagem"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            mensagem: "Nenhuma imagem foi enviada."
        });
    }
    const caminho = `http://localhost:3001/uploads/${req.file.filename}`;
    res.status(201).json({
        mensagem: "Imagem enviada com sucesso.",
        caminho
    });
});
exports.default = router;
