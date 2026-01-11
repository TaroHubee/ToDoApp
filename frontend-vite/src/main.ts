import { Modal } from "./overlay.js";
import { APIURL_Task } from "./APIURL.js";
const container = document.querySelector(".container") as HTMLDivElement;
const tasks = document.querySelectorAll(".taskBox");
const taskBoxs = container.querySelector(".taskBoxs") as HTMLDivElement;

const addTaskForms = document.querySelector('.addTaskForms') as HTMLDivElement;
const addTaskInitial = addTaskForms.querySelector(".addTaskInitial")!;
const addTaskForm = addTaskForms.querySelector(".addTaskForm")!;

class TaskBox {
  
  
  constructor(
    private _id: number,
    private _task: string,
    private _deadline: string,
    private _category: string,
    private _status: string,
    private _parent: HTMLDivElement,
  ) {}

  //method
  createTaskBox() {
    const taskBox = document.createElement("div");
    taskBox.className = "taskBox";
    taskBox.draggable = true;

    const circle = document.createElement("div");
    circle.className = "circle";
    circle.id = "unchecked";

    const img = document.createElement("img");
    const is_done = async (id: number): Promise<boolean> => {
      try {
        const res = await fetch(APIURL_Task.isDone, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) return false;

        const result: { result: boolean } = await res.json();
        return result.result;
      } catch (err) {
        return false;
      }
    };

    // サーバーの状態を取得してから表示を決定する
    is_done(this._id).then(isDone => {
      circle.id = isDone ? "checked" : "unchecked";
      img.src = isDone ? "../fig/checkedCircle.png" : "../fig/unCheckedCircle.png";
    });

    img.alt = "チェックボックス";
    circle.append(img);

    // imgクリックでサーバーに変更を送信（イベント伝播を止める）
    img.addEventListener('click', async (e) => {
      e.stopPropagation();
      const currentlyChecked = circle.id === "checked";
      try {
        if (currentlyChecked) {
          // checked をクリック → previousStatusId にしてリロード
          const res = await fetch(APIURL_Task.getPrevious, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: this._id }),
          });
          const json = await res.json();
          console.log('set previous response:', json);
          if (json.result === "success") {
            location.reload();
          } else {
            console.error(json);
          }
          return;
        } else {
          // unchecked をクリック → チェックにする（成功時にリロード）
          const res = await fetch(APIURL_Task.putPrevious, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: this._id }),
          });
          const json = await res.json();
          console.log('putPrevious response:', json);
          if (json.result === "success") {
            location.reload();
          } else {
            console.error(json);
          }
        }
      } catch (err) {
        console.error(err);
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


/*データベースに登録されてるタスクを取得*/
document.addEventListener("DOMContentLoaded",() => {
  const taskDateInServer = async () => {
    try {
      const res = await fetch('http://localhost:3000/task', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data: { id: number, task: string, due: string, category: string, status: string }[] = await res.json();
      console.log('サーバーからの応答1', data);
      for (const element of data) {
        const taskBox = new TaskBox(element.id, element.task, element.due, element.category, element.status, taskBoxs);
        taskBox.createTaskBox();
      }
    } catch (err) {
      console.error('通信エラー', err);
    }
  }
  taskDateInServer();
})



tasks.forEach((task) => {
  task.addEventListener("dragstart", () => {
    task.classList.add("dragging");
  });

  task.addEventListener("dragend", () => {
    task.classList.remove("dragging");
  });
});

container.addEventListener("dragover", (e) => {
  e.preventDefault();

  const dragging = document.querySelector(".dragging") as HTMLElement | null;
  if (!dragging) return;

  const afterElement = getDragAfterElement(container, e.clientY);
  if (afterElement == null) {
    container.appendChild(dragging);
  } else {
    container.insertBefore(dragging, afterElement);
  }
});


// フォーカス（クリック）時に文字を消す
addTaskForm.addEventListener('focus', () => {
  addTaskInitial.textContent = '';
});


// フォーカスが外れた時（blur）に空なら初期文字に戻す
addTaskForm.addEventListener('blur', () => {
  if (!(addTaskForm.textContent)) {
    addTaskInitial.textContent = 'Add Task';
  }
});

//タスクを追加
const button = document.querySelector('.addTaskButton') as HTMLButtonElement;
const task = document.querySelector('.addTaskForm') as HTMLDivElement;
if (button) {
  button.addEventListener('click', async() => {
    const text: string = task.textContent!;
    if (text) {
        try {
            const res = await fetch(APIURL_Task.post, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({task: text})
            });
            const message = await res.json();
            if (message.result === "fail") {
                const err = new Error("Error: タスクを追加できませんでした。");
                throw err;
            }
            location.reload();
        } catch (err) {
            console.error(`message: ${err}`);
        }
    } else {
      const modal = new Modal("add", null, "", "", "", "");
      modal.display();
    }
    
  })
}




function getDragAfterElement(container: HTMLElement, y: number): HTMLElement | null {
    const nodeList = container.querySelectorAll<HTMLElement>(".taskBox:not(.dragging)");
    const draggableElements: HTMLElement[] = [].slice.call(nodeList);

    let closest = { offset: Number.NEGATIVE_INFINITY, element: null as HTMLElement | null };

    draggableElements.forEach((child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
        closest = { offset, element: child };
        }
    });

    return closest.element;
}

