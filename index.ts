import categories from "./routes/categories";
import items from "./routes/items";
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5588",
      "http://localhost:4173",
      "https://bibliotekssystem-frontend3.onrender.com",
    ],
  })
);
app.use(express.json());
app.use("/api/categories", categories);
app.use("/api/items", items);

const PORT = process.env.PORT || 5588;

app.listen(PORT, () => console.log(`Listening on port  ${PORT}`));
