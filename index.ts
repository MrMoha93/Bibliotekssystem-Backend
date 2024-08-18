import express from "express";
const app = express();

app.get("/api/test", (req, res) => {
  return res.send("My first API endpoint");
});

const PORT = 5588;

app.listen(PORT, () => console.log("Listening on port 5588" + PORT));

// Intensive Foods Backend - Array in memory 10:50
