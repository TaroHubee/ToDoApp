import { connectDB } from "../db/database.js"

export class StatusRepository {
    async findAll() {
        const db = await connectDB();
        return db.all(`
            SELECT * FROM statuses
        `)
    }

    async add(name: string) {
        const db = await connectDB();
        const result = await db.run(`INSERT INTO statuses (name) VALUES (?)`, [name])
        return {result: "success", id: result.lastID, message: `${name}を追加しました`};
    }

    async change(id: number, name: string) {
        const db = await connectDB();
        await db.run(`UPDATE statuses SET name = ? WHERE id = ?`, [name, id]);
        return {message: "Done", exitId: null} as const;
    }

    async isAlreadyRegisterd(next: string): Promise<number | null> {
        const db = await connectDB();
        const row = await db.get<{ id: number }>(`SELECT id FROM statuses WHERE name = ? LIMIT 1`,[next]);

        if (row === undefined) {
            return null;
        }
        return row.id;

    }

    async delete(id: number) {
        const db = await connectDB();
        db.run(`
            DELETE FROM statuses WHERE id = ?
        `,[id]);
        return {message: "Delete", deleteId: id};
    }

    async chengeIsDone(id: number) {
        const db = await connectDB();
        await db.run(`
            UPDATE statuses SET is_done = 0 WHERE is_done = 1;
        `);
        await db.run(`
            UPDATE statuses SET is_done = 1 WHERE id = ?;
        `,[id]);
        return {message: "success"}
    }

    async IsDone(id: number) {
        const db = await connectDB();
        const row = await db.get<{ id: number }>(
            `SELECT id FROM statuses WHERE is_done = 1`
        );
        if (row?.id === id) {
            return {result: true};
        } else {
            return {result: false};
        }
    }

    async getDoneStatus() {
        const db = await connectDB();
        const row = await db.get< { id: number } | undefined >(`
            SELECT id FROM statuses WHERE is_done = 1
        `);

        if (!row) {
            return { result: "success", id: null };
        }

        return { result: "success", id: row.id };
    }

}