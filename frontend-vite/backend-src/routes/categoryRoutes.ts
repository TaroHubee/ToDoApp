import { Router } from "express";
import { CategoryController } from "../controllers/categoryController.js";

const router = Router();
const categoryController = new CategoryController()

router.get("/", categoryController.getAll);
router.post("/", categoryController.add);
router.put("/", categoryController.change);
router.delete("/", categoryController.delete);

export default router;