const historyDiv = $('#history');
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
    console.log("Place ID: "+placeID);

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
        historyDiv.append(`<button class="btn-info mb-2 city" data-city="${cityName}"> ${cityName} </button> `);
        localStorage.setItem("cityName", cityList.toString());
       }

  })
  .catch(error => showErrorMsg("002", "Sorry, city not found."));
}

function showStoredButtons() {
  let cities = localStorage.getItem("cityName"); 
  if (cities !== null) {
    cityList = cities.split(",");
    // console.log("cityList");
    cityList.forEach(cityName => {
      historyDiv.append(`<button class="btn-info mb-2 city" data-city="${cityName}"> ${cityName} </button> `);
    });
  }
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

});

historyDiv.on('click', '.city', function (event) { // .city is the class of the button
  event.preventDefault();

  cityName = $(event.target).attr("data-city");
  // console.log("City:"+cityName);

  // forcastData = []; // init forcastData array
  getCitySights(cityName);
});

// show stored city buttons on loading page
// showStoredButtons();
getCitySights("London");