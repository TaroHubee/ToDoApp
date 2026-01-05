const slider = document.querySelector(".slider") as HTMLDivElement;
const menu = document.querySelector(".menu") as HTMLButtonElement;

menu.addEventListener('click', () => {
  if (slider.classList.contains("active")) {
    slider.classList.remove("active");
  } else {
    slider.classList.add("active");
  }
  
})

document.addEventListener('click', (e) => {
  if (slider!.contains(e.target as Node) || menu!.contains(e.target as Node)) {
    return;
  } else {
    if (slider.classList.contains("active")) {
      slider.classList.remove("active");
    } 
  }
})