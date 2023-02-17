const historyDiv = $('#history');
const hotelAnchor = $('#hotel-anchor');
const restaurantAnchor = $('#restaurant-anchor');
const extraDiv = $('#extra');
let cityName = ""; // stores user input
let sightsData = [];
let cityList = []; // for showing history buttons

// show error message modal
function showErrorMsg(errorCode, errorMsg) {
  // hide the weather information sections
  // todayEl.css("display", "none");
  // forecastEl.css("display", "none");

  $("#error-code").text("Error: "+errorCode);
  $("#error-msg").text(errorMsg);
  $(".modal").modal({show:true});
  console.log(errorMsg);
  // alert(errorMsg);

}

// calls API and get city sights data
function getCitySights(cityName) {
  let requestOptions = {
      method: 'GET',
    };

  const apiKey = "057aa2c42e8e4730af75e101b91db1a7";
  console.log("City: "+cityName);
  let geoQueryURL = "https://api.geoapify.com/v1/geocode/search?text="+cityName;

  // get placeID from Geocoding API
  fetch(geoQueryURL+"&apiKey="+apiKey, requestOptions)
  .then(groResponse => groResponse.json())
  .then(geoResult => {
    console.log(geoResult);
    placeID = geoResult.features[0].properties.place_id;
    //console.log("Place ID: "+placeID);

    // De-code of Lat & Lon for weather API
    coOrdLon = geoResult.features[0].geometry.coordinates[0];
    //console.log("coOrdLon: "+coOrdLon);

    coOrdLat = geoResult.features[0].geometry.coordinates[1];
    //console.log("coOrdLat: "+coOrdLat);

    // Function for displaying weather info in Side Bar 
    getWeatherLonLat(coOrdLat, coOrdLon);

    // get tourist sights from Places API
    let limit = 20;
    let categories = "tourism.sights";
    // let categories = "tourism.attraction";
    // let outputString = ""; 
    let cityObj = {};

    fetch("https://api.geoapify.com/v2/places?categories="+categories+"&filter=place:"+placeID+"&limit="+limit+"&apiKey="+apiKey, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        result.features.forEach(element => {
          // outputString += "Place name: "+element.properties.name+"<br />Address: "+element.properties.address_line2+"</p>";
          // $("#output").html(outputString);
          cityObj = {};
          if (element.properties.name !== undefined  && element.properties.address_line2 !== undefined) {
            cityObj.name = element.properties.name;
            cityObj.address = element.properties.address_line2;
            sightsData.push(cityObj);
          }
        });
      })
      .catch(error => showErrorMsg("003", "Sorry, city not found."));

      console.log(sightsData);

      if (!cityList.includes(cityName)) {
        cityList.push(cityName);
        historyDiv.append(`<button class="btn btn-primary mb-2 city" data-city="${cityName}"> ${cityName} </button> `);
        localStorage.setItem("cityName", cityList.toString());
      }

      // Set Hotel & Restaurant links
      console.log('Set Hotel & Restaurant links');
      let searchParam = cityName.replace(" ","_");
      hotelAnchor.attr("href", "https://www.hotelscombined.com/Place/"+searchParam+".htm");
      searchParam = cityName.replace(" ","-");
      restaurantAnchor.attr("href", "https://restaurantguru.com/"+searchParam+"#restaurant-list")
      extraDiv.css("display", "block");
      
  })
  .catch(error => showErrorMsg("002", "Sorry, city not found."));
}

function showStoredButtons() {
  let cities = localStorage.getItem("cityName"); 
  if (cities !== null) {
    cityList = cities.split(",");
    // console.log("cityList");
    cityList.forEach(cityName => {
      historyDiv.append(`<button class="btn btn-primary mb-2 city" data-city="${cityName}"> ${cityName} </button> `);
    });
  }
}

// create function to searchPhotos using query from unsplash api ********
function searchPhotos() {
  let clientId = "dWC_QC6wp6Nk4NUsbXyKxr-eG4QH3PrBf100kAiIh6k";
  let query = document.getElementById("search-input").value;
  let url = "https://api.unsplash.com/search/photos/?client_id="+clientId+"&page=1&per_page=1&query="+query;
// make fetch request to the unsplash.api
  fetch(url)
  .then(function (data) {
    return data.json()
  })
  .then(function (data) {
    console.log(data);
    
    const imageUrl = data.results[0].urls.thumb; 
    const imageElement = document.createElement('img');
    const cardImage = document.querySelector(".card-body");
    imageElement.src = imageUrl;
    cardImage.appendChild(imageElement);
    

  })
}
  
// handling the search city action
$("#search-button").on("click", function(event) {
  // Preventing the submit button from trying to submit the form
  event.preventDefault();

    // Here we grab the text from the input box
    cityName = $("#search-input").val().trim();

    if (cityName === "") {
      showErrorMsg("001","Please enter a city name to search.");
      return;
    }

    getCitySights(cityName);
    searchPhotos();
});

historyDiv.on('click', '.city', function (event) { // .city is the class of the button
  event.preventDefault();

  cityName = $(event.target).attr("data-city");
  console.log("City (historyDiv):"+cityName);

  getCitySights(cityName);
});

// show stored city buttons on loading page
showStoredButtons();


// ********* Side Bar - Weather Component **********

//Declared variables linked to html Tags
const cityWeatherName = document.getElementById('city-name');
const weatherId = document.getElementById('weather');


// Function for clearing prevoius Child elements data 
function clearChildDiv (targetDiv) {
  while (targetDiv.firstChild) {
    targetDiv.removeChild(targetDiv.firstChild);
  }
}

function getWeatherLonLat(latitude, lonitude) {

  // Clear All weather details before displaying new city info
  clearChildDiv (cityWeatherName);
  clearChildDiv (weatherId);

  // get Locations weather from OpenWeather API
  fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+latitude+"&lon="+lonitude+"&appid=fc1a788e45551d795ccebca44d61a4ea")
      .then(response => response.json())
      .then(result => {

          // Dynamically creating elements for displaying City, Temp, Wind & Humid
          h3 = document.createElement('H4');
          h3.textContent = result.city.name;
          cityWeatherName.appendChild(h3);

          // Setting Temp to Centigrade
          let tempcalc = (result.list[0].main.temp - 32)*5/9
          
          p = document.createElement('P')
          p.textContent = 'Temp: ' +tempcalc.toFixed(2) +' °C ';
          weatherId.appendChild(p);
      
          p = document.createElement('P')
          p.textContent = 'Wind: '+result.list[0].wind.speed + ' KPH';
          weatherId.appendChild(p);
      
          p = document.createElement('P')
          p.textContent = 'Humidity: '+result.list[0].main.humidity + ' %';
          weatherId.appendChild(p);
    }) 
    .catch(error => showErrorMsg("004", "Sorry, Weather Location not found."))
  }

// Side Bar Continued: - 
// Dynamically creating elements for displaying Links to Hotels & Eateries
h3 = document.createElement('H4')
h3.textContent = 'Hotel Information';
hotels.appendChild(h3);
h3 = document.createElement('H4')
h3.textContent = 'Restaurant Information';
restaurants.appendChild(h3);

// hide the side bar on loading page
extraDiv.css("display", "none");

 