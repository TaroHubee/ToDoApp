import sqlite3 from 'sqlite3';
import {open} from 'sqlite';
import path from "path";
import { fileURLToPath } from "url";
import { app } from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 開発時と本番時でデータベースパスを切り替え
const isDev = process.env.NODE_ENV === 'development' || !app?.isPackaged;

const getDBPath = () => {
  if (isDev) {
    // 開発時: プロジェクトルートの database フォルダ
    return path.join(__dirname, "..", "..", "database", "database.db");
  } else {
    // 本番時: ユーザーの AppData フォルダ
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, 'database.db');
  }
};

export const connectDB = async () => {
  const dbPath = getDBPath();
  console.log("DB PATH:", dbPath);
  
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  
  // tasks テーブルがなければ作成
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT,
      categoryId INTEGER,
      due TEXT,
      statusId INTEGER,
      previousStatusId INTEGER
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

