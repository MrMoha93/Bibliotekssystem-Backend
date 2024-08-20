import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const items = await prisma.item.findMany();
  res.send(items);
});

router.post("/", async (req, res) => {
  const {
    title,
    type,
    author,
    nbrPages,
    isBorrowable,
    borrower,
    borrowDate,
    categoryId,
  } = req.body;

  const existingItem = await prisma.item.findUnique({
    where: {
      title: title,
    },
  });

  if (existingItem) {
    return res
      .status(400)
      .send("An item with this title and type already exists");
  }

  const newItem = await prisma.item.create({
    data: {
      title,
      type,
      author,
      nbrPages,
      isBorrowable,
      borrower,
      borrowDate,
      categoryId,
    },
  });

  res.send(newItem);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const item = await prisma.item.findUnique({
    where: { id },
  });

  if (!item) {
    return res.status(404).send("Item not found");
  }

  res.send(item);
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const {
    title,
    type,
    author,
    nbrPages,
    isBorrowable,
    borrower,
    borrowDate,
    categoryId,
  } = req.body;

  const existingItem = await prisma.item.findUnique({
    where: { id },
  });

  if (!existingItem) {
    return res.status(404).send("Item not found");
  }

  const updatedItem = await prisma.item.update({
    where: { id },
    data: {
      title,
      type,
      author,
      nbrPages,
      isBorrowable,
      borrower,
      borrowDate,
      categoryId,
    },
  });

  res.send(updatedItem);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const item = await prisma.item.findUnique({
    where: { id },
  });

  if (!item) {
    return res.status(404).send("Item not found");
  }

  await prisma.item.delete({
    where: { id },
  });

  res.send("Item deleted");
});

export default router;
