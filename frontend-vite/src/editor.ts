import { TaskConfig, CategoryConfig, StatusConfig} from "./config";
import { PageMaker } from "./pagemaker";
import { modal, overlay, NameChange } from "./nameBox";
import { TaskDatabaseManeger, EditorDatabaseManeger } from "./databaseManeger";
const NameBoxs = document.querySelector('.NameBoxs') as HTMLDivElement;
const NameChangeButton = document.querySelector('.NameChangeButton') as HTMLButtonElement;
const NameDeleteButton = document.querySelector('.NameDeleteButton') as HTMLButtonElement;
const duplicateModal = document.querySelector(".duplicateModal") as HTMLDivElement;
const dupulicateButtons = document.querySelectorAll<HTMLButtonElement>(".duplicateButton");
const isDoneStatus = document.querySelector('.isDoneStatus') as HTMLDivElement;


const configMap = {
    category: CategoryConfig,
    status: StatusConfig
};

const getMode = (): "category" | "status" => {
    const param = new URLSearchParams(location.search);
    return (param.get("mode") as "category" | "status") ?? "category";
}

async function main() {
    const mode = getMode();
    const config = configMap[mode];
    if (mode === "status") {
        isDoneStatus.classList.remove("hidden");
    }
    
    console.log(config.title, config.apiURL);
    const pageMaker = new PageMaker(config.title, config.apiURL, NameBoxs);


    const modalExit = modal.querySelector(".modalExit") as HTMLButtonElement;
    modalExit!.addEventListener('click', () => {
        overlay.classList.add("hidden");
        modal.classList.add("hidden");
    });
    NameChangeButton.addEventListener("mouseenter", () => {
        if (!NameChange.textContent) {
            NameChangeButton.disabled = true;
            NameChangeButton.style.cursor = "not-allowed";
        }
        if (NameChange.textContent === NameChange.dataset.name) {
            NameChangeButton.disabled = true;
            NameChangeButton.style.cursor = "not-allowed";
        }
    });

    NameChangeButton.addEventListener("mouseleave", () => {
        NameChangeButton.disabled = false;
        NameChangeButton.style.cursor = "pointer";
    });

    NameChangeButton.addEventListener('click', async() => {
        const databaseManeger = new EditorDatabaseManeger(config.apiURL);
        console.log(NameChange.dataset.id);
        console.log(NameChange.dataset.name);
        console.log(NameChange.textContent);
        const putResult = await databaseManeger.putRows(Number(NameChange.dataset.id), NameChange.dataset.name!, NameChange.textContent.trim());
        console.log("putResult:", putResult);
        switch (putResult.message) {
            case "Done":
                console.log("done");
                window.location.reload()
                break;
            case "exited":
                duplicateModal.classList.remove("hidden");
                dupulicateButtons.forEach(dupulicateButton => {
                    dupulicateButton.addEventListener("click", (e) => {
                        const target = e.currentTarget as HTMLButtonElement;
                        const value = target.dataset.id; // "yes" or "no"

                        if (value === "yes") {
                            console.log(`exitId: ${putResult.exitId}`)
                            console.log("Yes が押された");
                            //タスクDBからカテゴリーIDをexitIdに変更->put
                            const taskDBManeger = new TaskDatabaseManeger(TaskConfig.apiURL);
                            taskDBManeger.putCategory(Number(NameChange.dataset.id), putResult.exitId)
                            //カテゴリDBからカテゴリIDの行を削除->delete
                            databaseManeger.deleteRows(Number(NameChange.dataset.id))
                        } else if (value === "no") {
                            window.location.reload();
                        }
                    });
                });
                break;
            case "error":
                console.error("DE通信エラー");
                break;
            default:
                break;
        }

    });

    NameDeleteButton.addEventListener("mouseenter", () => {
        const checkbox = document.getElementById("done") as HTMLInputElement;
        if (!NameChange.textContent) {
            NameDeleteButton.disabled = true;
            NameDeleteButton.style.cursor = "not-allowed";
        }
        if (NameChange.textContent !== NameChange.dataset.name) {
            NameDeleteButton.disabled = true;
            NameDeleteButton.style.cursor = "not-allowed";
        }
        if (mode === "status" && checkbox.checked === true) {
            NameDeleteButton.disabled = true;
            NameDeleteButton.style.cursor = "not-allowed";
        }
    });

    NameDeleteButton.addEventListener("mouseleave", () => {
        NameDeleteButton.disabled = false;
        NameDeleteButton.style.cursor = "pointer";
    });

    NameDeleteButton.addEventListener('click', async() => {
        const databaseManeger = new EditorDatabaseManeger(config.apiURL);
        const message = await databaseManeger.deleteRows(Number(NameChange.dataset.id));
        console.log(`deleteId: ${NameChange.dataset.id}`);
        if(message.message === "Delete") {
            console.log(NameChange.dataset.id)
            window.location.reload();
        }
    });
    


    

    pageMaker.createTitle();
    pageMaker.createAddForm();
    document.addEventListener('DOMContentLoaded', () => {
        pageMaker.displayName();
    })
    
}
main();