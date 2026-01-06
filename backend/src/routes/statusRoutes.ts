import { Router } from "express";
import { StatusController } from "../controllers/statusController.js";

const router = Router();
const statusController = new StatusController()

router.get("/", statusController.getAll);
router.post("/", statusController.add);
router.put("/", statusController.change);
router.delete("/", statusController.delete);
router.put("/changeIsDone", statusController.changeIsDone);
router.post("/isDone", statusController.isDone);

export default router;