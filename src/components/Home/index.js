/* eslint-disable jsx-a11y/no-static-element-interactions */
// import {Link} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import TrendingNowSection from '../TrendingNow'
import Originals from '../OriginalsSection'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    randomMovie: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getMovie()
  }

  getMovie = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/movies-app/originals'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.results.map(movie => ({
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        id: movie.id,
      }))
      console.log(updatedData)
      this.setState({
        randomMovie: updatedData[Math.floor(Math.random() * 10)],
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderMoviesListView = () => {
    const {randomMovie} = this.state
    return (
      <>
        <div
          className="random-movie-section-desktop"
          style={{
            backgroundImage: `url(${randomMovie.backdropPath})`,
          }}
        >
          <div className="movie-content">
            <h1 className="movie-title">{randomMovie.title}</h1>

            <p className="movie-overview">{randomMovie.overview}</p>
            <button type="button" className="play-button">
              Play
            </button>
          </div>
        </div>
        <div
          className="random-movie-section-mobile"
          style={{
            backgroundImage: `url(${randomMovie.posterPath})`,
          }}
        >
          <div className="movie-content">
            <h1 className="movie-title">{randomMovie.title}</h1>
            <div className="movie-overview-cont-home">
              <p className="movie-overview">{randomMovie.overview}</p>
            </div>
            <button type="button" className="play-button">
              Play
            </button>
          </div>
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://res.cloudinary.com/di4qjlwyr/image/upload/v1686379733/alert-triangle_vrl8ee.png"
        alt="failure view"
        className="alert-icon"
      />
      <h1>Something went wrong. Please try again</h1>
      <button type="button" className="try-again-button">
        Try Again
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container-home">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderViewType() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderMoviesListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-container">
        <div>
          <Header />
          {this.renderViewType()}
        </div>
        <div className="second-container-home">
          <div>
            <h1 className="movies-list-heading">Trending Now</h1>
            <TrendingNowSection />
          </div>
          <div>
            <h1 className="movies-list-heading">Originals</h1>
            <Originals />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home
