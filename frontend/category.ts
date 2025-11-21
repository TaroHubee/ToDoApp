const addCategory = document.querySelector(".addCategory") as HTMLDivElement;
const addCategoryForm = addCategory.querySelector('.addCategoryForm')!;
const addCategoryInitial = addCategory.querySelector('.addCategoryInitial')!;
const addCategoryButton = addCategory.querySelector('.addTaskButton')!;
const overlay = document.querySelector('.overlay') as HTMLDivElement;
const modal = document.querySelector('.modal') as HTMLDivElement;
const categoryChagneExit = modal.querySelector(".categoryChangeExit")!;
const categoryChangeName = modal.querySelector(".categoryChangeName") as HTMLDivElement;
const categoryChangeButton = modal.querySelector(".categoryChangeButton") as HTMLButtonElement;
const duplicateModal = document.querySelector('.duplicateModal') as HTMLDivElement;
const duplicateButtonArea = duplicateModal.querySelector('.duplicateButtonArea') as HTMLDivElement;
const duplicateButton = duplicateButtonArea.querySelectorAll<HTMLButtonElement>(".duplicateButton");



class CategoryBox {
  private id: string;
  private categoryName: string;
  private categoryBoxs: HTMLDivElement;
  private categoryBox: HTMLDivElement;
  private category: HTMLDivElement;
  private edit_category: HTMLButtonElement;
  private editImg: HTMLImageElement


  constructor(id: string, categoryName: string) {
    this.id = id;
    this.categoryName = categoryName;
    this.categoryBoxs = document.querySelector(".categoryBoxs")!;
    this.categoryBox = document.createElement("div")!;
    this.category = document.createElement("div")!;
    this.edit_category = document.createElement("button");
    this.editImg = document.createElement("img");
  }


  //method
  addCategoryBox() { //フロントにカテゴリーを表示
    this.categoryBox.className = "categoryBox";
    this.category.className = "category";
    this.category.textContent = this.categoryName;
    this.categoryBox.appendChild(this.category);

    this.edit_category.className = "edit_category";
    this.edit_category.setAttribute("type", "button");
    this.editImg.src = "fig/edit.png";
    this.editImg.alt = "編集ボタン";
    this.edit_category.appendChild(this.editImg);
    
    this.categoryBox.appendChild(this.edit_category);
    this.categoryBoxs.appendChild(this.categoryBox);
  }

  //編集画面に遷移イベント追加
  moveModal() {
    this.edit_category.addEventListener("click", async () => {
      await setTimeout(() => {
        console.log("click")
        overlay.classList.remove("hidden");
        modal.classList.remove("hidden");
        categoryChangeName.textContent = this.categoryName;
        categoryChangeName.dataset.id = this.id;
        categoryChangeName.dataset.nowCategory = this.categoryName;
      }, 100)

    });
  }
}



// フォーカス（クリック）時に文字を消す
addCategoryForm.addEventListener('focus', () => {
  addCategoryInitial.textContent = '';
});


// フォーカスが外れた時（blur）に空なら初期文字に戻す
addCategoryForm.addEventListener('blur', () => {
  if (!(addCategoryForm.textContent)) {
    addCategoryInitial.textContent = 'Add Category';
  }
});

// カテゴリー新規追加
addCategoryButton.addEventListener('click', async () => {

  if (addCategoryForm.textContent) {
    const jsonCategory = {
      category: addCategoryForm.textContent
    };
    console.log(jsonCategory);
    try {
      const res = await fetch('http://localhost:3000/add-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonCategory)
      });

      const data: { message: string; category: string } = await res.json();
      console.log('サーバーからの応答:', data);

    } catch (err) {
      console.error('通信エラー:', err);
    }
  }
})

/*データベースに登録されてるカテゴリーを取得*/
const categoryDateInServer = async () => {
  try {
    const res = await fetch('http://localhost:3000/get-category', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data: { id: string, category: string }[] = await res.json();
    console.log('サーバーからの応答', data);
    data.forEach(element => {
      const categoryBox = new CategoryBox(String(element.id), element.category);
      categoryBox.addCategoryBox();
      categoryBox.moveModal();
    });
  } catch (err) {
    console.error('通信エラー', err);
  }
}
categoryDateInServer();

/*モーダル内-------------------------------------------------------------------*/
//入力前後の変更有無チェック関数
const isChanged = (): boolean => {
  if (categoryChangeName.textContent === categoryChangeName.dataset.nowCategory!) {
    return false;
  } else {
    return true;
  }
}
//マウスカーソルの制御
categoryChangeButton.addEventListener('mouseenter', () => {
  if (isChanged()) {
    categoryChangeButton.style.cursor = 'pointer';
    
  } else {
    categoryChangeButton.disabled = true;
    categoryChangeButton.style.cursor = 'not-allowed';
  }
});
categoryChangeButton.addEventListener('mouseleave', () => {
  categoryChangeButton.disabled = false;
});

//
categoryChangeButton.addEventListener('click', async() => {
  if (isChanged()) {
    console.log("変更情報[ id: ", categoryChangeName.dataset.id ,categoryChangeName.dataset.nowCategory, "->", categoryChangeName.textContent, "]をサーバーに送信中");
    /*サーバーに変更したことを送信*/
    try {
      const res = await fetch('http://localhost:3000/change-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id: categoryChangeName.dataset.id, before: categoryChangeName.dataset.nowCategory, after: categoryChangeName.textContent})
      });

      const data: { result: string, message: string; content: string } = await res.json();
      console.log('サーバーからの応答:', data);
      //同じカテゴリーがあったとき
      //同じカテゴリーありますよ？統合しますか？のポップアップを出す
      if (data.result === "failed") {
        overlay.classList.remove("hidden");
        duplicateModal.classList.remove("hidden");
      }

    } catch (err) {
      console.error('通信エラー:', err);
    }
  } else {
    console.log("変更してないです");
    console.log("id: ", categoryChangeName.dataset.id);
    console.log("before:", categoryChangeName.dataset.nowCategory);
    console.log("after:", categoryChangeName.textContent);
  }
  
})


/*既存カテゴリー編集モーダルからexit */
const isModal = (): boolean => {
  if (modal.classList.contains("hidden")) {
    return false;
  } else {
    return true;
  }
}

categoryChagneExit.addEventListener('click', async () => {
  if (isModal()) {
    overlay.classList.add("hidden");
    modal.classList.add("hidden");
  }
})

type YesNo  = "yes" | "no";
duplicateButton.forEach((Element) => {
  Element.addEventListener('click', async(e) => {
    console.log('click');
    const yesnoid: YesNo = (e.currentTarget as HTMLElement).dataset.id as YesNo;
    if (yesnoid === "yes") {
      /*タスクDBとの紐づけ完了後に実装*/
    } else {
      duplicateModal.classList.add("hidden");
    }
  })
})





