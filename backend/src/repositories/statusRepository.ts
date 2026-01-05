import { connectDB } from "../db/database.js"

export class StatusRepository {
    async findAll() {
        const db = await connectDB();
        return db.all(`
            SELECT * FROM status
        `)
    }

    async add(name: string) {
        const db = await connectDB();
        const result = await db.run(`INSERT INTO status (name) VALUES (?)`, [name])
        return {result: "success", id: result.lastID, message: `${name}を追加しました`};
    }

    async change(id: number, name: string) {
        const db = await connectDB();
        await db.run(`UPDATE status SET name = ? WHERE id = ?`, [name, id]);
        return {message: "Done", exitId: null} as const;
    }

    async isAlreadyRegisterd(next: string): Promise<number | null> {
        const db = await connectDB();
        const row = await db.get<{ id: number }>(`SELECT id FROM status WHERE name = ? LIMIT 1`,[next]);

        if (row === undefined) {
            return null;
        }
        return row.id;

    }

    async delete(id: number) {
        const db = await connectDB();
        db.run(`
            DELETE FROM status WHERE id = ?
        `,[id]);
        return {message: "Delete", deleteId: id};
    }
}