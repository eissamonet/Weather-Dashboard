// weather API key
var APIKey = "92c39c28b00faf2a7003a9133027497d";

// DOM elements to display on page
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city-input");
var cityContainerEl = document.querySelector("#city-container");
var citySearchTerm = document.querySelector("#city-search-term");
var currentWeatherEl = document.querySelector("#current-weather");
var previousCityEl = document.getElementById("#search-container");
var fiveDayEl = document.querySelector("#forecast-cards");
var currentUveEl = document.querySelector("#uv-input");
let singleDayForecastDiv = document.querySelector("#single_day_forecast")

var cityArray = [];

// search city form submission
var formSubmitHandler = function (event) {
    event.preventDefault();
    // get value from input element
    var city = cityInputEl.value.trim();

    if (city) {
        getCityWeather(city);
        getForecast(city);
        cityArray.push(city);
        localStorage.setItem("city", JSON.stringify(cityArray));
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name");
    }
};

// click on prev searched city
var clickHandler = function (event) {
  var clickCity = event.currentTarget.textContent;
  getCityWeather(clickCity);
  getForecast(clickCity);
};

function displayCurrentWeather(data, city){
  // console.log(data);
  // console.log(data.main.temp);
  singleDayForecastDiv.innerHTML = ""
  // console.log(city);
  let cityDiv = document.createElement("div")
  let cityNameParagraph = document.createElement("p")
  cityNameParagraph.innerHTML = city
  cityDiv.appendChild(cityNameParagraph)
  singleDayForecastDiv.appendChild(cityDiv)

  let tempParagraph = document.createElement("p")
  let tempSpanEl = document.createElement("span")
  tempSpanEl.innerHTML = data.main.temp
  tempParagraph.innerHTML = `Temperature: `
  tempParagraph.appendChild(tempSpanEl)
  singleDayForecastDiv.appendChild(tempParagraph)

  let humidityParagraph = document.createElement("p")
  let humiditySpanEl = document.createElement("span")
  humiditySpanEl.innerHTML = data.main.humidity
  humidityParagraph.innerHTML= 'Humidity: '
  humidityParagraph.appendChild(humiditySpanEl)
  singleDayForecastDiv.appendChild(humidityParagraph)
}
// request Current Weather API
var getCityWeather = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    // if response is ok, then convert to json
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayCurrentWeather(data, city);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
};

// request UV index API
var searchCityUV = function (lat, lon, city) {
    var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + city + lat + "&lon=" + lon + "&appid=" + APIKey;
    // if response is ok, then convert to json
    fetch(uvUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (lat, lon, city) {
                    displayCurrentUv(lat, lon, city);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
};

// display current weather
var displayCityWeather = function (city, searchTerm) {
    // clear old content
    cityContainerEl.textContent = "";
    citySearchTerm.textContent = searchTerm;

    var displayCurrentDate = document.querySelector("#current-date");
    var currentDate = moment().format("MM/DD/YYYY");
    displayCurrentDate.textContent = currentDate;

    // weather icon
    var displayIcon = document.querySelector("#city-current-icon");
    var currentIcon = "https://openweathermap.org/img/w/" + city.weather[0].icon + ".png";
    displayIcon.setAttribute("src", currentIcon);

    // temperature
    var displayTemp = document.querySelector("#temp-input");
    var currentTemp = Math.round(city.main.temp) + "°F";
    displayTemp.textContent = currentTemp;

    // humidity
    var displayHumidity = document.querySelector("#humidity-input");
    var currentHumidity = city.main.humidity + "%";
    displayHumidity.textContent = currentHumidity;

    // wind speed
    var displayWind = document.querySelector("#wind-input");
    var currentWind = Math.round(city.wind.speed) + "MPH";
    displayWind.textContent = currentWind;

    // display list items
    var newCityEl = document.createElement("li");
    newCityEl.className = "list-group-item";
    newCityEl.textContent = searchTerm;
    newCityEl.addEventListener("click", clickHandler);
    previousCityEl.appendChild(newCityEl);

    // get UV index
    var lat = city.coord.lat;
    var lon = city.coord.lon;

    searchCityUV(lat, lon, city);
};

// display UV index
var displayCurrentUv = function (lat, lon, city) {
  var uv = data.value;
  if (uv >= 6) {
    currentUveEl.classList.add("bg-danger");
  }
  else if (uv >= 3) {
    currentUveEl.classList.add("bg-warning");
  }
  else {
    currentUveEl.classList.add("bg-success");
  }
};

// request 5 day forecast API
var getForecast = function (city) {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;
    // if response is ok, then convert to json
    fetch(forecastURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayForecast(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
};

// display 5 day forecast
var displayForecast = function (list) {
  // console.log(list);
    for (var i = 0; i < list.length; i++) {
    // date
    var displayDate1 = document.querySelector("#date-0");
    var forecastDate1 = moment().add(1, "days").format("MM/DD/YYYY");
    displayDate1.textContent = forecastDate1;

    var displayDate2 = document.querySelector("#date-1");
    var forecastDate2 = moment().add(2, "days").format("MM/DD/YYYY");
    displayDate2.textContent = forecastDate2;

    var displayDate3 = document.querySelector("#date-2");
    var forecastDate3 = moment().add(3, "days").format("MM/DD/YYYY");
    displayDate3.textContent = forecastDate3;

    var displayDate4 = document.querySelector("#date-3");
    var forecastDate4 = moment().add(4, "days").format("MM/DD/YYYY");
    displayDate4.textContent = forecastDate4;

    var displayDate5 = document.querySelector("#date-4");
    var forecastDate5 = moment().add(5, "days").format("MM/DD/YYYY");
    displayDate5.textContent = forecastDate5;

    // temperature
    var displayTemp = document.querySelector(`#temp-${i}`);
    var forecastTemp = Math.round(list[i].main.temp) + "°F";
    displayTemp.textContent = forecastTemp;

    // humidity
    var displayHumidity = document.querySelector(`#humidity-${i}`);
    var forecastHumidity = list[i].main.humidity + "%";
    displayHumidity.textContent = forecastHumidity;

    // weather icon
    var displayIcon1 = document.querySelector("#city-icon-1");
    var currentIcon1 = "https://openweathermap.org/img/w/" + list[1].weather[0].icon + ".png";
    displayIcon1.setAttribute("src", currentIcon1);

    var displayIcon2 = document.querySelector("#city-icon-2");
    var currentIcon2 = "https://openweathermap.org/img/w/" + list[2].weather[0].icon + ".png";
    displayIcon2.setAttribute("src", currentIcon2);

    var displayIcon3 = document.querySelector("#city-icon-3");
    var currentIcon3 = "https://openweathermap.org/img/w/" + list[3].weather[0].icon + ".png";
    displayIcon3.setAttribute("src", currentIcon3);

    var displayIcon4 = document.querySelector("#city-icon-4");
    var currentIcon4 = "https://openweathermap.org/img/w/" + list[4].weather[0].icon + ".png";
    displayIcon4.setAttribute("src", currentIcon4);

    var displayIcon5 = document.querySelector("#city-icon-5");
    var currentIcon5 = "https://openweathermap.org/img/w/" + list[5].weather[0].icon + ".png";
    displayIcon5.setAttribute("src", currentIcon5);
  }
};

// search button
userFormEl.addEventListener("submit", formSubmitHandler);
    
    

