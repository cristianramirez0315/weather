let currentWeather = {};
let weatherForecast = {};
let lat;
let lon;
let city;
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
            // get the coordinates from city name
            console.log(data);
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
    $("#currentWeatherImage").src = "https://openweathermap.org/img/wn/" + currentWeather.weather[0].icon + ".png";
    $("#cityNameAndDate").text(city + " (" + formatDate() + ")");
    $("#temp").text("Temperature: " + Math.floor(currentWeather.temp) + "°F");
    $("#wind").text("Wind speed: " + currentWeather.wind_speed + " MPH");
    $("#humidity").text("Humidity: " + currentWeather.humidity + "%");
    $("#uvIndex").text("Uv index: " + currentWeather.uvi);
    console.log($("#currentWeatherImage").src);
}

function displayForecast(forecast) {
    forecast.forEach((weather, index) => {
        html = `<div class="forecast-cards"><div class="date">${formatDate(
            weather.dt
        )}</div>
        <div class="temperature">Temp: ${Math.floor(weather.temp.day)}°F</div>
        <div class="wind">Wind: ${weather.wind_speed} MPH</div>
        <div class="humidity">Humidity: ${weather.humidity}%</div></div>`;

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