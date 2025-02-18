import express from "express";
import sequelize from "./config/sequelize";
import authRoutes from "./routes/authRoute";
import gddRoutes from "./routes/gddRoutes";
import gameplayRoutes from "./routes/gameplayRoutes";
import mechanicRoutes from "./routes/mechanics/mechanicsRoutes";
import mechanicTypeRoutes from "./routes/mechanics/mechanicsTypesRoutes";
import cors from "cors";
import characterRoutes from "./routes/characterRoutes";
import path from "path";
import locationRoutes from "./routes/locationRoutes";

sequelize
  .sync()
  .then(() => {
    console.log("db connected");
  })
  .catch((e) => {
    console.log("error syncing with db", e);
  });

const app = express();
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Разрешить CORS для всех доменов
app.use(
  cors({
    origin: "*", // Разрешить все домены
    methods: ["GET", "POST", "PUT", "DELETE"], // Разрешенные HTTP-методы
    allowedHeaders: ["Content-Type", "Authorization"], // Разрешенные заголовки
  })
);

app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", gddRoutes);
app.use("/api", gameplayRoutes);
app.use("/api", mechanicRoutes);
app.use("/api", mechanicTypeRoutes);
app.use("/api", characterRoutes);
app.use("/api", locationRoutes);

app.listen(8801, () => {
  console.log("connected");
});
