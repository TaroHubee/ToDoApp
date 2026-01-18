import { connectDB } from "../db/database.js"

export class CategoryRepository {
    async findAll() {
        const db = await connectDB();
        return db.all(`
            SELECT * FROM category
        `)
    }

    async add(name: string) {
        const db = await connectDB();
        const result = await db.run(`INSERT INTO category (name) VALUES (?)`, [name])
        return {result: "success", id: result.lastID, message: `${name}を追加しました`};
    }

    async change(id: number, name: string) {
        const db = await connectDB();
        await db.run(`UPDATE category SET name = ? WHERE id = ?`, [name, id]);
        return {message: "Done", exitId: null} as const;
    }

    async isAlreadyRegisterd(next: string): Promise<number | null> {
        const db = await connectDB();
        const row = await db.get<{ id: number }>(`SELECT id FROM category WHERE name = ? LIMIT 1`,[next]);

        if (row === undefined) {
            return null;
        }
        return row.id;

    }

    async delete(id: number) {
        const db = await connectDB();
        db.run(`
            DELETE FROM category WHERE id = ?
        `,[id]);
        return {message: "Delete", deleteId: id};
    }
}