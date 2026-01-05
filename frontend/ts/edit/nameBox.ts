export const modal = document.querySelector('.modal') as HTMLDivElement;
export const overlay = document.querySelector('.overlay') as HTMLDivElement;
export const NameChange = modal.querySelector(".NameChange") as HTMLDivElement;



export class NameBox {
  private edit_name?: HTMLDivElement;

  constructor(
    private title: string,
    private _id: number,
    private _name: string,
    private _parent: HTMLDivElement,
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
    this.edit_name!.addEventListener("click", () => {
      console.log("click");
      overlay.classList.remove("hidden");
      modal.classList.remove("hidden");
      NameChange.textContent = this._name;
      NameChange.dataset.id = String(this._id);
      NameChange.dataset.nowCategory = this._name;
    });
  }

  
}
