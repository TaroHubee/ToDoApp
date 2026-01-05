const duplicateModal = document.querySelector(".duplicateModal") as HTMLDivElement;
const duplicateButton = duplicateModal.querySelector(".duplicateButton") as HTMLButtonElement;

const taskApiURL = "http://localhost:3000/task"

const taskPropatyUpdate = async (propaty: string, propaty_current: number | string, propaty_next: number | string): Promise<void> =>{
    try {
        const res = await fetch(taskApiURL, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({propaty: propaty, propaty_current: propaty_current, propaty_next: propaty_next})
        });
        const resData = await res.json();
        console.log(resData.message);
    } catch (err) {
        console.error('更新エラー');
    }
}

export class DatabaseManeger {
    constructor(
        private apiURL: string
    ) {}
    // データの取得
    // データの追加
    // データの更新
    async getRows() {
        type Data = {id: number, name: string}
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
            console.log(res.json);
            if (!res.ok) {
                throw new Error(`HTTPエラー: ${res.status}`)
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
            console.log(resData.message);
        } catch (err) {
            console.error('通信エラー', err);
        }
    }

    // async putRows(id: number, current: string, next: string) {
    //     try {
    //         const res = await fetch(this.apiURL, {
    //             method: 'PUT',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({id: id, current: current, next: next})
    //         });
    //         if (res.status === 400) {
    //             const errorData = await res.json()
    //             console.error(`<重複エラー>message: ${errorData.message},  対象データID:${errorData.id_current}, 重複先ID:${errorData.id_next}`);
    //             duplicateModal.classList.remove("hidden");
    //             duplicateButton.addEventListener('click', async() => {
    //                 if (duplicateButton.dataset.id === "yes") {
    //                     //タスクテーブルのカテゴリーIDを変更前から変更後のものに更新
    //                     await taskPropatyUpdate(this.propatyofTaskTable, errorData.id_current, errorData.id_next);
    //                     await this.deleteRows(errorData.id_current);
    //                 }
    //             })
    //         } else if (!res.ok) {
    //             throw new Error();
    //         }
    //     } catch (err: any) {
    //         console.error(`通信エラー`, err);
    //     }
    // }
}

