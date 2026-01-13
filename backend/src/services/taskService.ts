import { TaskRepository } from "../repositories/taskRepository.js";

type Tasks = {
    id: number;
    task: string;
    due: string | null;
    category: string | null;
    status: string | null;
}

type DeleteTask = {
    id: number;
    deleteTask: string
}

export class TaskService {
    private repo: TaskRepository;

    constructor() {
        this.repo = new TaskRepository();
    }

    async getAllTasks(): Promise<Tasks[]> {
        return this.repo.findAll();
    }

    async deleteTask(id: number) {
        return this.repo.deleteTask(id);
    }

    async changeTask(id: number, task: string, categoryId: number | null, due: string, statusId: number | null) {
        return this.repo.changeTask(id, task, categoryId, due, statusId);
    }

    async changeCategory(currentId: number, nextId: number) {
        return this.repo.changeCategory(currentId, nextId);
    }

    async addTask(task: string) {
        return this.repo.addTask(task);
    }

    async putPrevious(id: number) {
        return this.repo.putPrevious(id);
    }

    async chengeStatus(id: number, statusId: number) {
        return this.repo.changeStatus(id, statusId);
    }

    async isDone(id: number) {
        return this.repo.isDone(id);
    }

    async getPreviousStatus(id: number) {
        return this.repo.getPreviousStatusId(id);
    }
}