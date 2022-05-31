var submit = document.querySelector(".search-submit-button");
var form = document.querySelector(".search-form");
var inputValue = document.querySelector(".inputValue");
var error = document.querySelector(".error-message");
var l = document.querySelector(".city-name");
var ct = document.querySelector(".city-current-time");
var cd = document.querySelector(".date");
var t = document.querySelector(".temperature");
var d = document.querySelector(".description");
var w = document.querySelector(".windspeed");

// To use for Weather Card Animation
let card = document.getElementById("weather-card");
const weatherEl = document.getElementById("weather-elements");

// Weather Animation Classes
var sunny = document.querySelector(".sun");
var starry = document.querySelector(".starry-sky");
var cloudy = document.querySelector(".clouds");
var foggy = document.querySelector(".fog");
var dusty = document.querySelector(".dust");
var stormclouds = document.querySelector(".stormclouds");
var snowflakes = document.querySelector(".snowflakes");
var rainy = document.querySelector(".rain");
var lightning = document.querySelector(".lightning");
var tornado = document.querySelector(".tornado");

const weatherAPIKey = "14c174d43443c441a9c4751cd2bdaba8";

let openWeatherData = {};
let xhr = new XMLHttpRequest();

document.getElementById("submit").addEventListener("click", function (e) {
  e.preventDefault();
  error.textContent = "";

  xhr.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/weather?q=` +
      inputValue.value +
      `&appid=${weatherAPIKey}&units=metric`
  );
  xhr.responseType = "text";

  xhr.addEventListener(
    "load",
    function () {
      if (xhr.status === 200) {
        console.log("loading...");
        card.classList.add("fadein");
        console.log((openWeatherData = JSON.parse(xhr.responseText)));
        populateWeatherInfo();
        displayWeatherAnimation();
        exceptionCases();
      } else {
        console.log(error);
        error.textContent = "No current data available for this city.";
      }
    },
    false
  );

  xhr.send();
});

//Use enter to search the weather if you're to lazy to press the search icon
inputValue.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("submit").click();
  }
  return;
});

function populateWeatherInfo() {
  card.classList.remove("sunrise");
  card.classList.remove("bluesky");
  card.classList.remove("sunset");
  card.classList.remove("nightsky");

  //name, temp, windspeed, time
  const location = (l.textContent = openWeatherData.name);
  const temp = (t.textContent =
    Math.round(openWeatherData.main.temp) + "\u00B0" + "C");
  const desc = (d.textContent = openWeatherData.weather[0].description);
  const wind = (w.textContent =
    "Windspeed: " + openWeatherData.wind.speed + `mph`);

  //calculating current location time

  const newdate = new Date();
  localTime = newdate.getTime();
  localOffset = newdate.getTimezoneOffset() * 60000;
  utc = localTime + localOffset;
  var cityTime = utc + 1000 * openWeatherData.timezone;
  nd = new Date(cityTime);

  console.log(nd);

  const hrs = (nd.getHours() < 10 ? "0" : "") + nd.getHours();

  const mins = (nd.getMinutes() < 10 ? "0" : "") + nd.getMinutes();

  const currentLocationTime = (ct.textContent = hrs + ":" + mins);
  console.log(currentLocationTime);

  const currentDay = nd.getDate();

  const currentMonth = nd.toLocaleString("default", { month: "long" });

  const currentYear = nd.getFullYear();

  const currentLocationDate = (cd.textContent =
    currentDay + " " + currentMonth + " " + currentYear);

  if (currentLocationTime >= "05:00" && currentLocationTime <= "06:00") {
    card.classList.add("sunrise");
  } else if (currentLocationTime >= "06:01" && currentLocationTime <= "16:59") {
    card.classList.add("bluesky");
  } else if (currentLocationTime >= "17:00" && currentLocationTime <= "18:00") {
    card.classList.add("sunset");
  } else {
    card.classList.add("nightsky");
  }
}

function displayWeatherAnimation() {
  sunny.classList.remove("visible");
  starry.classList.remove("visible");
  cloudy.classList.remove("visible");
  foggy.classList.remove("visible");
  dusty.classList.remove("dust-visibility");
  stormclouds.classList.remove("visible-stormclouds", "visible");
  snowflakes.classList.remove("visible");
  rainy.classList.remove("visible-rain");
  lightning.classList.remove("lightning-visibility");
  tornado.classList.remove("visible");

  // Sunshine Visibility Conditions
  if (
    openWeatherData.weather[0].main === "Clear" ||
    (openWeatherData.weather[0].description === "few clouds" &&
      card.classList.contains("bluesky"))
  ) {
    sunny.classList.add("visible");
  }
  // Stars Visibility Conditions
  if (
    openWeatherData.weather[0].main === "Clear" &&
    card.classList.contains("nightsky", "sunset", "sunrise")
  ) {
    starry.classList.add("visible");
    sunny.classList.remove("visible");
  }
  // Normal Clouds Visibility Conditions
  if (
    openWeatherData.weather[0].description === "few clouds" ||
    openWeatherData.weather[0].description === "scattered clouds" ||
    openWeatherData.weather[0].description === "broken clouds"
  ) {
    cloudy.classList.add("visible");
  }
  // Tornado Visibility Conditions
  if (openWeatherData.weather[0].main === "Tornado") {
    tornado.classList.add("visible");
  }
  // Fog Visibility Conditions
  if (
    openWeatherData.weather[0].main === "Mist" ||
    openWeatherData.weather[0].main === "Smoke" ||
    openWeatherData.weather[0].main === "Haze" ||
    openWeatherData.weather[0].main === "Fog" ||
    openWeatherData.weather[0].main === "Squall"
  ) {
    foggy.classList.add("visible");
  }

  // Dust Visibility Conditions
  if (
    openWeatherData.weather[0].main === "Dust" ||
    openWeatherData.weather[0].main === "Sand"
  ) {
    dusty.classList.add("dust-visibility");
  }
  // Rain Visibility Conditions
  if (
    openWeatherData.weather[0].main === "Rain" ||
    openWeatherData.weather[0].main === "Drizzle" ||
    openWeatherData.weather[0].main === "Thunderstorm" ||
    openWeatherData.weather[0].description === "Light rain and snow"
  ) {
    rainy.classList.add("visible-rain");
  }
  // Lightning Visibility Conditions
  if (openWeatherData.weather[0].main === "Thunderstorm") {
    lightning.classList.add("lightning-visibility");
  }
  // Snow Visibility Conditions
  if (openWeatherData.weather[0].main === "Snow") {
    snowflakes.classList.add("visible");
  }

  // Storm Clouds Visibility Conditions
  if (
    openWeatherData.weather[0].main === "Snow" ||
    openWeatherData.weather[0].main === "Thunderstorm" ||
    openWeatherData.weather[0].main === "Drizzle" ||
    openWeatherData.weather[0].description === "overcast clouds"
  ) {
    stormclouds.classList.add("visible-stormclouds");
  }

  if (openWeatherData.weather[0].main === "Ash") {
    stormclouds.classList.add("visible");
  }
}

function exceptionCases() {
  // greysky visible during daytime/sunrise/sunset only
  if (
    openWeatherData.weather[0].main === "Snow" ||
    openWeatherData.weather[0].main === "Mist" ||
    openWeatherData.weather[0].main === "Drizzle" ||
    openWeatherData.weather[0].description === "overcast clouds" ||
    openWeatherData.weather[0].description === "freezing rain" ||
    openWeatherData.weather[0].description === "light intensity shower rain" ||
    openWeatherData.weather[0].description === "shower rain" ||
    openWeatherData.weather[0].description === "heavy intensity shower rain" ||
    (openWeatherData.weather[0].description === "ragged shower rain" &&
      card.classList.contains("bluesky", "sunrise", "sunset"))
  ) {
    card.classList.add("greysky");
    document.querySelector(".text-color-alterable").style.color = "#272727";
  }
  // greysky visible during all times for Tornado conditions
  if (
    openWeatherData.weather[0].main === "Tornado" &&
    card.classList.contains("bluesky", "sunrise", "sunset", "nightsky")
  ) {
    card.classList.add("greysky");
    document.querySelector(".text-color-alterable").style.color = "#272727";
  }
  // stormsky visibility conditions during daytime/sunrise/sunset only
  if (
    openWeatherData.weather[0].main === "Thunderstorm" &&
    card.classList.contains("bluesky", "sunrise", "sunset")
  ) {
    card.classList.add("stormsky");
  }
  // stormsky visibility conditions during night time only
  if (
    openWeatherData.weather[0].main === "Snow" ||
    (openWeatherData.weather[0].description === "freezing rain" &&
      card.classList.contains("nightsky"))
  ) {
    card.classList.add("stormsky");
  }
}
