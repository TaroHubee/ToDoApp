import { Request, Response } from "express";
import { StatusService } from "../services/statusService.js";

const statusService = new StatusService();
type Status = {
    id: number;
    name: string;
}
export class StatusController {
    
    getAll = async (_req: Request, res: Response) => {
        try {
            const statuses: Status[] = await statusService.getAllStatuses();
            res.json(statuses);
        } catch (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    add = async (req: Request, res: Response) => {
        try {
            const status = await statusService.addStatus(req.body.name);
            res.json(status);
            
        } catch (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }



    change = async (req: Request, res: Response) => {
        try {
            const status = await statusService.changeStatus(req.body.id, req.body.next);
            res.json(status);
        } catch (err) {
            console.error("DB Error: erar");
            return res.status(500).json({ message: "error", exitId: null });
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            const deleteStatus = await statusService.deleteStatus(req.body.id);
            res.json(deleteStatus);
        } catch (error) {
            console.error("message: DB Error");
            return res.status(500).json({message: "error", deleteId: null});
        }
    }
}