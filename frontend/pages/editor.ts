import { CategoryConfig, StatusConfig} from "../ts/edit/config.js";
import { PageMaker } from "../ts/edit/pagemaker.js";
import { modal, overlay, NameChange } from "../ts/edit/nameBox.js";
import { DatabaseManeger } from "../ts/edit/databaseManeger.js";
const NameBoxs = document.querySelector('.NameBoxs') as HTMLDivElement;
const NameChangeButton = document.querySelector('.NameChangeButton') as HTMLButtonElement;
const NameDeleteButton = document.querySelector('.NameDeleteButton') as HTMLButtonElement;

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
    
    console.log(config.title, config.apiURL);
    const pageMaker = new PageMaker(config.title, config.apiURL, NameBoxs, config.propaty);


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
    });

    NameChangeButton.addEventListener("mouseleave", () => {
        NameChangeButton.disabled = false;
        NameChangeButton.style.cursor = "pointer";
    });

    // NameChangeButton.addEventListener('click', () => {
    //     const databaseManeger = new DatabaseManeger(config.apiURL, config.propatyInTasks);
    //     databaseManeger.putRows(Number(NameChange.dataset.id), NameChange.dataset.nowCategory!, NameChange.textContent!);

    // });

    NameDeleteButton.addEventListener('click', () => {
        const databaseManeger = new DatabaseManeger(config.apiURL);
        databaseManeger.deleteRows(Number(NameChange.dataset.id));
    });
    

    pageMaker.createTitle();
    pageMaker.createAddForm();
    document.addEventListener('DOMContentLoaded', () => {
        pageMaker.displayName();
    })
    
}
main();