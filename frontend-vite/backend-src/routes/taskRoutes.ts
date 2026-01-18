import { Router } from "express";
import { TaskController } from "../controllers/taskController.js";

const router = Router();
const controller = new TaskController()

router.get("/", controller.getAll);
router.delete("/", controller.delete);
router.put("/", controller.chageTask);
router.put("/category", controller.changeCategory);
router.post("/", controller.addTask);
router.put("/previous", controller.putPrevious);
router.post("/isDone", controller.isDone);
router.post("/previous", controller.getPreviousStatus);



export default router;