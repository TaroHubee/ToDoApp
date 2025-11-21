import sqlite3 from 'sqlite3';
import {open} from 'sqlite';

export const connectDB = async () => {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });
  // tasks テーブルがなければ作成
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT,
      category TEXT,
      due TEXT,
      status TEXT
    )
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS category (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT
    )
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT
    )
  `);
  return db;
}

