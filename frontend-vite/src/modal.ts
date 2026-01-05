import { overlay, modal } from "./overlay";
//モーダル表示

taskinModal.textContent = this._task
due.textContent = this._deadline
categoryinModal.textContent = this._category
statusinModal.textContent = this._status
modalExit.addEventListener('click', () => {
overlay.classList.add("hidden");
modal.classList.add("hidden");
});
modalAddorChange.textContent = "change";
modalAddorChange.addEventListener('mouseenter', () => {
const before =  {task: this._task, due: this._deadline ?? "", category: this._category ?? "", status: this._status ?? ""};
if (this._task !== taskinModal.textContent || before.due !== due.textContent || before.category !== categoryinModal.textContent || before.status !== statusinModal.textContent) {
    modalAddorChange.classList.add("hover-enabled");
    console.log(`before: ${this._task}, after: ${taskinModal.textContent}`);
    console.log(`before: ${this._deadline}, after: ${dueinModal.textContent}`);
    console.log(`before: ${this._category}, after: ${categoryinModal.textContent}`);
    console.log(`before: ${this._status}, after: ${statusinModal.textContent}`);
    console.log("変更可");
} else {
    modalAddorChange.classList.remove("button");
    modalAddorChange.style.cursor = "not-allowed";
}
})
modalAddorChange.addEventListener('mouseleave', () => {
modalAddorChange.classList.add("button");
modalAddorChange.style.cursor = "pointer"
})
modalDelete.addEventListener('click', () => {
console.log(`id: ${this._id} delete`);
const deleteTask = async() => {
    try {
    const res = await fetch("http://localhost:3000/task", {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: this._id, deleteTask: this._task})
    })
    const response: {id: number} | {message: string} = await res.json();
    console.log("削除id; ",response);
    } catch (error) {
    console.error("message: サーバーにリクエストできませんでした。");
    }
}
deleteTask();
})