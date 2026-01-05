import { Router } from "express";
import { TaskController } from "../controllers/taskController.js";

const router = Router();
const controller = new TaskController()

router.get("/", controller.getAll);
router.delete("/", controller.delete);
router.put("/", controller.chageTask);
router.put("/category", controller.changeCategory);
router.post("/", controller.addTask);



export default router;