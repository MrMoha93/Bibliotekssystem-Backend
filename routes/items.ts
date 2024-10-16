import express from "express";
import prisma from "./prisma";

const router = express.Router();

router.get("/", async (req, res) => {
  const items = await prisma.item.findMany();
  res.send(items);
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      type,
      author,
      nbrPages,
      runTimeMinutes,
      isBorrowable,
      borrower,
      borrowDate,
      categoryId,
    } = req.body;

    if (!title || !type || !categoryId) {
      return res.status(400).send("Title, type, and categoryId are required.");
    }

    const existingItem = await prisma.item.findUnique({
      where: {
        title: title,
      },
    });

    if (existingItem) {
      return res.status(400).send("An item with this title already exists");
    }

    const newItem = await prisma.item.create({
      data: {
        title,
        type,
        author: author || null,
        nbrPages: nbrPages || null,
        runTimeMinutes: runTimeMinutes || null,
        isBorrowable: isBorrowable || false,
        borrower: borrower || null,
        borrowDate: borrowDate ? new Date(borrowDate) : null,
        categoryId,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).send("An error occurred while creating the item.");
  }
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
    runTimeMinutes,
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

  let borrowDateValue = null;
  if (borrowDate) {
    borrowDateValue = new Date(borrowDate);
    if (isNaN(borrowDateValue.getTime())) {
      return res.status(400).send("Invalid borrow date");
    }
    borrowDateValue = borrowDateValue.toISOString();
  }

  try {
    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        title,
        type,
        author,
        nbrPages,
        runTimeMinutes,
        isBorrowable,
        borrower: borrower || null,
        borrowDate: borrowDateValue,
        categoryId,
      },
    });

    res.send(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).send("An error occurred while updating the item.");
  }
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
