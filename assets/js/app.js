// // create cards
// const main = document.querySelector(".main");

// const card = document.createElement("div");
// // card.classList = "card";

// const resultsCard = `
//     <img src="./images/London-bridge1.png" alt="" />
//     <div class="info">
//     <h3 class="place-name"></h3>
//     <p class="place-info" id="output"></p>
//     <span><a href="index.html">Explore</a></span>
//     </div>
// `;
// card.appendChild(resultsCard);
function searchPhotos() {
    let clientId = "dWC_QC6wp6Nk4NUsbXyKxr-eG4QH3PrBf100kAiIh6k";
    let query = document.getElementById("search").value;
    let url = "https://api.unsplash.com/search/photos/?client_id="+clientId+"&query="+query;
  // make fetch request to the unsplash.api
    fetch(url)
    .then(function (data) {
      return data.json()
    })
    .then(function (data) {
      console.log(data)
  
    })
  }
