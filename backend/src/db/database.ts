import sqlite3 from 'sqlite3';
import {open} from 'sqlite';
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const connectDB = async () => {
  console.log("DB PATH:", path.join(__dirname, "..", "..", "..", "database", "database.db"));
  const db = await open({
    filename: path.join(__dirname, "..", "..", "..", "database", "database.db"),
    driver: sqlite3.Database
  });
  // tasks テーブルがなければ作成
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT,
      categoryId INTEGER,
      due TEXT,
      statusId INTEGER
    )
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS category (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS statuses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      is_done INTEGER NOT NULL DEFAULT 0
    );
  `);

  await db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_one_done_status
    ON statuses (is_done)
    WHERE is_done = 1;
  `);

  const row = await db.get(`
    SELECT COUNT(*) as count FROM statuses
  `);

  if (row.count === 0) {
    await db.exec(`
      INSERT INTO statuses (name, is_done) VALUES
        ('Ready', 0),
        ('In Progress', 0),
        ('Done', 1);
    `);
  }


  return db;
}

