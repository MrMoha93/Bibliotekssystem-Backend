import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { items: true },
  });
  res.send(categories);
});

router.post("/", async (req, res) => {
  const name = req.body.name;

  const existingCategory = await prisma.category.findUnique({
    where: { name },
  });

  if (existingCategory) {
    return res.status(400).send("Category name must be unique");
  }

  const newCategory = await prisma.category.create({
    data: { name },
  });

  res.send(newCategory);
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return res.status(404).send("Category not found");
  }

  const existingCategory = await prisma.category.findUnique({
    where: { name },
  });

  if (existingCategory && existingCategory.id !== id) {
    return res.status(400).send("Category name must be unique");
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: { name },
  });

  res.send(updatedCategory);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const category = await prisma.category.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!category) {
    return res.status(404).send("Category not found");
  }

  if (category.items.length > 0) {
    return res.status(400).send("Cannot delete category with existing items");
  }

  await prisma.category.delete({
    where: { id },
  });

  res.send(`Category with ID ${id} has been deleted.`);
});

export default router;
