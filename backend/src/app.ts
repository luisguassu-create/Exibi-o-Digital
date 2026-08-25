import express from "express";
import cors from "cors";

import cartazRoutes from "./routes/cartazRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import tvRoutes from "./routes/tvRoutes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({
    mensagem: "Backend funcionando!"
  });
});

app.use("/cartazes", cartazRoutes);

app.use("/upload", uploadRoutes);

app.use("/tv", tvRoutes);

export default app;