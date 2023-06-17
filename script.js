const html = document.querySelector("html")
const searchBtn = document.querySelector("#searching-box button")
const myAPIKey = "6hL3QGStGy43v6iOg0fN92ZTQCWbcWuGuh0QwyeoC50"
const slidesContainer = document.querySelector(".slides")
let activeIndex = 0;
let keyword = document.querySelector("#searching-box input").value
let backgroundImgUrl = ""
let picData = null


for (let i = 0; i < 10; i++) {
  const slideElem = document.createElement('div')
    slideElem.className = 'slide'

    const imgElem = document.createElement('img')

    if (i === 0) slideElem.setAttribute('data-active', '')

    slideElem.appendChild(imgElem)
    slidesContainer.appendChild(slideElem)
}

const slides = document.querySelectorAll(".slide")

getRandom()
    .then(() => {
      changeBGImage();
      setPaginationPics()
    })
    .catch(error => {
      console.log('Error happened during fetching!', error);
    });

searchBtn.addEventListener("click", function(event) {
  event.preventDefault();
  keyword = document.querySelector("#searching-box input").value
  searchPics(keyword, 3)
    .then(() => {
      changeBGImage();
      setPaginationPics()
    })
    .catch(error => {
      console.log('Error happened during fetching!', error);
    });
}) 

slides.forEach((slide, index) => {
  slide.addEventListener("click", () => {
    currSlide = slides[activeIndex];
    slide.dataset.active = true
    activeIndex = index
    changeBGImage();
    delete currSlide.dataset.active
})
})

function getRandom() {
  return axios({
    method: 'get',
    url: `https://api.unsplash.com/search/photos?page=1&query=cat&client_id=${myAPIKey}`,
  })
    .then(response => {
      picData = response.data.results
      activeIndex = 0;
    });
}

function searchPics(keyword, page) {
  return axios({
    method: 'get',
    url: `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${myAPIKey}`,
  })
    .then(response => {
      picData = response.data.results
      activeIndex = 0;
    });
}

function changeBGImage() {
  backgroundImgUrl = picData[activeIndex].urls.regular;
  html.style.backgroundImage = `url(${backgroundImgUrl})`;
}

// function changePics() {
//   slides.forEach(function(slide, index) {
//     const imgUrl = picData[index].urls.thumb;
//     const imgElement = slide.querySelector("img");
//     imgElement.src = imgUrl;
//   })
// }

function setPaginationPics() {
  picData.forEach(function(pic, index) {
    const imgUrl = pic.urls.thumb;
    const slide = slides[index];
    const imgElement = slide.querySelector("img");
    imgElement.src = imgUrl;
  })
}

