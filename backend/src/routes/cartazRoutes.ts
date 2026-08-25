import { Router } from "express";

import {
  listarCartazes,
  buscarCartazPorId,
  criarCartaz,
  atualizarCartaz,
  deletarCartaz
} from "../controllers/cartazController";

const router = Router();

router.get("/", listarCartazes);

router.get("/:id", buscarCartazPorId);

router.post("/", criarCartaz);

router.put("/:id", atualizarCartaz);

router.delete("/:id", deletarCartaz);

export default router;