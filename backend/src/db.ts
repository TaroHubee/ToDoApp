import sqlite3 from 'sqlite3';
import {open} from 'sqlite';
import path from "path";
import { fileURLToPath } from "url";

export const connectDB = async () => {
  const db = await open({
    filename: path.join(__dirname, "../../database/database.db"),
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
      category TEXT NOT NULL UNIQUE
    )
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT NOT NULL UNIQUE
    )
  `);
  await db.exec(`
    DROP TABLE IF EXISTS tasks
  `); // usersテーブルを削除
  await db.exec(`
    DROP TABLE IF EXISTS category
  `); // usersテーブルを削除
  await db.exec(`
    DROP TABLE IF EXISTS status
  `); // usersテーブルを削除

  
  return db;
}

