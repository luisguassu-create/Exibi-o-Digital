"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cartazRoutes_1 = __importDefault(require("./routes/cartazRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const tvRoutes_1 = __importDefault(require("./routes/tvRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static("uploads"));
app.get("/", (req, res) => {
    res.json({
        mensagem: "Backend funcionando!"
    });
});
app.use("/cartazes", cartazRoutes_1.default);
app.use("/upload", uploadRoutes_1.default);
app.use("/tv", tvRoutes_1.default);
exports.default = app;
