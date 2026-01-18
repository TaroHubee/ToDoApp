import { APIURL_Task } from "./APIURL";
import { TaskDatabaseManeger } from "./databaseManeger";
import { Modal } from "./overlay";
export class TaskBox {
  
  
  constructor(
    private _id: number,
    private _task: string,
    private _deadline: string,
    private _category: string,
    private _status: string,
    private _parent: HTMLDivElement,
  ) {}

  //method
  async createTaskBox() {
    const taskBox = document.createElement("div");
    taskBox.className = "taskBox";
    taskBox.draggable = true;

    const circle = document.createElement("div");
    circle.className = "circle";
    circle.id = "unchecked";

    const img = document.createElement("img");

    // サーバーの状態を取得してから表示を決定する
    const taskDBManager = new TaskDatabaseManeger(APIURL_Task.post);
    try {
      const isDone = await taskDBManager.is_done(this._id);
      if (isDone) {
        circle.id = "checked";
        img.src = "/fig/checkedCircle.png";
      } else {
        circle.id = "unchecked";
        img.src = "/fig/unCheckedCircle.png";
      };
    } catch (err) {
      console.error('is_done check failed:', err);
      circle.id = "unchecked";
      img.src = "/fig/unCheckedCircle.png";
    }

    img.alt = "チェックボックス";
    circle.append(img);

    // imgクリックでサーバーに変更を送信（イベント伝播を止める）
    img.addEventListener('click', async (e) => {
      e.stopPropagation();
      const currentlyChecked = circle.id === "checked";

      // 重複クリック防止
      img.style.pointerEvents = 'none';
      try {
        if (currentlyChecked) {
          console.log('[task] uncheck request', this._id);
          const res = await taskDBManager.setPrevious(this._id);
          console.log('[task] setPrevious response', res);
          
          // if (res && res.result === "success") {
          //   circle.id = "unchecked";
          //   img.src = "../fig/unCheckedCircle.png";
          // } else {
          //   console.error('setPrevious failed', res);
          // }
          location.reload();
        } else {
          console.log('[task] check request', this._id);
          const res = await taskDBManager.putPrevious(this._id);
          console.log('[task] putPrevious response', res);
          // if (res && res.result === "success") {
          //   circle.id = "checked";
          //   img.src = "../fig/checkedCircle.png";
          // } else {
          //   console.error('putPrevious failed', res);
          // }
          location.reload();
        }
      } catch (err) {
        console.error(err);
      } finally {
        img.style.pointerEvents = '';
      }
    });

    const taskName = document.createElement("p");
    taskName.className = "taskName";
    taskName.textContent = this._task;
    taskName.addEventListener('click',() => {
      console.log(taskName.textContent);
      //モーダル表示
      const modal = new Modal("change", this._id, this._task, this._deadline, this._category, this._status);
      modal.display();
    })

    const deadline = document.createElement("p");
    deadline.className = "deadline";
    deadline.textContent = this._deadline;

    const taskCategory = document.createElement("p");
    taskCategory.className = "taskCategory";
    taskCategory.textContent = this._category;

    const statusarea = document.createElement("div");
    statusarea.className = "statusarea";

    if (this._status !== null) {
      const status = document.createElement("p");
      status.className = "status";
      status.textContent = String(this._status);
      statusarea.appendChild(status);
    }

    taskBox.appendChild(circle);
    taskBox.appendChild(taskName);
    taskBox.appendChild(deadline);
    taskBox.appendChild(taskCategory);
    taskBox.appendChild(statusarea);

    this._parent.appendChild(taskBox);

    circle.addEventListener('mouseenter', () => {
      circle.style.cursor = "pointer";
    })
    // circleのローカルトグルは削除（サーバー反映を優先するため）
  }
}