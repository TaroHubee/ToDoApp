import { stat } from "fs";
import { connectDB } from "../db/database.js"

export class TaskRepository {
    async findAll() {
        const db = await connectDB();
        return db.all(`
            SELECT t.id, t.task, t.due, c.name AS category, s.name AS status FROM tasks t LEFT JOIN category c ON t.categoryId = c.id LEFT JOIN status s ON t.statusId = s.id    
        `);
    }

    async deleteTask(id: number) {
        try {
            const db = await connectDB();
            db.all(`
                DELETE FROM tasks WHERE id = ?
            `,[id]);
            console.log(`[delete]tasks id = ${id}`)
            return JSON.stringify({id: id})
        } catch (error) {
            return JSON.stringify({message: "削除できませんでした"});
        }
        
    }

    async changeTask(id: number, task: string, categoryId: number, due: string, statusId: number) {
        try {
            const db = await connectDB();
            await db.run(`
                UPDATE tasks SET task = ?, categoryId = ?, due = ?, statusId = ? WHERE id = ?
            `, [task, categoryId, due, statusId, id]);
            return {result: "success", message: "タスク内容を変更しました"};
        } catch (err) {
            return {result: "fail", message: err};
        }
    }
    async changeCategory(currentId: number, nextId: number) {
        try {
            const db = await connectDB();
            await db.run(`
                UPDATE tasks SET categoryId = ? WHERE categoryId = ?
            `,[nextId, currentId]);
            return JSON.stringify({message: `当該タスクのカテゴリIDを${currentId}->${nextId}に変更しました.`});
        } catch (error) {
            return JSON.stringify({message: "登録タスクのカテゴリを変更できませんでした"});
        }
    }

    async addTask(task: string) {
        try {
            const db = await connectDB();
            const result = await db.run(`
                INSERT INTO tasks (task) VALUES (?)
            `,[task]);
            return {result: "success", id: result.lastID, message: "タスクを追加しました"};

        } catch (err) {
            return {result: "fail", id: null, message: "Error: タスク追加エラー"};
        }
    }
}