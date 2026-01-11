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
}