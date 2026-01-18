const { contextBridge, ipcRenderer } = require('electron');

// レンダラープロセスに公開する安全な API
const api = {
  // サンプル: ping-pong 通信
  ping: () => ipcRenderer.invoke('ping'),
  
  // 将来的にタスク操作用の API を追加
  // task: {
  //   list: () => ipcRenderer.invoke('task:list'),
  //   add: (task: any) => ipcRenderer.invoke('task:add', task),
  //   update: (id: number, task: any) => ipcRenderer.invoke('task:update', id, task),
  //   delete: (id: number) => ipcRenderer.invoke('task:delete', id),
  // },
};

// window.api として公開
contextBridge.exposeInMainWorld('api', api);