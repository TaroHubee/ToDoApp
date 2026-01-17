import express from 'express';//webサーバーを作るためのフレームワーク
import taskRoutes from "./routes/taskRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import statusRoutes from "./routes/statusRoutes.js"
import cors from "cors";
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.resolve();

const app = express();
app.use(cors({
    origin: process.env.ORIGIN || "http://localhost:5173",
    credentials: true
}))
const PORT = 3000;

app.use(express.json());
app.use("/task", taskRoutes);
app.use("/category", categoryRoutes);
app.use("/status", statusRoutes)

app.use(express.static(path.join(__dirname, "../frontend")));

app.listen(PORT, () => {
  console.log(`✅ サーバー起動中: http://localhost:${PORT}`);
});