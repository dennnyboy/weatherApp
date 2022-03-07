//variables for dom
const searchBtn = document.getElementById("search-btn");
const query = document.getElementById("query");
const current = document.getElementById("#current");
const future = document.querySelector("#future");

//write a function that gets forcast with onecall api
function getForecast(cityObj) {
    console.log(cityObj)
    console.log(cityObj.coord.lat)
    //get the lat and long from the object
    let lat = cityObj.coord.lat;
    let lon = cityObj.coord.lon;
    let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=e749bbe6ab34bd8909b79b8c18bf9be8`
    fetch(api)
        .then(response => response.json())
        .then(data => renderWeather(data));
}

//write a function showing the weather
renderWeather = forecastObj => {
    const currentDiv = document.querySelector(`#current`);
    forecastObj.forEach(forecastObj => { 
        const characterEl = document.createElement(`p`);
        characterEl.innerText = `Current Lat: ${temp}`
        currentDiv.append(characterEl);

    })
        
}

//write a function to render weather
function renderWeather(forecastObj) {
    console.log(forecastObj)
    let temp =  (forecastObj.current.temp - 273.15) * 9/5 + 32;
    console.log(temp)
}



//write a function to get city info
function getCity(event) {
    event.preventDefault();
    //capture the value of city from input
    console.log(query.value)
    var displaycity = query.value.trim()
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + displaycity + "&units=imperial&appid=e749bbe6ab34bd8909b79b8c18bf9be8";
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => getForecast(data));
};

//attach event listener
searchBtn.addEventListener("click", getCity);



