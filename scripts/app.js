// ПЕРЕМЕННЫЕ
const tempField = document.querySelector(".left-t"); // поле с температурой
const tempLocate = document.querySelector(".left-l"); // локация
const tempImg = document.querySelector(".left-i"); // картинка температуры
const description = document.querySelector(".description"); // описание возле времени
const timeField = document.querySelector(".time"); // поле для времени
const searchButton = document.querySelector(".butt"); // кнопка поиска
const searchInput = document.querySelector(".text-field"); // поле ввода города
const weatherImageBlock = document.querySelector(".weather-container"); // главный блок с фото
const apiWeather = "ca8d193b74b685a1beb373aaaa7d5f31"; // апи от погоды
const sunsetField = document.querySelector(".indicators-sunset");
const sunriseField = document.querySelector(".indicators-sunrise");
const humidityField = document.querySelector(".indicators-humidity");
const indexField = document.querySelector(".indicators-index");
const pressureField = document.querySelector(".pressure");
const windSpeedField = document.querySelector(".wind-speed");
let apiSearch = "AIzaSyBQAO1UXKqjcgI3ptd5-e9whHYCObw7Bco"; // апи от гугл поиска
let timeZone = ""; // строчка с timezone
let cx = "668fe178c632844ba"; // айди от custom search
let urlImage = []; // массив с url фоток города
let intervalId; // айди интервала
let sunset;
let sunrise;

$(document).ready(() => {
  if (
    window.screen.width <= 382 ||
    (window.screen.width >= 979 && window.screen.width <= 1065)
  ) {
    document.querySelector(".winddop").innerHTML = "Ветер";
  }
});

// функция делает get запрос через custom search api для 10 фото по запросу
function getPhotos(req) {
  urlImage = [];
  let url = `https://www.googleapis.com/customsearch/v1?cx=${cx}&searchType=Image&q=${req}&key=${apiSearch}`;
  $.ajax({
    method: "GET",
    url: url,
  }).done(function (ans) {
    ans.items.forEach((element) => {
      urlImage.push(element.link);
    });
  });
}

// функция для смены 10 фото в определеном интервале
function changeBackground(urlImage, element) {
  let counter = 0;
  let k = 0;
  intervalId = setInterval(() => {
    element.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${urlImage[counter]})`;
    counter = (counter + 1) % urlImage.length;
    getTime(timeZone, timeField);
  }, 2000);
}

// функция получения часового пояса в конкретном городе (timezonedb api)
async function getTimeZone(lat, lng, country, city) {
  let getTimeZoneUrl = `https://api.timezonedb.com/v2.1/get-time-zone?by=position&lat=${lat}&lng=${lng}&country=${country}&city=${city}&key=8F8P7CPU1RGX&format=json`;
  await fetch(getTimeZoneUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      timeZone = data.zoneName;
    });
  getTimeUNIX(sunset, timeZone, sunsetField);
  getTimeUNIX(sunrise, timeZone, sunriseField);
}

// функция которая получает время по часовому поясу
function getTime(zone, elem) {
  elem.innerHTML = new Intl.DateTimeFormat("en-GB", {
    timeStyle: "short",
    timeZone: zone,
  }).format(new Date());
}

// функция делает гет запрос к weather api, в случае успешного запроса меняет данные в хтмл тегах

function getWeather() {
  let urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&lang=ru&units=metric&appid=${apiWeather}`;
  $.ajax({
    method: "GET",
    url: urlWeather,
  })
    .done(function (ans) {
      console.log(ans);
      tempField.innerHTML = Math.floor(ans.main.temp) + "°C";
      tempLocate.innerHTML = ans.name + ", " + ans.sys.country;
      tempImg.src = `/img/weather-${ans.weather[0].main}.png`;
      description.innerHTML = ans.weather[0].description + ", Четверг";
      sunset = ans.sys.sunset;
      sunrise = ans.sys.sunrise;
      humidityField.innerHTML = ans.main.humidity + "%";
      pressureField.innerHTML = ans.main.pressure + " hPA";
      windSpeedField.innerHTML = ans.wind.speed + " km/h";
      clearInterval(intervalId);
      saveInput(searchInput);
      getPhotos(searchInput.value);
      changeBackground(urlImage, weatherImageBlock);
      getTimeZone(ans.coord.lat, ans.coord.lon, ans.sys.country, ans.name);
      getUfIndex(ans.coord.lat, ans.coord.lon);
      ymaps.ready(init(ans.coord.lat, ans.coord.lon));
    })

    .fail(() => {
      // модальное окно SweetAlert https://sweetalert2.github.io/#download
      Swal.fire("Ошибка!", "Введите корректное название города", "error");
    });
}

function init(lat, lan) {
  if (typeof myMap == "object") {
    myMap.destroy();
  }
  myMap = new ymaps.Map("map", {
    center: [lat, lan],
    zoom: 11,
    suppressMapOpenBlock: true,
    controls: ["zoomControl"],
  });
}

function getUfIndex(lat, lon) {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/uvi?appid=${apiWeather}&lat=${lat}&lon=${lon}`,
  }).done(function (ans) {
    indexField.innerHTML = Math.floor(ans.value) + " of 13";
  });
}

// прослушиватель на кнопку поиска, который запускает функцию

searchButton.addEventListener("click", () => {
  getWeather();
});

// прослушиватель на кнопку Enter, который запускает функцию

searchInput.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    getWeather();
  }
});
