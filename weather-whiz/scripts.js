let cityInput = document.getElementById("city-input");
let serachBtn = document.getElementById("searchbtn");
let locationBtn = document.getElementById("locationbtn");
let apiKey = "3948fe21e92235a9e5e10a797c71889f";
let currentWeatherCard = document.querySelectorAll(".weather-left .card")[0];
let fiveDaysForecastCard = document.querySelector(".day-forecast");
let aqiCard = document.querySelectorAll(".highlights .card")[0];
let sunriseCard = document.querySelectorAll(".highlights .card")[1];
let humidityVal = document.getElementById('humidityVal');
let pressureVal = document.getElementById('pressureVal');
let visibilityVal = document.getElementById('visibilityVal');
let windSpeedVal = document.getElementById('windSpeedVal');
let feelsVal = document.getElementById('feelsVal');
let hourlyForecastCard = document.querySelector('.hourly-forecast')
let aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];


function getWeatherDetails(name, lat, lon, country, state) {
  let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  let AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  months = [
    "Jan  ",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  fetch(AIR_POLLUTION_API_URL)
    .then((res) => res.json())
    .then((data) => {
        let{co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
      aqiCard.innerHTML = `
      <div class="card-head">
                        <p>Air Quality Index</p>
                        <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
                    </div>
                    <div class="air-indices">
                        <i class="fa-solid fa-wind"></i>
                        <div class="item">
                            <p>PM2.5</p>
                            <h2>${pm2_5}</h2>
                        </div>
                        <div class="item">
                            <p>PM10</p>
                            <h2>${pm10}</h2>
                        </div>
                        <div class="item">
                            <p>SO2</p>
                            <h2>${so2}</h2>
                        </div>
                        <div class="item">
                            <p>CO</p>
                            <h2>${co}</h2>
                        </div>
                        <div class="item">
                            <p>NO</p>
                            <h2>${no}</h2>
                        </div>
                        <div class="item">
                            <p>NO2</p>
                            <h2>${no2}</h2>
                        </div>
                        <div class="item">
                            <p>NH3</p>
                            <h2>${nh3}</h2>
                        </div>
                        <div class="item">
                            <p>O3</p>
                            <h2>${o3}</h2>
                        </div>
                    </div>
`;
    })
    .catch(() => {
      alert(`failed to fetch current air pollution`);
    });

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let date = new Date();
      currentWeatherCard.innerHTML = `
         <div class="current-weather">
                <div class="details">
                    <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <p style="letter-spacing:2px; font-weight:300;">${data.weather[0].description}</p>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${
                      data.weather[0].icon
                    }@2x.png" alt="">
                </div>
            </div>
            <hr>
            <div class="card-footer">
                <p><i class="fa-regular fa-calendar"></i>${days[date.getDay()]}  ${date.getDate()}  ${months[date.getMonth()]}   ${date.getFullYear()}</p>
                <p><i class="fa-solid fa-location-dot"></i>     ${name}  ${country}</p>
            </div>
   `;
     let {sunrise, sunset} = data.sys,
       {timezone, visibility}= data,
       {humidity, pressure, feels_like} = data.main,
       {speed} = data.wind,
    sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A'),
    sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');
    sunriseCard.innerHTML = `
           <div class="card-head">
                        <p>Sunrise & Sunset</p>
                    </div>
                    <div class="sunrise-sunset">
                        <div class="item">
                            <div class="icon">
                                <i class="fal fa-sunrise" style="font-size:40px;"></i>
                            </div>
                            <div>
                                <p>Sunrise</p>
                                <h2>${sRiseTime}</h2>
                            </div>
                        </div>
                        <div class="item">
                            <div class="icon" >
                               <i class="fal fa-sunset" style="font-size:40px;"></i>
                            </div>
                            <div>
                                <p>Sunset</p>
                                <h2>${sSetTime}</h2>
                            </div>
                        </div>
                  </div>

    `;

    humidityVal.innerHTML =`${humidity}<span style="font-size: 19px;">%</span>`;
    pressureVal.innerHTML =`${pressure}<span style="font-size: 19px;">hpa</span>`;
    visibilityVal.innerHTML =`${visibility/1000}<span style="font-size:19px;">km</span>`;
    windSpeedVal.innerHTML =`${speed}<span style="font-size: 19px;">m/s</span>`;
    feelsVal.innerHTML =`${(feels_like - 273.15).toFixed(2)}<span style="font-size: 19px;">&deg;C</span>`;
    })
    .catch(() => {
      alert(`failed to fetch current weather`);
    });

  fetch(FORECAST_API_URL)
    .then((res) => res.json())
    .then((data) => {

      let hourlyForecast = data.list;
      hourlyForecastCard.innerHTML = '';
      for(i=0; i<=7; i++){
        let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
        let hr = hrForecastDate.getHours();
        let a ="PM";
        if(hr<12) a="AM";
        if(hr==0) hr=12;
        if( hr>12)  hr-=12; 
      hourlyForecastCard.innerHTML +=`
            <div class="card">
                <p>${hr} ${a}</p>
                <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                <p>${(hourlyForecast[i].main.temp-273.15).toFixed(2)}&deg;C</p>
            </div>
      `        
      }

      let uniqueForecastDays = [];
      let fiveDaysForecast = data.list.filter((forecast) => {
        let forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });
      console.log(fiveDaysForecast);
      fiveDaysForecastCard.innerHTML = ``;
      for (i = 1; i < fiveDaysForecast.length; i++) {
        let date = new Date(fiveDaysForecast[i].dt_txt);
        fiveDaysForecastCard.innerHTML += `
             
              <div class="forecast-items">
                <div class="icon-wrapper">
                    <img src="https://openweathermap.org/img/wn/${
                      fiveDaysForecast[i].weather[0].icon
                    }.png" alt="">
                    <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(
                      2
                    )}&deg;C</span>
                 </div>
                <p>${date.getDate()} ${months[date.getMonth()]}</p>
                <p>${days[date.getDay()]}</p>
            </div>
             `;
      }
    })
    .catch(() => {
      alert(`failed to fetch current weather`);
    });
}

function getCityCoordinates() {
  let cityName = cityInput.value.trim();
  cityInput.value = "";
  if (!cityName) return;
  let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let { name, lat, lon, country, state } = data[0];
      getWeatherDetails(name, lat, lon, country, state);
    })
    .catch(() => {
      alert(`failed to fetch coordinates of ${cityName}.`);
    });
}




function getUserCoordinates(){
navigator.geolocation.getCurrentPosition(position =>{
  let {latitude, longitude} = position.coords;
  let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`

  fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
    let {name, country, state} = data[0];
    getWeatherDetails(name, latitude, longitude, country, state);
    
  }) .catch(() => {
    alert(`Failed to fetch user coordinates.`);
  });
}, error =>{
  if (error.code === error.PERMISSION_DENIED){
    alert('Geolocation permission denied. Please reset location permission to grant access again')
  }
});

}

cityInput.addEventListener('keyup', e=> e.key ==='Enter' && getCityCoordinates());
window.addEventListener('load', getUserCoordinates);