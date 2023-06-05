const bars = document.querySelector(".bars");
const textField = document.querySelector(".modal_text");

function saveInput(inputt) {
  let values = JSON.parse(localStorage.getItem("myValues")) || [];
  if (values.indexOf(inputt.value) == -1) {
    values.push(inputt.value);
  }
  localStorage.setItem("myValues", JSON.stringify(values));
}

function getSaveItems() {
  let values = JSON.parse(localStorage.getItem("myValues")) || [];
  values.length == 0
    ? (textField.innerHTML = "Последние города отсутствуют")
    : (textField.innerHTML = values.map((val) => "⊗ " + val).join("<br>"));
}

bars.addEventListener("click", getSaveItems);

// navigator.geolocation.getCurrentPosition((position) => {
//   getTimeZone(position.coords.latitude, position.coords.longitude);
// });
