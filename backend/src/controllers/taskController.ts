import { Request, Response } from "express";
import { TaskService } from "../services/taskService.js";
import { CategoryService } from "../services/categoryService.js";
import { StatusService } from "../services/statusService.js";
import { error } from "console";
import { NONAME } from "dns";

const services = new TaskService();
const categoryService = new CategoryService();
const statusService = new StatusService();

export class TaskController {
    getAll = async (_req: Request, res: Response) => {
        try {
            const tasks = await services.getAllTasks();
            res.json(tasks);
        } catch (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    delete = async (req: Request, res: Response) => {
        try {
            const deleteTask = await services.deleteTask(req.body.id);
            res.json(deleteTask);
        } catch (err) {
            console.error("DB Error", err);
            return res.status(500).json({message: `[Error] Cannot delete task ${req.body.deleteTask}`});
        }
    }

    chageTask = async (req: Request, res: Response) => {
        //categoryIdを取得
        let categoryId: number | null;
        try {
            if (req.body.category === "") {
                categoryId = null;
            } else {
                const response = await categoryService.changeCategory(req.body.id, req.body.category);

                if (response.message !== "exited") {
                    const response_add = await categoryService.addCategory(req.body.category);
                    if (response_add.id === null) {
                        const err = new Error("カテゴリー追加失敗");
                        throw err;
                    }
                    categoryId = response_add.id!;
                } else {
                    categoryId = response.exitId;
                }
            }
        } catch (err) {
            return res.status(500).json({ message: err });
        }
        //statusIdを取得
        let statusId: number | null;
        try {
            if (req.body.status === "") {
                statusId = null;
            } else {
                const response = await statusService.changeStatus(req.body.id, req.body.status);

                if (response.message !== "exited") {
                    const response_add = await statusService.addStatus(req.body.status);
                    if (response_add.id === null) {
                        const err = new Error("ステータス追加失敗");
                        throw err;
                    }
                    statusId = response_add.id!;
                } else {
                    statusId = response.exitId;
                }
            }
            
        } catch (err) {
            return res.status(500).json({ message: err });
        }

        try {
            const changeTaskMessage = await services.changeTask(req.body.id, req.body.task, categoryId, req.body.due, statusId);
            res.json(changeTaskMessage);
        } catch (error) {
            res.json(error);
        }
    }

    changeCategory = async (req: Request, res: Response) => {
        try {
            const changeMessage = await services.changeCategory(req.body.currentId, req.body.nextId);
            res.json(changeMessage);
        } catch (err) {
            console.error("DB Error", err);
            return res.status(500).json({message: "[Error] DB error"});
        }
    }

    addTask = async (req: Request, res: Response) => {
        try {
            const task = await services.addTask(req.body.task);
            const id = task.id;
            return res.json({result: "success", id: id});
        } catch (err) {
            return res.json({result: "fail", id: null});
        }
    }

    putPrevious = async (req: Request, res: Response) => {
        let message;
        try {
            message = await services.putPrevious(req.body.id);
        } catch (err) {
            return res.status(500).json({result: "fail", err: "put previous controller 1"});
        }
        if (message.result === "fail") {
            return res.status(500).json({result: "fail", err: "put previous controller 2"});
        }
        
        try {
            message = await statusService.getDoneStatus();
        } catch (err) {
            return res.status(500).json({result: "fail", err: "get Done status controller"});
        }
        if (message.result === "fail" || message.id === null) {
            return res.status(500).json({result: "fail", err: "get Done status controller"});
        }

        try {
            message = await services.chengeStatus(req.body.id, message.id);
            if (message.result === "success") {
               return res.json(message); 
            } else {
                return res.status(500).json(message);
            }
        } catch (err) {
            return res.status(500).json({result: "fail", err: "change status controller"});
        }
    }

    isDone = async (req: Request, res: Response) => {
        try {
            const message = await services.isDone(req.body.id);
            if (message.result === "success" && message.judge) {
                return res.json({result: true});
            } else {
                return res.json({result: false});
            }
        } catch (err) {
            return res.json({result: false});
        }
    }

    getPreviousStatus = async (req: Request, res: Response) => {
        let previousStatusId: number;
        try {
            const message = await services.getPreviousStatus(req.body.id);
            if (message.result === "success" && message.previousStatusId !== null) {
                previousStatusId = message.previousStatusId!;
            } else {
                return res.json({result: "fail", previousStatusId: null});
            }
        } catch (err) {
            return res.json({result: "fail", previousStatusId: null});
        }

        try {
            const message = await services.chengeStatus(req.body.id, previousStatusId);
            if (message.result === "success") {
                return res.json({result: "success", previousStatusId: previousStatusId});
            } else {
                return res.json({result: "fail", previousStatusId: null});
            }
        } catch (err) {
            
        }
    }
}