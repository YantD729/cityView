const html = document.querySelector("html")
const searchBtn = document.querySelector("#searching-box button")
const myAPIKey = "6hL3QGStGy43v6iOg0fN92ZTQCWbcWuGuh0QwyeoC50"
const slidesContainer = document.querySelector(".slides")
const buttons = document.querySelectorAll("[data-carousel-button]")
const searchBar = document.querySelector('#searching-box input')
const historyContainer = document.querySelector("#search-history")
let keyword = searchBar.value
let activeIndex = 0, picData = null, currPageUrl = null, backgroundImgUrl = ""
    maxPageNum = 0

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
      changeBGImage()
      setPaginationPics()
    })
    .catch(error => {
      console.log('Error happened during fetching!', error)
    })

searchBtn.addEventListener("click", function(event) {
  event.preventDefault()
  keyword = document.querySelector("#searching-box input").value
  updateSearchHistory(keyword)
  searchPics(keyword, 1)
    .then(() => {
      changeBGImage()
      setPaginationPics()
    })
    .catch(error => {
      console.log('Error happened during fetching!', error)
    })
}) 

slides.forEach((slide, index) => {
  slide.addEventListener("click", () => {
    prevSlide = slides[activeIndex]
    delete prevSlide.dataset.active
    slide.dataset.active = true
    activeIndex = index
    changeBGImage()
  })
})

buttons.forEach(button => {
  button.addEventListener("click", () => {
      delete slides[activeIndex].dataset.active
      let currPageIdx = extractPageFromLink(currPageUrl) 
      const offset = (button.dataset.carouselButton === 'next') ? 1 : -1
      currPageIdx += offset
      if (currPageIdx < 0) {
        currPageIdx = maxPageNum 
      }
      console.log(currPageIdx)
      if (currPageIdx > maxPageNum) currPageIdx = 0
      console.log(maxPageNum)
      refreshPics(currPageIdx)
  })
})

function extractPageFromLink(link) {
  const regex = /[?&]page=(\d+)/
  const match = regex.exec(link)
  if (match) {
    return parseInt(match[1])
  }
  return null
}

function extractLink(links, rel) {
  const regex = new RegExp(`<([^>]+)>;\\s*rel="${rel}"`, "i");
  const match = regex.exec(links);
  if (match) {
    return match[1];
  }
  return null;
}

function getRandom() {
  return searchPics("cat", "1")
}

function searchPics(keyword, page) {
  return axios({
    method: 'get',
    url: `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${myAPIKey}`,
  })
    .then(response => {
      const links = response.headers.link
      maxPageNum = extractPageFromLink(extractLink(links, "last"))
      currPageUrl = response.config.url
      picData = response.data.results
      activeIndex = 0
    })
}

function refreshPics(newPageIdx) {
  currPageUrl = changePageInLink(currPageUrl, newPageIdx)
  return axios({
    method: 'get',
    url: currPageUrl,
  })
    .then(response => {
      activeIndex = 0
      picData = response.data.results
      changeBGImage()
      setPaginationPics()
    })
}

function changeBGImage() {
  backgroundImgUrl = picData[activeIndex].urls.regular
  html.style.backgroundImage = `url(${backgroundImgUrl})`
}

function setPaginationPics() {
  picData.forEach(function(pic, index) {
    const imgUrl = pic.urls.thumb
    const slide = slides[index]
    const imgElement = slide.querySelector("img")
    imgElement.src = imgUrl
  })
}

function changePageInLink(link, newPage) {
  const regex = /(&|\?)page=\d+/
  return link.replace(regex, `$1page=${newPage}`)
}

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []

searchBar.addEventListener('input', (e) => {
  const filteredHistory = searchHistory.filter(keyword => keyword.includes(e.target.value))
  historyContainer.innerHTML = ''
  filteredHistory.forEach((keyword) => {
    const li = document.createElement('li')
    li.textContent = keyword
    li.addEventListener('click', function() {
      console.log("get into bar autofill")
      searchBar.value = this.textContent
      historyContainer.style.display = 'none'
    })
    historyContainer.appendChild(li)
  })
})

searchBar.addEventListener('click', () => {
  displaySearchHistory()
})

function updateSearchHistory(keyword) {
  if (!searchHistory.includes(keyword)) {
    searchHistory.push(keyword)
    if (searchHistory.length > 10) {
      searchHistory.shift()
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
  }
}

function displaySearchHistory() {
  const historyContainer = document.querySelector("#search-history")
  historyContainer.innerHTML = ''

  searchHistory.forEach((keyword) => {
    const li = document.createElement('li')
    li.textContent = keyword
    li.addEventListener('click', function() {
      console.log("get into bar autofill")
      searchBar.value = this.textContent
      // historyContainer.style.display = 'none'
    })
    historyContainer.appendChild(li)
  })
}
