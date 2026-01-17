export class EditorDatabaseManeger {
    constructor(
        private apiURL: string
    ) {}
    // データの取得
    // データの追加
    // データの更新
    async getRows() {
        type Data = {id: number, name: string, is_done: 0 | 1}
        type Result = {ok: true; data: Data[]} | {ok: false; error: string};
        try {
            const res = await fetch(this.apiURL, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data: Data[] = await res.json();
            const result: Result = {
                ok: true,
                data: data
            };
            return result;
        } catch (err) {
            const result: Result = {
                ok: false,
                error: "通信エラー"
            };
            return result;
        }
  
    }

    async postRows(jsonName: string) {
        try {
            const res = await fetch(this.apiURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({name: jsonName})
            });
            if (!res.ok) {
                throw new Error(`HTTPエラー: ${res.status}`)
            } else {
                const message = await res.json();
                return message;
            }
        } catch (err) {
            console.error('通信エラー', err);
        }
    }

    async deleteRows(id: number) {
        try {
            const res = await fetch(this.apiURL, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id: id})
            });
            if (!res.ok) {
                throw new Error(`HTTPエラー: ${res.status}`)
            }
            const resData = await res.json();
            return resData;
        } catch (err) {
            console.error('通信エラー', err);
        }
    }

    async putRows(id: number, current: string, next: string): Promise<{message: "Done", exitId: null} | {message: "exited",exitId: number} | {message: "error", exitId: null}> {
        try {
            const res = await fetch(this.apiURL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id: id, current: current, next: next})
            });
            const data = await res.json()
            return data;
        } catch (err: any) {
            console.error(`通信エラー`, err);
            return {message: "error", exitId: null};
            ;
        }
    }
}

export class TaskDatabaseManeger {
    constructor(
        private apiURL: string
    ) {}
    async putCategory(currentId: number, nextId: number) {
        try {
            const res = await fetch(`${this.apiURL}/category`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({currentId: currentId, nextId: nextId})
            });
            const data = await res.json();
            return data;
        } catch (error) {
            
        }
    }

    async is_done(id: number): Promise<boolean> {
        try {
        const res = await fetch(`${this.apiURL}/isDone`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id }),
        });

        if (!res.ok) return false;

        const result: { result: boolean } = await res.json();
        return result.result;
        } catch (err) {
        return false;
        }
    };


    async setPrevious(id: number) {
        try {
            const res = await fetch(`${this.apiURL}/previous`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id }),
            });
            const json = await res.json();
            console.log('set previous response:', json);
            return json;
        } catch (err) {
            return {result: "fail"};
        }
    }


    async putPrevious(id: number) {
        try {
            const res = await fetch(`${this.apiURL}/previous`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id }),
            });
            const json = await res.json();
            console.log('putPrevious response:', json);
            return json;
        } catch (err) {
            return {result: "fail"};
        }
    }

    async getTaskInfo() {
        try {
        const res = await fetch(`${this.apiURL}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data: { id: number, task: string, due: string, category: string, status: string }[] = await res.json();
        return {result: "success", data: data};
        } catch (err) {
        return {result: "fail"};
        }
    }

    async postTask(task: string) {
        try {
            const res = await fetch(`${this.apiURL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: task })
            });
            return res.json();
        } catch (err) {
            return {result: "fail"};
        }
    }

    async putTask(id: number, task: string, due: string, category: string, status: string) {
        try {
            await fetch(`${this.apiURL}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id, task: task, due: due, category: category, status: status })
            });
            return {result: "success"};
        } catch (err) {
            return {result: "fail"};
        }
    }

    async deleteTask(id: number) {
        try {
            await fetch(`${this.apiURL}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            return {result: "success"};
        } catch (err) {
            return {result: "fail"};
        }
    }
}

export class StatusDatabaseManeger {
    constructor(
        private apiURL: string
    ) {}

    async isDone(id: number) {
        try {
            const res = await fetch(this.apiURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id }),
            });
            const result: { result: boolean } = await res.json();
            return result.result;
        } catch (err) {
            return false;
        }
    }

    async putIsDone(id: number) {
        try {
            await fetch(this.apiURL, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id }),
            });
        } catch (err) {
            console.error("通信エラー", err);
        }
    }
}