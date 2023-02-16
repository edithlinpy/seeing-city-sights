// create function to searchPhotos using query from unsplash api ********
function searchPhotos() {
    let clientId = "dWC_QC6wp6Nk4NUsbXyKxr-eG4QH3PrBf100kAiIh6k";
    let query = document.getElementById("search-input").value;
    let url = "https://api.unsplash.com/search/photos/?client_id="+clientId+"&query="+query;
  // make fetch request to the unsplash.api
    fetch(url)
    .then(function (data) {
      return data.json()
    })
    .then(function (data) {
      console.log(data[0])
      
      const imageContainer = document.getElementById('card-body0');

    // // Iterate over the array of image objects
    // images.forEach(image => {
    //   const imageCard = document.createElement('div');
    //   imageCard.classList.add('image-card');
      
    //   //Create the img element and set its source
    //   const img = document.createElement('img');
    //   img.src = results.urls.regular[0];
    //   img.alt = image.title;
    //   imageCard.appendChild(img);

   

    //   // Add the image card to the container
    //   imageContainer.appendChild(imageCard);
    });
  // })
  // .catch(error => console.error(error));

 }
