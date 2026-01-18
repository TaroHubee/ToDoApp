import { Request, Response } from "express";
import { CategoryService } from "../services/categoryService.js";

const categoryService = new CategoryService();
type Category = {
    id: number;
    name: string;
}
export class CategoryController {
    
    getAll = async (_req: Request, res: Response) => {
        try {
            const categories: Category[] = await categoryService.getAllCategories();
            res.json(categories);
        } catch (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    add = async (req: Request, res: Response) => {
        try {
            const category = await categoryService.addCategory(req.body.name);
            res.json(category);
            
        } catch (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }



    change = async (req: Request, res: Response) => {
        try {
            const category = await categoryService.changeCategory(req.body.id, req.body.next);
            res.json(category);
        } catch (err) {
            console.error("DB Error: erar");
            return res.status(500).json({ message: "error", exitId: null });
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            const deleteCategory = await categoryService.deleteCategory(req.body.id);
            res.json(deleteCategory);
        } catch (error) {
            console.error("message: DB Error");
            return res.status(500).json({message: "error", deleteId: null});
        }
    }
}