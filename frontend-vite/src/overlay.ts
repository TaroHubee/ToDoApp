import { APIURL_Task, APIURL_Category, APIURL_Status } from "./APIURL";
import { EditorDatabaseManeger } from "./databaseManeger";

export const overlay = document.querySelector('.overlay') as HTMLDivElement;
export const modal = document.querySelector('.modal') as HTMLDivElement;
//export const calender = 

export const ModalElement = {
    exit: modal.querySelector(".modalExit") as HTMLDivElement,
    task: modal.querySelector(".taskinModal") as HTMLDivElement,
    dueArea: modal.querySelector(".dueArea") as HTMLDivElement,
    due: modal.querySelector(".due") as HTMLDivElement,
    calenderHidden: modal.querySelector(".hidden-date-input") as HTMLInputElement,
    calenderIcon: modal.querySelector(".icon") as HTMLButtonElement,
    category: modal.querySelector(".categoryinModal") as HTMLDivElement,
    status: modal.querySelector(".statusinModal") as HTMLDivElement,
    Change: modal.querySelector(".modalChange") as HTMLDivElement,
    Add: modal.querySelector(".modalAdd") as HTMLDivElement,
    delete: modal.querySelector(".modalDelete") as HTMLButtonElement
}

export class Modal {
    constructor(
        private _mode: "add" | "change", 
        private _id: number | null,
        private _task: string,
        private _deadline: string,
        private _category: string,
        private _status: string
    ){}
    display = () => {
        overlay.classList.remove("hidden");
        modal.classList.remove("hidden");
        document.querySelectorAll(".Alternate").forEach(el => {
            el.classList.add("hidden");
        });
        ModalElement.calenderIcon.addEventListener('click', () => {
            ModalElement.calenderHidden.showPicker();
        })
        ModalElement.calenderHidden.addEventListener('input', () => {
            ModalElement.due.textContent = ModalElement.calenderHidden.value;
        })

        //カテゴリー枠の制御------------------------------------------
        //クリックしたらカテゴリー一覧ボタンを作成しボタンを押したらそのカテゴリーを入力
        ModalElement.category.addEventListener("click", async() => {
            if (!ModalElement.category.textContent?.trim()) {
                //カテゴリDBから一覧を取得
                const categoryDBManager = new EditorDatabaseManeger(APIURL_Category.get);
                const categoriesobj = await categoryDBManager.getRows();
                if(categoriesobj.ok === true) {
                    const Alternate = document.getElementById("category") as HTMLDivElement;
                    const AlternateRightSpace = Alternate.querySelector('.AlternateRightSpace') as HTMLDivElement;
                    const categories = categoriesobj.data
                    Alternate.classList.remove("hidden");
                    Alternate.querySelectorAll(".AlternateBox").forEach(el => el.remove());
                    categories.forEach(category => {
                        // AlternateBoxを作成
                        const AlternateBox = document.createElement("button");
                        console.log(category.name);
                        AlternateBox.className = "AlternateBox";
                        // textContentに代入
                        AlternateBox.textContent = category.name;
                        // Alternateの中に入れる
                        AlternateRightSpace.appendChild(AlternateBox);

                        AlternateBox.addEventListener("click", () => {
                            ModalElement.category.textContent = category.name;
                            Alternate.classList.add("hidden");
                        })
                    });
                }
                
            }
        });
        //文字が全部削除されたら一覧を再び表示。文字が一文字でも入力されたら一覧表示を削除
        ModalElement.category.addEventListener("input", async() => {
            if (!ModalElement.category.textContent?.trim()) {
                //カテゴリDBから一覧を取得
                const categoryDBManager = new EditorDatabaseManeger(APIURL_Category.get);
                const categoriesobj = await categoryDBManager.getRows();
                if(categoriesobj.ok === true) {
                    const categories = categoriesobj.data
                    const Alternate = document.getElementById("category") as HTMLDivElement;
                    const AlternateRightSpace = Alternate.querySelector('.AlternateRightSpace') as HTMLDivElement;
                    Alternate.classList.remove("hidden");
                    Alternate.querySelectorAll(".AlternateBox").forEach(el => el.remove());
                    categories.forEach(category => {
                        // AlternateBoxを作成
                        const AlternateBox = document.createElement("button");
                        console.log(category.name);
                        AlternateBox.className = "AlternateBox";
                        // textContentに代入
                        AlternateBox.textContent = category.name;
                        // Alternateの中に入れる
                        AlternateRightSpace.appendChild(AlternateBox);

                        AlternateBox.addEventListener("click", () => {
                            ModalElement.category.textContent = category.name;
                            Alternate.classList.add("hidden");
                        })
                    });
                }
                
            } else {
                const Alternate = document.getElementById("category") as HTMLDivElement;
                Alternate.classList.add("hidden");
            }
        })
        //カテゴリー欄からカーソルが外れたら一覧表示を削除
        // ModalElement.category.addEventListener("blur", () => {
        //     const Alternate = document.getElementById("category") as HTMLDivElement;
        //     Alternate.classList.add("hidden");
        // })

        //ステータス枠の制御------------------------------------------
        //クリックしたらステータス一覧ボタンを作成しボタンを押したらそのステータスを入力
        ModalElement.status.addEventListener("click", async() => {
            if (!ModalElement.status.textContent?.trim()) {
                //カテゴリDBから一覧を取得
                const statusDBManager = new EditorDatabaseManeger(APIURL_Status.get);
                const statusesobj = await statusDBManager.getRows();
                if(statusesobj.ok === true) {
                    const Alternate = document.getElementById("status") as HTMLDivElement;
                    const AlternateRightSpace = Alternate.querySelector('.AlternateRightSpace') as HTMLDivElement;
                    const statuses = statusesobj.data
                    Alternate.classList.remove("hidden");
                    Alternate.querySelectorAll(".AlternateBox").forEach(el => el.remove());
                    statuses.forEach(status => {
                        // AlternateBoxを作成
                        const AlternateBox = document.createElement("button");
                        console.log(status.name);
                        AlternateBox.className = "AlternateBox";
                        // textContentに代入
                        AlternateBox.textContent = status.name;
                        // Alternateの中に入れる
                        AlternateRightSpace.appendChild(AlternateBox);

                        AlternateBox.addEventListener("click", () => {
                            ModalElement.status.textContent = status.name;
                            Alternate.classList.add("hidden");
                        })
                    });
                }
                
            }
        });
        //文字が全部削除されたら一覧を再び表示。文字が一文字でも入力されたら一覧表示を削除
        ModalElement.status.addEventListener("input", async() => {
            if (!ModalElement.status.textContent?.trim()) {
                //カテゴリDBから一覧を取得
                const statusDBManager = new EditorDatabaseManeger(APIURL_Status.get);
                const statusesobj = await statusDBManager.getRows();
                if(statusesobj.ok === true) {
                    const Alternate = document.getElementById("status") as HTMLDivElement;
                    const AlternateRightSpace = Alternate.querySelector('.AlternateRightSpace') as HTMLDivElement;
                    const statuses = statusesobj.data
                    Alternate.classList.remove("hidden");
                    Alternate.querySelectorAll(".AlternateBox").forEach(el => el.remove());
                    statuses.forEach(status => {
                        // AlternateBoxを作成
                        const AlternateBox = document.createElement("button");
                        console.log(status.name);
                        AlternateBox.className = "AlternateBox";
                        // textContentに代入
                        AlternateBox.textContent = status.name;
                        // Alternateの中に入れる
                        AlternateRightSpace.appendChild(AlternateBox);

                        AlternateBox.addEventListener("click", () => {
                            ModalElement.status.textContent = status.name;
                            Alternate.classList.add("hidden");
                        })
                    });
                }
                
            } else {
                const Alternate = document.getElementById("status") as HTMLDivElement;
                Alternate.classList.add("hidden");
            }
        })


        switch (this._mode) {
            case "change":
                ModalElement.task.textContent = this._task;
                ModalElement.due.textContent = this._deadline;
                ModalElement.category.textContent = this._category;
                ModalElement.status.textContent = this._status;
                ModalElement.Change.classList.remove("hidden");
                ModalElement.Change.addEventListener('mouseenter', () => {
                    const before = {task: this._task, due: this._deadline ?? "", category: this._category ?? "", status: this._status ?? ""};
                    const now = {task: ModalElement.task.textContent, due: ModalElement.due.textContent, category: ModalElement.category.textContent, status: ModalElement.status.textContent}
                    const isSame = 
                        before.task === now.task &&
                        before.due === now.due &&
                        before.category === now.category &&
                        before.status === now.status;
                    if (isSame || !ModalElement.task.textContent) {
                        ModalElement.Change.classList.remove("button");
                        ModalElement.Change.style.cursor = "not-allowed";
                    }
                });
                ModalElement.Change.addEventListener('mouseleave', () => {
                    ModalElement.Change.classList.add("button");
                    ModalElement.Change.style.cursor = "pointer";
                });
                ModalElement.Change.addEventListener('click', () => {
                    const changeTask = async() => {
                        try {
                            const res = await fetch(APIURL_Task.change, {
                                method: 'PUT',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({id: this._id, task: ModalElement.task.textContent, due: ModalElement.due.textContent, category: ModalElement.category.textContent, status: ModalElement.status.textContent})
                            });
                            const message = await res.json();
                            console.log(message);
                            if (message.result === "success") {
                                location.reload()
                            }
                        } catch (err) {
                            console.error("message: サーバーに接続できませんでした");
                        }
                    }
                    changeTask();
                })
                break;
            case "add":
                ModalElement.Add.classList.remove("hidden");
                ModalElement.delete.classList.add("hidden");
                ModalElement.Change.classList.add("hidden");
                ModalElement.task.textContent = "";
                ModalElement.due.textContent = "";
                ModalElement.category.textContent = "";
                ModalElement.status.textContent = "";
                ModalElement.Add.addEventListener('mouseenter', () => {
                    if (!ModalElement.task.textContent) {
                        ModalElement.Add.classList.remove("button");
                        ModalElement.Add.style.cursor = "not-allowed";
                    }
                })
                ModalElement.Add.addEventListener('click', async() => {
                    const task = ModalElement.task.textContent;
                    const due = ModalElement.due.textContent;
                    const category = ModalElement.category.textContent;
                    const status = ModalElement.status.textContent;
                    let id: number;
                    try {
                        const res = await fetch(APIURL_Task.post, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({task: task})
                        });
                        const message = await res.json();
                        if (message.result === "fail") {
                            const err = new Error("Error: タスクを追加できませんでした。");
                            throw err;
                        }
                        id = message.id;
                    } catch (err) {
                        console.error(`message: ${err}`);
                    }
                    const changeTask = async() => {
                        try {
                            const res = await fetch(APIURL_Task.change, {
                                method: 'PUT',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({id: id, task: task, due: due, category: category, status:status})
                            });
                            const message = await res.json();
                            console.log(message);
                            if (message.result === "success") {
                                location.reload()
                            }
                        } catch (err) {
                            console.error("message: サーバーに接続できませんでした");
                        }
                    }
                    changeTask();

                });
                break;
            default:
                break;
        }
        
        ModalElement.exit.addEventListener('click', () => {
            if (this._mode === "add") {
                ModalElement.delete.classList.remove("hidden");
                ModalElement.Add.classList.add("hidden");
            }
            overlay.classList.add("hidden");
            modal.classList.add("hidden");
            
        });

        
    }
}