const Base_URL = "https://webdev.alphacamp.io/"
const Index_URL = Base_URL + "api/movies/"
const Poster_URL = Base_URL + "/posters/"
let dataPanel = document.querySelector('#data-panel')
let searchForm = document.querySelector('#search-form')
let searchInput = document.querySelector('#search-input')

// 取得收藏電影列表
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))||[]
renderMovieList(movies)
// 取得收藏電影列表
// function getFavoriteMovies (favoriteMovies){
//   favoriteMovies.forEach(function(movie){
//     movies.push(movie)
//   })
//   renderMovieList(movies)
// }
// getFavoriteMovies ( JSON.parse(localStorage.getItem('favoriteMovies')))

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
            <button class="btn btn-secondary btn-remove-favorite" data-id=${item.id}>X</button>
          </div>
        </div>
      </div>
    </div>`
  })
  dataPanel.innerHTML = rawHTML
}


// 監聽取得modal資訊
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

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

// 助教寫的[splice]方法
function removeFromFavorite (id){
  let movieIndex = movies.findIndex(function(movie){
    return movie.id === id
  })
  movies.splice ( movieIndex , 1 )
  localStorage.setItem('favoriteMovies',JSON.stringify(movies))
  renderMovieList(movies)
}


// 我自己寫的[filter]方法
// function removeFromFavorite (id) {
//   //localStorage.removeItem('favoritemovies')

//   let removedMovieList = JSON.parse(localStorage.getItem('favoriteMovies'))||[]
//   removedMovieList = JSON.parse(localStorage.getItem('favoriteMovies')).filter(function(movie){
//     return movie.id !== id
//   })
//   renderMovieList( removedMovieList )
//   localStorage.setItem('favoriteMovies',JSON.stringify(removedMovieList))
  
// }