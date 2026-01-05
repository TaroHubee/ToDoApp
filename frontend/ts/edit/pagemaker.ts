import { DatabaseManeger } from "./databaseManeger.js";
import { NameBox } from "./nameBox.js";
const addNameInitial = document.querySelector(".addNameInitial") as HTMLDivElement;
const addNameForm = document.querySelector(".addNameForm") as HTMLDivElement;
const addNameButton = document.querySelector(".addNameButton") as HTMLButtonElement;

//タイトルの表示
//データベースの内容を取得・表示
//データベースに追加情報を登録
//データベースに既存情報の更新
export class PageMaker {
    constructor(
        private title: string,
        private apiURL: string,
        private parentBox: HTMLDivElement,
        private propatyInTasks: string
    ) {}

    /**メソッド */

    //タイトルを作成
    createTitle() { 
        document.querySelector(".pageTitle")!.textContent = this.title;
    }

    createAddForm() {
        const databaseManeger = new DatabaseManeger(this.apiURL)
        addNameInitial.textContent = `add ${this.title}`;
        // フォーカス（クリック）時に文字を消す
        addNameForm.addEventListener('focus', () => {
        addNameInitial.textContent = '';
        });

        // フォーカスが外れた時（blur）に空なら初期文字に戻す
        addNameForm.addEventListener('blur', () => {
        if (!(addNameForm.textContent)) {
            addNameInitial.textContent = `add ${this.title}`;
        }
        });
        addNameButton.addEventListener("mouseenter", () => {
            if (!addNameForm.textContent) {
                addNameButton.disabled = true;
                addNameButton.style.cursor = "not-allowed";
            }
        })

        addNameButton.addEventListener("mouseleave", () => {
            if (!addNameForm.textContent) {
                addNameButton.disabled = false;
                addNameButton.style.cursor = "pointer";
            }
        })
        addNameButton.addEventListener("click", () => {
            databaseManeger.postRows(addNameForm.textContent!);
        })
    }
    
    //Name一覧を表示
    async displayName() {
        // データベースからNameテーブルを取得
        const databaseManeger = new DatabaseManeger(this.apiURL)
        const Names = await databaseManeger.getRows();
        console.log(Names);
        if (Names.ok === true) {
            Names.data.forEach(element => {
                const nameBox = new NameBox(this.title, element.id, element.name, this.parentBox);
                nameBox.create();
                nameBox.addModal();
                console.log(element.id);
            });
        } else {
            console.log(Names.error);
        }
        

        // HTMLを作成
        // 取得したデータベースからプロパティに分けHTMLに配置
    }

}