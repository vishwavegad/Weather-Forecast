import {API_KEY} from "./config.js"
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const current_weatherEl = document.getElementById("current_weather");
const locationEl = document.getElementById("location");
const today_infoEl = document.getElementById("today_info");
const future_weatherEl = document.getElementById("future_weather");
const search_input = document.querySelector(".search input");
const search_button = document.querySelector(".search button");

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Ovtober", "November", "December"];

locationEl.textContent = "Asia/Kolkata";
locationEl.style.display = "none";
current_weatherEl.innerHTML = "";
today_infoEl.innerHTML = "";
future_weatherEl.innerHTML = "";

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const day = time.getDay();
    const date = time.getDate();
    const hour = time.getHours();
    const hourIn12 = hour >= 13 ? hour % 12 : hour;
    const ampm = hour >= 12 ? "PM" : "AM";
    const minute = time.getMinutes().toString().padStart(2, '0');

    timeEl.innerHTML = hourIn12 + ":" + minute + " " + `<span id="am_pm">${ampm}</span>`;
    dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

async function getWeatherData(city) {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`
        );
        if (!response.ok) {
            throw new Error("City not found");
        }
        const data = await response.json();
        console.log(data);
        showWeatherData(data);
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        alert("Unable to fetch weather data. Please check the city name and try again.");
    }
}

function showWeatherData(data) {
    const { location, current, forecast } = data;
    locationEl.textContent = location.name + ", " + location.country;
    locationEl.style.display = "block"; 

    current_weatherEl.innerHTML = `<div class="weather_info">
                        <div>Humidity</div>
                        <div>${current.humidity}</div>
                    </div>
                    <div class="weather_info">
                        <div>Pressure</div>
                        <div>${current.pressure_mb}</div>
                    </div>
                    <div class="weather_info">
                        <div>Wind Speed</div>
                        <div>${current.wind_kph}</div>
                    </div>`;
    today_infoEl.innerHTML = `<img src="${current.condition.icon}" alt="weather   icon" class="img">
            <div class="other">
                <div class="day">${days[new Date(forecast.forecastday[0].date).getDay()]}</div>
                <div class = "temperature">Temp - ${current.temp_c.toFixed(1)}&#176;C</div>
                <div class = "condition">${current.condition.text}</div>
            </div>`
    future_weatherEl.innerHTML = forecast.forecastday
        .slice(1)
        .map((day) => `
            <div class="future_weather_item">
                <div class="day">${days[new Date(day.date).getDay()]}</div>
                <img src="${day.day.condition.icon}" alt="weather icon" class="img">
                <div class="temperature">Min => ${day.day.mintemp_c.toFixed(1)}&#176; C</div>
                <div class="temperature">Max => ${day.day.maxtemp_c.toFixed(1)}&#176; C</div>
            </div>`
        )
        .join("");
}

search_button.addEventListener("click", ()=>{
    const city = search_input.value.trim();
    if(city){
        current_weatherEl.style.display = "block";
        today_infoEl.style.display = "block";
        getWeatherData(city);
    }
    else{
        alert("Please enter a city name");
    }
    locationEl.textContent = "";
        locationEl.textContent = "";
        locationEl.style.display = "none";
        current_weatherEl.innerHTML = "";
        today_infoEl.innerHTML = "";
        future_weatherEl.innerHTML = "";
})