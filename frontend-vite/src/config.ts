const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export const CategoryConfig = {
    title: "Category",
    apiURL: `${API_BASE}/category`,
    propaty: "category",
    propatyInTasks: "categoryId"//taskテーブルのプロパティ名
}

export const StatusConfig = {
    title: "Status",
    apiURL: `${API_BASE}/status`,
    propaty: "status",
    propatyInTasks: "statusId"//taskテーブルのプロパティ名

}

export const TaskConfig = {
    apiURL: `${API_BASE}/task`,
}