const html = document.querySelector("html")
const searchBtn = document.querySelector("#searching-box button")
const myAPIKey = "6hL3QGStGy43v6iOg0fN92ZTQCWbcWuGuh0QwyeoC50"
let keyword = document.querySelector("#searching-box input").value
let backgroundImgUrl = ""
let picData = null

searchBtn.addEventListener("click", function(event) {
  console.log("pressed")
  event.preventDefault();
  keyword = document.querySelector("#searching-box input").value;
  console.log(keyword)
  displayImages(keyword, 3)
    .then(() => {
      changeBGImage();
    })
    .catch(error => {
      console.log('Error happened during fetching!', error);
    });
}) 

function displayImages(keyword, page) {
  return axios({
    method: 'get',
    url: `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${myAPIKey}`,
  })
    .then(response => {
      console.log(response)
      picData = response.data.results
      console.log(picData)
      backgroundImgUrl = response.data.results[0].urls.full
    });
}

function changeBGImage() {
  console.log(`url(${backgroundImgUrl})`)
  html.style.backgroundImage = `url(${backgroundImgUrl})`;
}