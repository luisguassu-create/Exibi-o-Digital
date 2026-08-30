import { Router } from "express";
import { listarCartazesAtivos } from "../controllers/cartazController";

const router = Router();

router.get("/cartazes", listarCartazesAtivos);

export default router;