import { StatusRepository } from "../repositories/statusRepository.js";

export class StatusService {
    private repo: StatusRepository;

    constructor(){
        this.repo = new StatusRepository();
    }

    getAllStatuses() {
        return this.repo.findAll();
    }
    
    async addStatus(name: string) {
        const exitId = await this.repo.isAlreadyRegisterd(name);
        if(exitId === null) {
            return this.repo.add(name);
        } else {
            return {result: "existed", id: null, message: "すでに登録されているステータスです。"};
        }
    }

    async changeStatus(id: number, next: string) {
        const exitId = await this.repo.isAlreadyRegisterd(next);
        if(exitId === null) {
            return this.repo.change(id, next);
        } else {
            return {message: "exited", exitId: exitId} as const;
        }
    }

    async deleteStatus(id: number) {
        return this.repo.delete(id);
    }
}