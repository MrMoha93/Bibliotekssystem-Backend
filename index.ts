import categories from "./routes/categories";
import items from "./routes/items";
import express from "express";

const app = express();

app.use(express.json());
app.use("/api/categories", categories);
app.use("/api/items", items);

const PORT = 5588;

app.listen(PORT, () => console.log("Listening on port " + PORT));
