//variables for dom
let searchBtn = document.getElementById("search-btn");
let query = document.getElementById("query");
let current = document.getElementById("#current");
let future = document.querySelector("#future");
let city;
let currentDiv = document.querySelector(`#current`);
let searchHistory = [];
let searchBox = document.querySelector("#search-box");
let histBtn = document.querySelector(".hist-btn");

//write a function that gets forcast with onecall api
function getForecast(cityObj) {
  console.log(cityObj);
  console.log(cityObj.coord.lat);
  //capture the name of the city in the global scope
  city = cityObj.name;
  //get the lat and long from the object

  let lat = cityObj.coord.lat;
  let lon = cityObj.coord.lon;
  let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=e749bbe6ab34bd8909b79b8c18bf9be8`;
  fetch(api)
    .then((response) => response.json())
    .then((data) => renderWeather(data));
}

// //write a function showing the weather
// //renderWeather = forecastObj => {
//    // console.log(forecastObj)
//     //create variable where we will put our weather
//     let currentDiv = document.querySelector(`#current`);
//     //create variables for the current weather info that we need
//     forecastObj.forEach(forecastObj => {
//         let characterEl = document.createElement(`p`);
//         characterEl.innerText = `Current Lat: ${temp}`
//         currentDiv.append(characterEl);
//     })

// }

//write a function to render weather
function renderWeather(forecastObj) {
  console.log(forecastObj);
  console.log(city);
  let temp = Math.round(((forecastObj.current.temp - 273.15) * 9) / 5 + 32);
  let uv = forecastObj.current.uvi;
  let wind = forecastObj.current.wind_speed;
  let humidity = forecastObj.current.humidity;
  let icon = forecastObj.current.weather[0].icon;
  let millisecondDate = forecastObj.current.dt * 1000;
  let dateObject = new Date(millisecondDate);
  let readableDate = dateObject.toLocaleString();
  let shortDate = readableDate.split(",");
  console.log(icon);

  //create a template to inject into ui

  let template = `
        <h2>${city} - ${shortDate[0]} <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${forecastObj.current.weather[0].description}"></h2>
        <span>Temp - ${temp}</span> 
        <br>
        <span id="uv-index">uv - ${uv}</span> 
        <br>
        <span> Humidity - ${humidity}%</span>
        <br>
        <span>wind - ${wind}</span> 
    `;
  //use inner html to inject template into the ui
  currentDiv.innerHTML = template;
  let uvEl = document.getElementById("uv-index");
  if (uv <= 2) {
    uvEl.classList.add("uv-low");
  } else if (uv > 2 || uv <= 5) {
    uvEl.classList.add("uv-moderate");
  } else {
    uvEl.classList.add("uv-high");
  }
  //create a var for the days of future forecast
  let futureDays = forecastObj.daily.slice(0, 5);
  future.innerHTML = "";
  //create forloop to loop over all eliments of daily array
  futureDays.forEach((day) => {
    millisecondDate = day.dt * 1000;
    dateObject = new Date(millisecondDate);
    readableDate = dateObject.toLocaleString();
    shortDate = readableDate.split(",");
    temp = Math.round(((day.temp.max - 273.15) * 9) / 5 + 32);
    uv = day.uvi;
    wind = day.wind_speed;
    humidity = day.humidity;
    icon = day.weather[0].icon;
    console.log(shortDate[0], temp, uv, wind, icon);

    //inject var into template
    template = `
    <h4>${shortDate[0]} <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${forecastObj.current.weather[0].description}"></h4>
    <span>Temp - ${temp}</span> 
    <br>
    <span> Humidity - ${humidity}%</span>
    <br>
    <span>wind - ${wind}</span>
    `;
    //Create a new element to stick template inside of

    let card = document.createElement("div");
    card.classList.add("future-day");
    card.innerHTML = template;
    console.log(card);
    future.appendChild(card);
  });
}
//color UV
function colorUV() {
  console.log("coloringUV");
}

//write a function to get city info
function getCity(event) {
  event.preventDefault();
  //capture the value of city from input
  console.log(query.value);
  var displaycity = query.value.trim();
  if (searchHistory.includes(displaycity)) {
    console.log("we already have that city");
  } else {
    searchHistory.push(displaycity);
  }
  localStorage.setItem("search-history", JSON.stringify(searchHistory));
  console.log(searchHistory);
  let apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    displaycity +
    "&units=imperial&appid=e749bbe6ab34bd8909b79b8c18bf9be8";
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => getForecast(data));
}
// write a function to get search history from local storage
function getSearchHistory() {
  var history = localStorage.getItem("search-history");
  if (!history) {
    return;
  }
  searchHistory = JSON.parse(history);
  console.log(searchHistory);
  searchHistory.forEach((city) => {
    // var btn = document.createElement("button");
    var container = document.createElement("div");
    // btn.innerText = city;
    container.innerHTML = `
      <button class="hist-btn">${city}</button>
    `;
    searchBox.appendChild(container);
  });
}

//attach event listener
searchBtn.addEventListener("click", getCity);
getSearchHistory();
