import { overlay, modal } from "./overlay.js";
const container = document.querySelector(".container") as HTMLDivElement;
const tasks = document.querySelectorAll(".taskBox");
const taskBoxs = container.querySelector(".taskBoxs") as HTMLDivElement;

const addTaskForms = document.querySelector('.addTaskForms') as HTMLDivElement;
const addTaskInitial = addTaskForms.querySelector(".addTaskInitial")!;
const addTaskForm = addTaskForms.querySelector(".addTaskForm")!;
const modalExit = modal.querySelector(".modalExit") as HTMLDivElement;
const taskinModal = modal.querySelector(".taskinModal") as HTMLDivElement;
const dueinModal = modal.querySelector(".dueinModal") as HTMLDivElement;
const due = dueinModal.querySelector(".due") as HTMLDivElement;
const categoryinModal = modal.querySelector(".categoryinModal") as HTMLDivElement;
const statusinModal = modal.querySelector(".statusinModal") as HTMLDivElement;
const modalChange = modal.querySelector(".modalChange") as HTMLDivElement;
const modalDelete = modal.querySelector(".modalDelete") as HTMLButtonElement;

// <div class="taskBox" draggable="true">
//   <div class="circle">
//       <img src="fig/unCheckedCircle.png" alt="チャック欄">
//   </div>
//   <p class="taskName">Walk the dog</p>
//   <p class="deadline">25/10/31</p>
//   <p class="taskCategory">Home</p>
//   <div class="statusarea">
//       <p class="status">
//           expired
//       </p>
//   </div>
// </div>

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

    const img = document.createElement("img");
    img.src = "../fig/unCheckedCircle.png";
    img.alt = "チェックボックス";
    circle.append(img);

    const taskName = document.createElement("p");
    taskName.className = "taskName";
    taskName.textContent = this._task;
    taskName.addEventListener('click',() => {
      console.log(taskName.textContent);
      overlay.classList.remove("hidden");
      modal.classList.remove("hidden");
      taskinModal.textContent = this._task
      due.textContent = this._deadline
      categoryinModal.textContent = this._category
      statusinModal.textContent = this._status
      modalExit.addEventListener('click', () => {
        overlay.classList.add("hidden");
        modal.classList.add("hidden");
      });
      modalChange.addEventListener('mouseenter', () => {
        const before =  {task: this._task, due: this._deadline ?? "", category: this._category ?? "", status: this._status ?? ""};
        if (this._task !== taskinModal.textContent || before.due !== due.textContent || before.category !== categoryinModal.textContent || before.status !== statusinModal.textContent) {
          modalChange.classList.add("hover-enabled");
          console.log(`before: ${this._task}, after: ${taskinModal.textContent}`);
          console.log(`before: ${this._deadline}, after: ${dueinModal.textContent}`);
          console.log(`before: ${this._category}, after: ${categoryinModal.textContent}`);
          console.log(`before: ${this._status}, after: ${statusinModal.textContent}`);
          console.log("変更可");
        } else {
          modalChange.classList.remove("button");
          modalChange.style.cursor = "not-allowed";
        }
      })
      modalChange.addEventListener('mouseleave', () => {
        modalChange.classList.add("button");
        modalChange.style.cursor = "pointer"
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

    })

    const deadline = document.createElement("p");
    deadline.className = "deadline";
    deadline.textContent = this._deadline;

    const taskCategory = document.createElement("p");
    taskCategory.className = "taskCategory";
    taskCategory.textContent = this._category;

    const statusarea = document.createElement("div");
    statusarea.className = "statusarea";

    const status = document.createElement("p");
    status.className = "status";
    status.textContent = String(this._status);
    statusarea.appendChild(status);

    taskBox.appendChild(circle);
    taskBox.appendChild(taskName);
    taskBox.appendChild(deadline);
    taskBox.appendChild(taskCategory);
    taskBox.appendChild(statusarea);

    this._parent.appendChild(taskBox);
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
  button.addEventListener('click', () => {
    const text: string = task.textContent!;
    if (text) {
      const jsontext: {task: string} = {task: text};
      console.log(jsontext);
    } else {
      const url: string = "./addTask.html";
      window.location.href = url;
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

