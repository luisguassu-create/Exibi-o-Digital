"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartazController_1 = require("../controllers/cartazController");
const router = (0, express_1.Router)();
router.get("/cartazes", cartazController_1.listarCartazesAtivos);
exports.default = router;
