import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { items: true },
    });
    res.status(200).send(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("An error occurred while fetching categories.");
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res
      .status(400)
      .send("Category name is required and must be a non-empty string.");
  }

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return res.status(400).send("Category name must be unique");
    }

    const newCategory = await prisma.category.create({
      data: { name: name.trim() },
    });

    res.status(201).send(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).send("An error occurred while creating the category.");
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res
      .status(400)
      .send("Category name is required and must be a non-empty string.");
  }

  try {
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
      data: { name: name.trim() },
    });

    res.status(200).send(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).send("An error occurred while updating the category.");
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).send("Category not found");
    }

    const items = await prisma.item.findMany({
      where: {
        category: {
          id: id,
        },
      },
    });

    if (items.length > 0) {
      return res
        .status(400)
        .send(
          "Cannot delete category with existing items. Please remove the related items first."
        );
    }

    await prisma.category.delete({
      where: { id },
    });

    res.status(200).send(`Category with ID ${id} has been deleted.`);
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).send("An error occurred while deleting the category.");
  }
});

export default router;
