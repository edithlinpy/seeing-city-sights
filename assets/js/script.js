// create cards
const main = document.querySelector(".main");
console.log(main);
const card = document.createElement("div");
card.classList = "card";

const resultsCard = `
    <img src="./images/London-bridge1.png" alt="" />
    <div class="info">
    <h3 class="place-name"></h3>
    <p class="place-info" id="output"></p>
    <span><a href="index.html">Explore</a></span>
    </div>
`;

let requestOptions = {
  method: "GET",
};

const apiKey = "057aa2c42e8e4730af75e101b91db1a7";
let place = "new york";
console.log("Place: " + place);
let geoQueryURL = "https://api.geoapify.com/v1/geocode/search?text=" + place;

// get placeID from Geocoding API
fetch(geoQueryURL + "&apiKey=" + apiKey, requestOptions)
  .then((groResponse) => groResponse.json())
  .then((geoResult) => {
    console.log(geoResult);
    placeID = geoResult.features[0].properties.place_id;
    console.log("Place ID: " + placeID);

    // get tourist sights from Places API
    let limit = 1;
    let categories = "tourism.sights";
    // let categories = "tourism.attraction";
    let outputString = "";

    fetch(
      "https://api.geoapify.com/v2/places?categories=" +
        categories +
        "&filter=place:" +
        placeID +
        "&limit=" +
        limit +
        "&apiKey=" +
        apiKey,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        result.features.forEach((element) => {
          
          outputString +=
            "Place name: " +
            element.properties.name +
            "<br />Address: " +
            element.properties.address_line2 +
            "</p>";
          $(".place-name").html(outputString);
        });
      })
      .catch((error) => console.log("error", error));
  })
  .catch((error) => console.log("error", error));
