import { Modal } from "./overlay.js";
import { APIURL_Task } from "./APIURL.js";
import { TaskDatabaseManeger } from "./databaseManeger.js";
import { TaskBox } from "./taskBox.js";
const container = document.querySelector(".container") as HTMLDivElement;
const tasks = document.querySelectorAll(".taskBox");
const taskBoxs = container.querySelector(".taskBoxs") as HTMLDivElement;
const addTaskForms = document.querySelector('.addTaskForms') as HTMLDivElement;
const addTaskInitial = addTaskForms.querySelector(".addTaskInitial")!;
const addTaskForm = addTaskForms.querySelector(".addTaskForm")!;

/*データベースに登録されてるタスクを取得*/
const taskDBManager = new TaskDatabaseManeger(APIURL_Task.post);
document.addEventListener("DOMContentLoaded",async() => {
  const res = await taskDBManager.getTaskInfo();
  if (res.result === "fail") {
    console.error("タスク情報の取得に失敗しました");
    return;
  } else {
    const data: { id: number, task: string, due: string, category: string, status: string }[] = res.data!;
    console.log('サーバーからの応答1', data);
    for (const element of data) {
      const taskBox = new TaskBox(element.id, element.task, element.due, element.category, element.status, taskBoxs);
      await taskBox.createTaskBox();
    }
  }
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
            const message = await taskDBManager.postTask(text);
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

