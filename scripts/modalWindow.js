const buttonOpen = document.querySelector(".bars");
const modalContainer = document.querySelector(".modal");
const buttonClose = document.querySelector(".modal_close");

modalContainer.classList.add("modal_new");

// функция открытия модального окна
const openModal = function () {
  modalContainer.classList.remove("modal_unvisibility");
  modalContainer.classList.add("modal_visibility");
  // modalContainer.style.visibility = "visible";
  // modalContainer.style.opacity = 1;
  window.addEventListener("keydown", closeOnScreen);
};

// функция закрытия модального окна на крестик
const closeModal = function () {
  modalContainer.classList.remove("modal_visibility");
  // modalContainer.style.opacity = 0;
  setTimeout(() => {
    modalContainer.classList.add("modal_unvisibility");
    // modalContainer.style.visibility = "hidden";
  }, 600);
};

// функция закрытия модального окна при клике на пустое место или escape
const closeOnScreen = function (event) {
  if (event.target === modalContainer || event.keyCode == 27) {
    closeModal();
  }
};

buttonOpen.addEventListener("click", openModal);
buttonClose.addEventListener("click", closeModal);
modalContainer.addEventListener("click", closeOnScreen);

const getTimeUNIX = function (time, zone, elem) {
  const date = new Date(time * 1000);
  const options = {
    timeZone: zone,
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  };
  const formattedTime = date.toLocaleString("en-US", options);
  elem.innerHTML = formattedTime;
};
