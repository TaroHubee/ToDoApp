import { CategoryRepository } from "../repositories/categoryRepository.js";

export class CategoryService {
    private repo: CategoryRepository;

    constructor(){
        this.repo = new CategoryRepository();
    }

    getAllCategories() {
        return this.repo.findAll();
    }
    
    async addCategory(name: string) {
        const exitId = await this.repo.isAlreadyRegisterd(name);
        if(exitId === null) {
            return this.repo.add(name);
        } else {
            return {result: "existed", id: null, message: "すでに登録されているカテゴリーです。"};
        }
    }

    async changeCategory(id: number, next: string) {
        const exitId = await this.repo.isAlreadyRegisterd(next);
        if(exitId === null) {
            return this.repo.change(id, next);
        } else {
            return {message: "exited", exitId: exitId} as const;
        }
    }

    async deleteCategory(id: number) {
        return this.repo.delete(id);
    }
}