import { stat } from "fs";
import { connectDB } from "../db/database.js"

export class TaskRepository {
    async findAll() {
        const db = await connectDB();
        return db.all(`
            SELECT t.id, t.task, t.due, c.name AS category, s.name AS status FROM tasks t LEFT JOIN category c ON t.categoryId = c.id LEFT JOIN statuses s ON t.statusId = s.id    
        `);
    }

    async deleteTask(id: number) {
        try {
            const db = await connectDB();
            db.all(`
                DELETE FROM tasks WHERE id = ?
            `,[id]);
            console.log(`[delete]tasks id = ${id}`)
            return {result: "success"};
        } catch (error) {
            return JSON.stringify({message: "削除できませんでした"});
        }
        
    }

    async changeTask(id: number, task: string, categoryId: number | null, due: string, statusId: number | null) {
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

    async putPrevious(id: number) {
        try {
            const db = await connectDB();
            const row = await db.get< { statusId: number } | undefined >(`
                SELECT statusId FROM tasks WHERE id = ?
            `,[id]);
            if (!row) {
                return {result: "fail", err: "put previous"};
            }
            await db.run(`
                UPDATE tasks SET previousStatusId = ? WHERE id = ?
            `,[row.statusId, id])
            return {result: "success"}
        } catch (err) {
            return {result: "fail", err: "put previous"};
        }
    }

    async changeStatus(id: number, statusId: number | null) {
        try {
            const db = await connectDB();
            const result = await db.run(`
                UPDATE tasks SET statusId = ? WHERE id = ?
            `,[statusId, id])
            return {result: "success"}
        } catch (err) {
            return {result: "fail", err: "change status"};
        }
    }

    async isDone(id: number) {
        let doneStatusId;
        let statusId;
        try {
            const db = await connectDB();
            const row = await db.get< { id: number } | undefined >(`
                SELECT id FROM statuses WHERE is_done = 1;
            `);
            doneStatusId = row?.id;
        } catch (err) {
            return {result: "fail", err: "get done status id"};
        }

        try {
            const db = await connectDB();
            const row = await db.get< { statusId: number } | undefined >(`
                SELECT statusId FROM tasks WHERE id = ?;
            `,[id]);
            statusId = row?.statusId;
        } catch (err) {
            return {result: "fail", err: "get status id"};
        }

        if (doneStatusId === statusId) {
            return {result: "success", judge: true};
        } else {
            return {result: "success", judge: false};
        }
    }

    async getPreviousStatusId(id: number) {
        try {
            const db = await connectDB();
            const row = await db.get< { previousStatusId: number } | undefined >(`
                SELECT previousStatusId FROM tasks WHERE id = ?
            `,[id]);
            return {result: "success", previousStatusId: row?.previousStatusId};
        } catch (err) {
            return {result: "fail", err: "get previous status is NULL"};
        }
    }
}