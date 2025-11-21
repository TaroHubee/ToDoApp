const addTaskDetails = document.querySelectorAll<HTMLDivElement>('.addTaskDetail');

addTaskDetails.forEach((detail) => {
  const addTaskDetailInitial = detail.querySelector(".addTaskDetailInitial")as HTMLDivElement;
  const addTaskDetailForm = detail.querySelector(".addTaskDetailForm")as HTMLDivElement;
  addTaskDetailForm.addEventListener('focus', () => {
    addTaskDetailInitial.style.visibility = 'hidden';
    console.log('hidden');
  });
  addTaskDetailForm.addEventListener('blur', () => {
    if (!addTaskDetailForm.textContent) {
      addTaskDetailInitial.style.visibility = 'visible';
    }
  });
})

//タスク追加

const detailButton = document.querySelector('.addTaskButton')! as HTMLDivElement;
if(detailButton) {
  const detailInfos = document.querySelectorAll<HTMLDivElement>('.addTaskDetail')!;
  const detail_task = detailInfos[0].querySelector('.addTaskDetailForm')!;
  const detail_due = detailInfos[2].querySelector('.addTaskDetailForm')!;
  const detail_category = detailInfos[1].querySelector('.addTaskDetailForm')!;
  const detail_status = detailInfos[3].querySelector('.addTaskDetailForm')!;
  detailButton.addEventListener('mouseenter', () => {
      if ( detail_task.textContent) {
          detailButton.classList.add('hover-enabled');
          detailButton.style.cursor = 'pointer';
      } else {
          detailButton.classList.remove('hover-enabled');
          detailButton.style.cursor = 'not-allowed';
      }
  })
  detailButton.addEventListener('mouseleave', () => {
      detailButton.classList.remove('hover-enabled');
  })
  
  detailButton.addEventListener('click', async() => {
    
    if ( detail_task.textContent || detail_category.textContent || detail_due.textContent) {
        const jsonDetail = {
            task: detail_task.textContent,
            category: detail_category.textContent,
            due: detail_due.textContent,
            status: detail_status.textContent
        };
        console.log(jsonDetail);
        try {
          const res = await fetch('http://localhost:3000/add-task', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(jsonDetail)
          });

          const data: { message: string; taskInfo: { task: string; category: string; due: string; status: string} } = await res.json();
          console.log('サーバーからの応答:', data);
        } catch (err) {
          console.error('通信エラー:', err);
        }
    }
  })

  

  // カレンダー用のボタンと隠し input
  const icon = detailInfos[2].querySelector('.icon') as HTMLButtonElement;
  const calender = detailInfos[2].querySelector('.hidden-date-input') as HTMLInputElement;

  // 📅ボタンをクリックしたら hidden input をクリック
  icon.addEventListener('click', () => {
    calender.showPicker();
  });

  // hidden input の値が変わったら div に反映
  calender.addEventListener('input', () => {
    if (!calender.value) {
      const due_initial = detailInfos[2].querySelector('.addTaskDetailInitial') as HTMLDivElement;
      due_initial.style.visibility = 'visible';
    } else {
      const due_initial = detailInfos[2].querySelector('.addTaskDetailInitial') as HTMLDivElement;
      due_initial.style.visibility = 'hidden';
    }
    detail_due.textContent = calender.value; // YYYY-MM-DD形式
    
  });
}