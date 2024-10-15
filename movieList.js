const Base_URL = "https://webdev.alphacamp.io/"
const Index_URL = Base_URL + "api/movies/"
const Poster_URL = Base_URL + "/posters/"
let dataPanel = document.querySelector('#data-panel')
let searchForm = document.querySelector('#search-form')
let searchInput = document.querySelector('#search-input')
let paginator = document.querySelector('#paginator')

const movies = []
let filteredMovies = []

const MOVIES_PER_PAGE = 12

// 取得封面電影列表和正確分頁數
axios.get(Index_URL)
  .then(response => {
    movies.push(...response.data.results) //展開運算子...
    renderPaginator(movies.length)
    renderMovieList(getMovieByPage(1)) //初始設定先顯示第一頁
  })
  .catch(error => {
    console.log(error)
  })


// 幫電影分頁
function getMovieByPage(page) {
  // page1 : 00 - 11
  // page2 : 12 - 23
  // page3 : 24 - 35

  const startIndex = (page - 1) * MOVIES_PER_PAGE
  const endIndex = startIndex + MOVIES_PER_PAGE // 稍後使用的slice()結尾index不會包含在新陣列中所以不用減1
  const data = filteredMovies.length ? filteredMovies : movies
  return data.slice(startIndex, endIndex)
}


// 渲染正確頁數的paginator
function renderPaginator(movieAmount) {
  numberOfPage = Math.ceil(movieAmount / MOVIES_PER_PAGE) // 7 
  let rawHTML = ''
  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// paginator監聽顯示對應電影
paginator.addEventListener('click', function (event) {
  if (event.target.tagName === 'A') {
    let page = Number(event.target.innerText)
    renderMovieList(getMovieByPage(page))
  }
})


// 渲染電影在畫面上
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
   <div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${Poster_URL + item.image}" class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal"  data-id=${item.id}>More</button>
            <button class="btn btn-info btn-add-favorite" data-id=${item.id}>+</button>
          </div>
        </div>
      </div>
    </div>`
  })
  dataPanel.innerHTML = rawHTML
}


// 監聽取得modal資訊or收藏電影
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// 觸發modal跳出
function showMovieModal(id) {
  const movieTitle = document.querySelector('#movie-modal-title')
  const movieImage = document.querySelector('#movie-modal-image')
  const movieDate = document.querySelector('#movie-modal-date')
  const movieDescription = document.querySelector('#movie-modal-description')

  axios.get(Index_URL + id)
    .then(function (response) {
      let data = response.data.results
      movieTitle.innerText = data.title
      movieImage.innerHTML = `<img src=${Poster_URL + data.image} alt="movie-poster" class="image-fuild"></img>`
      movieDate.innerText = "Release Day : " + data.release_date
      movieDescription.innerText = data.description

    })
    .catch(function (error) {
      console.log(error)
    })
}


// 觸發收藏電影功能
function addToFavorite(id) {
  //這個方法才能確保favoriteMovieList不是null，若為null，後續push會出現錯誤
  const favoriteMovieList = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  //(以下寫法)當localStorage沒有東西時，會返回null，就算前面已經設定空陣列，一樣還是會是null
  //let favoriteMovieList = []
  //favoriteMovieList = JSON.parse(localStorage.getItem('favoriteMovies')) 

  const movie = movies.find(function (movie) {
    return movie.id === id
  })
  if (favoriteMovieList.some(function (data) { return data.id === movie.id })) {
    return alert('此電影已在收藏清單中！')
  }
  favoriteMovieList.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovieList))
  //console.log(favoriteMovieList)
}


// 搜尋bar設定
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()

  const keyWord = searchInput.value.trim().toLowerCase()


  // for of 迴圈用法：
  // for ( let movie of movies ){
  //   if ( movie.title.toLowerCase().trim().includes(keyWord))
  //   filteredMovies.push(movie)
  // }

  // filter 用法：
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().trim().includes(keyWord)
    //沒有中括弧就不用寫return,有中括弧一定要寫return!
  )
  if (filteredMovies.length === 0) {
    return alert(`沒有電影符合關鍵字：${keyWord}`)
  } else {
    console.log(filteredMovies)
    renderPaginator(filteredMovies.length)
    renderMovieList(getMovieByPage(1))
  }
})



