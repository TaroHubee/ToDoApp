const container = document.querySelector(".container") as HTMLDivElement;
const tasks = document.querySelectorAll(".taskBox");
const taskBoxs = container.querySelector(".taskBoxs") as HTMLDivElement;

const addTaskForms = document.querySelector('.addTaskForms') as HTMLDivElement;
const addTaskInitial = addTaskForms.querySelector(".addTaskInitial")!;
const addTaskForm = addTaskForms.querySelector(".addTaskForm")!;

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
    private _categoryId: number,
    private _statusId: number,
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
    img.src = "fig/unCheckedCircle.png";
    img.alt = "チェックボックス";
    circle.append(img);

    const taskName = document.createElement("p");
    taskName.className = "taskName";
    taskName.textContent = this._task;

    const deadline = document.createElement("p");
    deadline.className = "deadline";
    deadline.textContent = this._deadline;

    const taskCategory = document.createElement("p");
    taskCategory.className = "taskCategory";
    taskCategory.textContent = String(this._categoryId);

    const statusarea = document.createElement("div");
    statusarea.className = "statusarea";

    const status = document.createElement("p");
    status.className = "status";
    status.textContent = String(this._statusId);
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
      const res = await fetch('http://localhost:3000/get-task', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data: { id: number, task: string, category: number, due: string, status: number }[] = await res.json();
      console.log('サーバーからの応答', data);
      data.forEach(element => {
        const taskBox = new TaskBox(element.id, element.task, element.due, element.category, element.status, taskBoxs);
        taskBox.createTaskBox();
      });
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

