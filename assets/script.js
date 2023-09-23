// weather API key
var APIKey = "92c39c28b00faf2a7003a9133027497d";
var cities = []

// HTML elements

var cityFormEl = document.querySelector('#city-search-form');
var cityInputEl = document.querySelector('#city');
var citySearchInputEl = document.querySelector('#searched-city');
var currentWeatherEl = document.querySelector('#current-weather-container');
var fiveDayForecastEl = document.querySelector('#5-day-forecast');
var forecastTitle = document.querySelector('#forecast');
var pastSearchButtonEl = document.querySelector('#past-search-buttons');

var formSunmitHandler = function(event) {
  event.preventDefault();
  var city = cityInputEl.value.trim();
  if(city) {
    getCityData(city);
    cityInputEl.value = '';
  } else {
    alert('Please enter a city name');
  }
  saveSearch();
  pastSearch(city);
};

var saveSearch = function() {
  localStorage.setItem('cities', JSON.stringify(cities));
};

var getCityData = function(city) {
  var apiKey = '92c39c28b00faf2a7003a9133027497d';
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q={cities}&appid={92c39c28b00faf2a7003a9133027497d}';

  fetch(apiUrl)
  .then(function(response) {
    response.json().then(function(data) {
      displayWeather(data, city);
    });
  });
};

var displayWeather = function(weather, searchCity) {
  // clear old content
  currentWeatherEl.textContent = '';
  citySearchInputEl.textContent = searchCity;

  // create date element
  var currentDate = document.createElement('span')
  currentDate.textContent = ' (' + moment(weather.dt.value).format('MMM D, YYYY') + ') ';
  citySearchInputEl.appendChild(currentDate);

  // create an image element
  var weatherIcon = document.createElement('img');
  weatherIcon.setAttribute('src', 'https://openweathermap.org/img/w/' + weather.weather[0].icon + '.png');
  citySearchInputEl.appendChild(weatherIcon);

  // create a span element to hold temperature data
  var temperatureEl = document.createElement('span');
  temperatureEl.textContent = 'Temperature: ' + weather.main.temp + ' °F';
  temperatureEl.classList = 'list-group-item'

  // create a span element to hold Humidity data
  var humidityEl = document.createElement('span');
  humidityEl.textContent = 'Humidity: ' + weather.main.humidity + ' %';
  humidityEl.classList = 'list-group-item'

  // create a span element to hold Wind data
  var windSpeedEl = document.createElement('span');
  windSpeedEl.textContent = 'Wind Speed: ' + weather.wind.speed + ' MPH';
  windSpeedEl.classList = 'list-group-item'

  // append to container
  currentWeatherEl.appendChild(temperatureEl);

  // append to container
  currentWeatherEl.appendChild(humidityEl);

  // append to container
  currentWeatherEl.appendChild(windSpeedEl);

  var lat = weather.coord.lat;
  var lon = weather.coord.lon;
  getUvIndex(lat, lon)
}

var getUvIndex = function(lat, lon) {
  var apiKey = '92c39c28b00faf2a7003a9133027497d';
  var apiUrl = 'https://api.openweathermap.org/data/2.5/uvi?appid={92c39c28b00faf2a7003a9133027497d}&lat={lat}&lon={lon}';

  fetch(apiUrl)
  .then(function(response) {
    response.json().then(function(data) {
      displayUvIndex(data)
    });
  });
}

var displayUvIndex = function(index) {
  var uvIndexEl = document.createElement('div');
  uvIndexEl.textContent = 'UV Index: '
  uvIndexEl.classList = 'list-group-item'

  uvIndexValue = document.createElement('span')
  uvIndexValue.textContent = index.value

  if(index.value <= 2) {
    uvIndexValue.classList = 'favorable'
  } else if (index.value > 2 && index.value <= 8) {
    uvIndexValue.classList = 'moderate '
  }
  else if (index.value > 8) {
    uvIndexValue.classList = 'severe'
  };

  uvIndexEl.appendChild(uvIndexValue);

  // append index to current weather
  currentWeatherEl.appendChild(uvIndexEl);
}

var getForecast = function(city) {
  var apiKey = '92c39c28b00faf2a7003a9133027497d';
  var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={92c39c28b00faf2a7003a9133027497d}';

  fetch(apiUrl)
  .then(function(response) {
    response.json().then(function(data) {
      displayForecast(data);
    });
  });
};

var displayForecast = function(weather) {
  fiveDayForecastEl.textContent = ''
  forecastTitle.textContent = '5-Day Forecast:';

  var forecast = weather.list;
        for(var i = 5; i < forecast.length; i = i + 8) {
          var dailyForecast = forecast[i];

          var forecastEl = document.createElement('div');
          forecastEl.classList = 'card bg-primary text-light m-2';

          //console.log(dailyForecast)

          // create date element
          var forecastDate = document.createElement('h5')
          forecastDate.textContent = moment.unix(dailyForecast.dt).format('MMM D, YYYY');
          forecastDate.classList = 'card-header text-center'
          forecastEl.appendChild(forecastDate);

          // create an image element
          var weatherIcon = document.createElement('img');
          weatherIcon.classList = 'card-body text-center';
          weatherIcon.setAttribute('src', 'https://openweathermap.org/img/w/' + dailyForecast.weather[0].icon + '.png');

          // append to forecast card
          forecastEl.appendChild(weatherIcon);

          // create temperature span
          var forecastTempEl = document.createElement('span');
          forecastTempEl.classList = 'card-body text-center';
          forecastTempEl.textContent = dailyForecast.main.temp + ' °F';

          // append to forecast card
          forecastEl.appendChild(forecastTempEl);

          var forecastHumEl = document.createElement('span');
          forecastHumEl.classList = 'card-body text-center';
          forecastHumEl.textContent = dailyForecast.main.humidity + '  %';

          // append to forecast card
          forecastEl.appendChild(forecastHumEl);
              console.log(forecastEl);
          // append to five day container
          fiveDayForecastEl.appendChild(forecastEl);
        }
      }
    var pastSearch = function(pastSearch) {

      pastSearchEl = document.createElement('button');
      pastSearchEl.textContent = pastSearch;
      pastSearchEl.classList = 'd-flex w-100 btn-light border p-2';
      pastSearchEl.setAttribute('data-city',pastSearch)
      pastSearchEl.setAttribute('type', 'submit');

      pastSearchButtonEl.prepend(pastSearchEl);
    }

    var pastSearchHandler = function(event) {
      var city = event.target.getAttribute('data-city')
      if(city) {
        getCityData(city);
        getForecast(city);
      }
    }

    cityFormEl.addEventListener('submit', formSunmitHandler);
    pastSearchButtonEl.addEventListener('click', pastSearchHandler);
