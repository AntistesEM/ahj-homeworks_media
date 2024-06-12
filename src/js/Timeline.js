import { audioEventListener } from "./audio";
import { videoEventListener } from "./video";

function findLocation(typeEvent) {
  if (!navigator.geolocation) {
    console.log("Ваш браузер не дружит с геолокацией...");
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }

  // Если всё хорошо
  function success(position) {
    const { longitude, latitude } = position.coords;
    if (typeEvent === "text") {
      const textInput = document.querySelector(".input-text");
      const inputValue = textInput.value;
      textInput.value = "";
      createBlock(longitude, latitude, inputValue);
    } else if (typeEvent === "audio") {
      audioEventListener(typeEvent, longitude, latitude, createBlock);
    } else if (typeEvent === "video") {
      videoEventListener(typeEvent, longitude, latitude, createBlock);
    }
  }

  // Если всё плохо
  function error() {
    const modal = document.querySelector(".modal-background");
    modal.style.display = "block";
  }
}

const inputText = document.querySelector(".input-text");
inputText.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    findLocation("text");
  }
});

const btnCancel = document.querySelector(".btn-cancel");
btnCancel.addEventListener("click", () => {
  const modalInput = document.querySelector(".modal-input");
  modalInput.value = "";

  modalClose();
});

const btnOk = document.querySelector(".btn-ok");
btnOk.addEventListener("click", () => {
  const modalInput = document.querySelector(".modal-input");
  const inputValue = modalInput.value;
  const coords = parseCoordinates(inputValue);
  modalInput.value = "";
  const textInput = document.querySelector(".input-text");
  createBlock(coords.latitude, coords.longitude, textInput.value);
  textInput.value = "";
  modalClose();
});

const btnMicrophone = document.querySelector(".icon.microphone");
btnMicrophone.addEventListener("click", () => {
  menuControlShow();

  findLocation("audio");
});

const btnCamera = document.querySelector(".icon.camera");
btnCamera.addEventListener("click", () => {
  menuControlShow();
  findLocation("video");
});

const audioStop = document.querySelector(".icon.cancel");
audioStop.addEventListener("click", () => {
  menuControlShow(true);
});

function menuControlShow(state = false) {
  if (!state) {
    const iconContainer = document.querySelector(".icon-container");
    iconContainer.style.display = "none";

    const controlContainer = document.querySelector(".control-container");
    controlContainer.style.display = "flex";
  } else if (state) {
    const iconContainer = document.querySelector(".icon-container");
    iconContainer.style.display = "flex";

    const controlContainer = document.querySelector(".control-container");
    controlContainer.style.display = "none";
  }
}

function modalClose() {
  const modal = document.querySelector(".modal-background");
  modal.style.display = "none";
}

export function parseCoordinates(input) {
  input = input.trim();

  // Проверяем, есть ли квадратные скобки
  if (input.startsWith("[") && input.endsWith("]")) {
    input = input.slice(1, -1);
  }

  // Разделяем строку на широту и долготу
  const parts = input.split(",");
  if (parts.length !== 2) {
    throw new Error('Неверный формат координат: должно быть "широта, долгота"');
  }

  // Извлекаем широту и долготу
  const latitude = parseFloat(parts[0].trim());
  const longitude = parseFloat(parts[1].trim());

  // Проверяем корректность значений
  if (
    isNaN(latitude) ||
    isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("Неверные координаты");
  }

  return { latitude, longitude };
}

export function createBlock(longitude, latitude, value, typeEvent) {
  const divContainer = document.querySelector(".container-block");

  const div = document.createElement("div");
  div.classList.add("wrap-block");

  const spanDate = document.createElement("span");
  spanDate.classList.add("date");
  spanDate.textContent = getCurrentDateTimeString();

  div.appendChild(spanDate);

  if (typeof value === "string") {
    const p = document.createElement("p");
    p.classList.add("text");
    p.textContent = value;

    div.appendChild(p);
  } else if (typeof value === "object") {
    const audio = document.createElement(typeEvent);
    audio.controls = true;
    audio.classList.add(typeEvent);
    audio.src = URL.createObjectURL(value);

    div.appendChild(audio);
  } else console.log("Неверное значение");

  const spanCoords = document.createElement("span");
  spanCoords.classList.add("coordinates");
  spanCoords.textContent = `[${latitude}, ${longitude}]`; // "[51.50851, -0.12572]";

  div.appendChild(spanCoords);

  divContainer.appendChild(div);
}

function getCurrentDateTimeString() {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear().toString().slice(2);
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
