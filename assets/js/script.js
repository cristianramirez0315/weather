
let currentWeather = {};
let weatherForecast = {};
let lat;
let lon;
let city;
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(timestamp) {
    let time = new Date();
    if (timestamp) {
        time = new Date(timestamp);
    }
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();

    return days[day] + ', ' + months[month] + ' ' + date;
}

async function fetchWeather() {
    const cityName = document.querySelector("#city").value;
    const key = 'b20064f7836760055cac601b67d7c4cd';
    let getCoordinates = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}`;

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
            lat = data.coord.lat;
            lon = data.coord.lon;
            city = data.name;
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
        })
        .catch(console.err);
}

function displayCurrentWeather(currentWeather) {
    $('#cityNameAndDate').text(city + " (" + formatDate() + ")");
    $('#temp').text("Temperature: " + Math.floor(currentWeather.temp) + "°F");
    $('#wind').text("Wind speed: " + currentWeather.wind_speed + " MPH");
    $('#humidity').text("Humidity: " + currentWeather.humidity + " %");
    $('#uvIndex').text("Uv index: " + currentWeather.uvi);
}

function displayForecast(forecast) {
    forecast.forEach((weather, index) => {
        const parent = $('day-' + (index + 1));
    });
}