import { app, BrowserWindow, ipcMain, protocol, net } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';
import express from 'express';
import cors from 'cors';

// ES モジュールで __dirname を使えるようにする
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
let server: any = null;

// カスタムプロトコルを特権として登録（app.whenReady() の前に実行）
if (!isDev) {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'app',
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: true,
      },
    },
  ]);
}

// IPC ハンドラ（サンプル: ping-pong）
ipcMain.handle('ping', async () => {
  return 'pong';
});

// バックエンドサーバーを起動
async function startBackendServer() {
  const expressApp = express();
  
  expressApp.use(cors({
    origin: [
      "http://localhost:5173",  // Vite dev server (Electron開発)
      "http://localhost:4173",  // Vite preview
      "app://.",                 // Electron 本番環境
    ],
    credentials: true
  }));

  expressApp.use(express.json());

  // ビルドされたルートファイルをインポート（dist-backend から）
  const backendPath = isDev
    ? path.join(process.cwd(), 'dist-backend')
    : path.join(__dirname, '..', 'dist-backend');

  const taskRoutesPath = pathToFileURL(path.join(backendPath, 'routes', 'taskRoutes.js')).href;
  const categoryRoutesPath = pathToFileURL(path.join(backendPath, 'routes', 'categoryRoutes.js')).href;
  const statusRoutesPath = pathToFileURL(path.join(backendPath, 'routes', 'statusRoutes.js')).href;

  const taskRoutes = await import(taskRoutesPath);
  const categoryRoutes = await import(categoryRoutesPath);
  const statusRoutes = await import(statusRoutesPath);

  expressApp.use("/task", taskRoutes.default);
  expressApp.use("/category", categoryRoutes.default);
  expressApp.use("/status", statusRoutes.default);

  const PORT = 3000;

  return new Promise((resolve) => {
    server = expressApp.listen(PORT, 'localhost', () => {
      console.log(`✅ バックエンドサーバー起動中: http://localhost:${PORT}`);
      resolve(PORT);
    });
  });
}

function createMainWindow() {
  // 開発時と本番時で preload のパスを分ける
  const preloadPath = isDev
    ? path.join(process.cwd(), 'dist-electron', 'preload.js')
    : path.join(__dirname, 'preload.js');

  // アイコンのパスを設定（Windows では .ico を使用）
  const iconPath = isDev
    ? path.join(process.cwd(), 'build', 'icon.ico')
    : path.join(__dirname, '..', 'build', 'icon.ico');

  console.log('Preload path:', preloadPath);
  console.log('Icon path:', iconPath);
  console.log('__dirname:', __dirname);
  console.log('process.cwd():', process.cwd());

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: iconPath,  // アイコンを設定
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 開発時は Vite サーバーから、本番時はビルド済みファイルから読み込み
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL('app://./index.html');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// アプリケーション起動時
app.whenReady().then(async () => {
  // カスタムプロトコルを登録（本番環境のみ）
  if (!isDev) {
    protocol.handle('app', (request) => {
      const url = request.url.replace('app://', '');
      const filePath = path.join(__dirname, '../dist', url);
      return net.fetch(`file://${filePath}`);
    });
  }

  // バックエンドサーバーを起動
  await startBackendServer();

  createMainWindow();

  app.on('activate', () => {
    // macOS でドックアイコンクリック時
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// 全ウィンドウが閉じられた時
app.on('window-all-closed', () => {
  // バックエンドサーバーを停止
  if (server) {
    server.close(() => {
      console.log('✅ バックエンドサーバー停止');
    });
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});