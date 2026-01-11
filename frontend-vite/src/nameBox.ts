export const modal = document.querySelector('.modal') as HTMLDivElement;
export const overlay = document.querySelector('.overlay') as HTMLDivElement;
export const NameChange = modal.querySelector(".NameChange") as HTMLDivElement;
import { APIURL_Status } from "./APIURL";




export class NameBox {
  private edit_name?: HTMLDivElement;

  constructor(
    private _title: string,
    private _id: number,
    private _name: string,
    private _parent: HTMLDivElement,
    private _isDone: 1 | 0
  ) {}

  //method
  create() {
    const nameBox = document.createElement("div");
    nameBox.className = "nameBox";
    
    const name = document.createElement("div");
    name.className = "name";
    name.textContent = this._name;
    nameBox.appendChild(name);

    this.edit_name = document.createElement("div");
    this.edit_name.className = "edit_name";
    this.edit_name.setAttribute("type", "button");
    
    const editImg = document.createElement("img");
    editImg.src = "../fig/edit.png";
    editImg.alt = "編集ボタン";

    this.edit_name.appendChild(editImg);
    nameBox.appendChild(this.edit_name);
    this._parent.appendChild(nameBox);
    console.log(this._name);
  }

  //編集画面に遷移イベント追加
  addModal() {
    const checkbox = document.getElementById("done") as HTMLInputElement;
    const isDoneStatus = document.querySelector(".isDoneStatus") as HTMLDivElement;

    

    this.edit_name!.addEventListener("click", async() => {
      overlay.classList.remove("hidden");
      modal.classList.remove("hidden");
      NameChange.textContent = this._name;
      NameChange.dataset.name = this._name;
      NameChange.dataset.id = String(this._id);
      isDoneStatus.id = String(this._id);
      let isDone = false;
      try {
        const res = await fetch(APIURL_Status.getIsDone, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: Number(isDoneStatus.id) }),
        });
        const message = await res.json();
        isDone = message.result;
        if (!isDone) {
          this._isDone = 0;
        } else {
          this._isDone = 1;
        }
      } catch (err) {
        console.error(err);
      }

      checkbox.checked = this._isDone === 1;
      checkbox.disabled = this._isDone === 1;
      checkbox.dataset.id = String(this._id);
    });

    checkbox.addEventListener("change", async () => {
      const id = await Number(isDoneStatus.id);
      console.log(id);
      if (!checkbox.checked || !id) return;
      
      try {
        await fetch(APIURL_Status.putIsDone, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        
      } catch (err) {
        console.error(err);
        checkbox.checked = false;
        checkbox.disabled = false;
      }
    });
  }

  
}
