// weather API key
var APIKey = "92c39c28b00faf2a7003a9133027497d";

// HTML elements




var cities = []

var loadcities = function() {
  var citiesLoaded = localStorage.getItem('cities')
  if(!citiesLoaded) {
    return false;
  }
  citiesLoaded = JSON.parse(citiesLoaded);
  
  for (var i = 0; i < citiesLoaded.length; i++) {
    displaySearchCities(citiesLoaded[i])
    cities.push(citiesLoaded)
  }
}

var saveCities = function() {
  localStorage.setItem('cities', JSON.stringify(cities));
}

var displaySearchCities = (city) 

  var cityCardEl = document.createElement('div');
  cityCardEl.setAttribute('class', 'card');
  var cityCardNameEl = document.createElement('div');
  cityCardNameEl.setAttribute('class', 'card-body searched-city');
  cityCardNameEl.textContent = city;

  cityCardEl.appendChild(cityCardNameEl)

  cityCardEl.addEventListener('click', function() {
    getCityData(city)
  });
  searchHistoryEl.appendChild(cityCardEl)



// display current weather conditions

var displayCurrentData = function(city, data) {

  var tempCurrent = Math.round(data.current.temp);
  var humidity = Math.round(data.current.humidity);
  var windSpeed = data.current.windSpeed;
  var iconCurrent = data.current.weather[0].icon;

// date/city HTML tags created
  currentCityContainerEl.textContent = ""
  currentCityContainerEl.setAttribute('class', "m-3 border col-10 text-center")
  var divCityHeader = document.createElement('div');
  var headerCityDate = document. createElement('h2');
  var currentDate = dayjs().format('L');
  headerCityDate.textContent = city + " (" + currentDate + ")";

  divCityHeader.appendChild(headerCityDate)
  divCityHeader.appendChild(imageIcon)
  currentCityContainerEl.appendChild(divCityHeader)

  var divCurrent = document.createElement('div');
  var tempEl = document.createElement('p');
  var humidityEl = document.createElement('p');
  var windSpeedEl = document.createElement('p');
  
// add current weather data

tempEl.textContent = 'Temperature;' + tempCurrent + 'Fahrenheit';
humidityEl.textContent = 'Humidity' + humidity + '%';
windSpeedEl.textContent = 'Wind Speed' + windSpeed + 'MPH';

divCurrent.appendChild(tempEl);
divCurrent.appendChild(humidityEl);
divCurrent.appendChild(windSpeedEl);

currentCityContainerEl.appendChild(divCurrent);

};

// display forecast

var displayForecastData = function(data) {
  console.log(data)
  forecastSectionEl.textContent = "";
  var forecastHeaderEl = document.getElementById('5-day');
  forecastHeaderEl.textContent = "5-Day Forecast"

  // create loop for 5-day forcast

  for (var i=1; i < 6; i++) {
    var tempForcast = Math.round(data.daily[i].temp.day);
    var humidityForecast = data.daily[i].humidity;
    var iconForecast = data.daily[i].weather[0].icon

  // card and data elements

  var cardEl = document.createElement ('div');
  cardEl.setAttribute('class', 'card col-xl-2 col-md-5 col-sm-10 mx-3 my-2 bg-primary text-white text-center')

  var cardBodyEl = document.createElement ('div');
  cardBodyEl.setAttribute('class', 'card-body')

  var cardDateEl = document.createElement ('h5');
  cardDateEl.textContent = dayjs().add(i,'days').format('L');

  var cardTempEl = document.createElement('p');
  cardTempEl.setAttribute('class', 'card-text');
  cardTempEl.textContent = 'Temperature: ' + tempForcast + 'Fahrenheit';

  var cardHumidEl = document.createElement('p');
  cardHumidEl.setAttribute('class', 'card-text');
  cardHumidEl.textContent = 'humidity: ' + humidityForecast + '%';

  // aapend to card body

  cardBodyEl.appendChild(cardDateEl)
  cardBodyEl.appendChild(cardTempEl)
  cardBodyEl.appendChild(cardHumidEl)

  cardEl.appendChild(cardBodyEl);
  forecastSectionEl.appendChild(cardEl);

  formEl.reset()

  }
};

  // make request to url + check if city is valid

var getCityData = function (response) {

  var cityInfoUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={92c39c28b00faf2a7003a9133027497d}'
  

  fetch(cityInfoUrl)
  .then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        console.log(data)
      });
    } else {
      alert('city not found');
    }
  });  
};        

        var cityName = data.name;
        var latitude = data.coord.lat;
        var longgitude = data.coord.lon;


        var prevSearch = cities.includes(cityName)
        if (!prevSearch) {
          cities.push(cityName)
          saveCities()
          displaySearchCities(cityName)
        }
       
        // 5-day forcast API

        var forecastUrl = 'https://api.openweathermap.org/data/2.5/weather?q={cities}&appid={92c39c28b00faf2a7003a9133027497d}';
        
      fetch(forecastUrl)
      .then(function (response) {
        response.json().then(function (data) {
          console.log(data)
      });

          displayCurrentData(city, data);
          displayForecastData(data);
      });
      
      // load prev searched cities

      loadcities()

      // submit listener when city is entered

      formEl.addEventListener ('submit', function() {
        cityInput = inputEl.ariaValueMax.trim();
        getCityData(cityInput);
      })

    
  