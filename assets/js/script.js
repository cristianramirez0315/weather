let currentWeather = {};
let weatherForecast = {};
let lat;
let lon;
let city;
let iconUrl;
const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

function inRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
}

function formatDate(timestamp) {
    let time = new Date();
    if (timestamp) {
        time = new Date(timestamp * 1000);
    }
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();

    return days[day] + ", " + months[month] + " " + date;
}

async function fetchWeather() {

    const cityName = document.querySelector("#city").value;
    const key = "b20064f7836760055cac601b67d7c4cd";
    let getCoordinates = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}`;

    await fetch(getCoordinates)
        .then((response) => {
            if (!response.ok) {
                alert("No weather found.");
                throw new Error("No weather found.");
            }
            return response.json();
        })
        .then((data) => {
            iconUrl = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
            lat = data.coord.lat;
            lon = data.coord.lon;
            city = data.name;
            addToMostRecent(city);
        })
        .catch(console.err);

    let getWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=${key}`;
    fetch(getWeather)
        .then((response) => {
            if (!response.ok) {
                throw new Error("No weather found.");
            }
            return response.json();
        })
        .then((data) => {
            displayCurrentWeather(data.current);
            displayForecast(data.daily);
            $("#forecast").show();

            // display most recent cities
            displayMostRecentList();
        })
        .catch(console.err);
}

function displayCurrentWeather(currentWeather) {
    $("#cityNameAndDate").html(city + " (" + formatDate() + ")" + "<img src='" + iconUrl + "'>");
    $("#temp").text("Temperature: " + Math.floor(currentWeather.temp) + "??F");
    $("#wind").text("Wind speed: " + currentWeather.wind_speed + " MPH");
    $("#humidity").text("Humidity: " + currentWeather.humidity + "%");
    $("#uvIndexValue").text(currentWeather.uvi);

    // change the background color of uvi according to its value
    if (inRange(currentWeather.uvi, 0, 2)) {
        $('#uvIndexValue').css({ "background-color": "#2dc906" });
    } else if (inRange(currentWeather.uvi, 3, 6)) {
        $('#uvIndexValue').css({ "background-color": "#ffa44f" });
    } else {
        $('#uvIndexValue').css({ "background-color": "#ff6363" });
    }
}

function displayForecast(forecast) {
    forecast.forEach((weather, index) => {
        let icon = "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png";
        html = `<div class="forecast-cards">
        <img src="${icon}">
        <div class="date">
          ${formatDate(weather.dt)}
        </div>
        <div class="temperature">Temp: ${Math.floor(weather.temp.day)}??F
        </div>
        <div class="wind">Wind: ${weather.wind_speed} MPH
        </div>
        <div class="humidity">Humidity: ${weather.humidity}%
        </div>
      </div>`;

        $(`#day-${index}`).html(html);
    });
}

let recentSearches = [];

function addToMostRecent(cityName) {
    if (recentSearches.includes(cityName)) {
        return;
    }
    recentSearches.push(cityName);
    localStorage.setItem('recentSearches', recentSearches.join(','));
}

function displayMostRecentList() {
    $('#recentSearches').html('');
    recentSearches.forEach(item => {
        $('#recentSearches').append(`<li class="list-group-item mb-1">
        <button type="button" class="btn btn-dark" onclick="fetchWeatherOnClick('${item}')">${item}</button>
        </li>`);
    });
}

function fetchWeatherOnClick(keyword) {
    $("#city").val(keyword);
    fetchWeather();
}

function init() {
    const value = localStorage.getItem('recentSearches');
    recentSearches = value.split(",");
    displayMostRecentList();
}

init();