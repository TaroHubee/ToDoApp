const container = document.querySelector(".taskBoxs") as HTMLDivElement;
const tasks = document.querySelectorAll(".taskBox");

const addTaskForms = document.querySelector('.addTaskForms') as HTMLDivElement;
const addTaskInitial = addTaskForms.querySelector(".addTaskInitial")!;
const addTaskForm = addTaskForms.querySelector(".addTaskForm")!;





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

