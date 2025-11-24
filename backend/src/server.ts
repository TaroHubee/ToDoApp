import express from 'express';//webサーバーを作るためのフレームワーク
import cors from 'cors';//フロント側から別ポートにアクセスできるようにする
import { connectDB } from './db';
import { error } from 'console';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors())

type TaskInfo = {
    task: string,
    category: string,
    due: string,
    status: string
}
app.post('/add-task', async(req,res) => {
    const taskInfo: TaskInfo = req.body;
    console.log(taskInfo);
    try {
        const db = await connectDB();

        // 1. 登録 or 無視
        await db.run("INSERT OR IGNORE INTO category (category) VALUES (?);", [taskInfo.category]);

        // 2. id を取得
        const row = await db.get("SELECT id FROM category WHERE category = ?;", [taskInfo.category]);
        const categoryId = row.id;
        
        await db.run(
            'INSERT INTO tasks (task, categoryId, due, status) VALUES (?, ?, ?, ?)',
            [taskInfo.task, categoryId, taskInfo.due, taskInfo.status]
        );
        console.log('DBに保存完了：', req.body);

        res.json({message: 'タスクを保存しました', taskInfo});
    } catch (err) {
        console.error('DBエラー：', err);
        res.status(500).json({message: 'データベースエラー'});
    }
});



type CategoryInfo = {
    category: string
}
app.post('/add-category', async(req,res) => {
    const categoryInfo: CategoryInfo = req.body;
    console.log(categoryInfo);
    try {
        const db = await connectDB();
        await db.run("INSERT OR IGNORE INTO category (category) VALUES (?);", [categoryInfo.category]);
        console.log('DBに保存完了：', req.body);
        res.json({message: 'カテゴリーを追加しました', categoryInfo})
    } catch (err) {
        console.error('DBエラー：', err);
        res.status(500).json({message: 'データベースエラー'});
    }
})


app.get( '/get-category', async(req,res) => {
    const isReq = req.query.id;
    const db = await connectDB();
    if (isReq) {
        try {
            const categoryId: number = Number(isReq);
            console.log('ブラウザから次のカテゴリーIDを取得', categoryId);
            
            const category = await db.get("SELECT * FROM category WHERE id = ?", [categoryId]);
            console.log('DBから次のカテゴリーを送信', category);
            res.json({category: category.category});
        } catch (err) {
            console.error('DBエラー：', err);
            res.status(500).json({message: 'データベースエラー'});
        }
    } else {
        try {
            const rows = await db.all("SELECT * FROM category");
            console.log('DBから次のカテゴリーを送信', rows);
            res.json(rows);
        } catch (err) {
            console.error('DBエラー：', err);
            res.status(500).json({message: 'データベースエラー'});
        }
    }
    
})

app.get( '/get-task', async(req,res) => {
    try {
        const db = await connectDB();

        const rows = await db.all("SELECT * FROM tasks");
        console.log('DBから次のカテゴリーを送信', rows);
        res.json(rows);
    } catch (err) {
        console.error('DBエラー：', err);
        res.status(500).json({message: 'データベースエラー'});
    }
})

type ChangeInfo = {
    id: number,
    before: string,
    after: string,
}
app.post('/change-category', async(req,res) => {
    const changeInfo: ChangeInfo = req.body;
    console.log(changeInfo);
    try {
        const db = await connectDB();
        const rows = await db.all("SELECT category FROM category");
        const isDuplicate = rows.some(Element => Element.category === changeInfo.after);
        if (isDuplicate) {
            return res.status(409).json({
                result: "failed", message: "同じカテゴリーが既に存在します。", content: changeInfo
            });
        }
        await db.run(
            "UPDATE category SET category = ? WHERE id = ?",
            [changeInfo.after, changeInfo.id]
        );
        res.json({result: "success", message: "変更内容", content: changeInfo});
        
        
    } catch (err) {
        console.error('DBエラー：', err);
        res.status(500).json({message: "サーバーエラーが発生しました", error: String(err)});
    }
})

app.listen(PORT, () => {
  console.log(`✅ サーバー起動中: http://localhost:${PORT}`);
});