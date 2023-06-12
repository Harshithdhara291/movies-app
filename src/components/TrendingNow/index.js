/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {Component} from 'react'
// import Slider from 'react-slick'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import MovieCard from '../MovieCard'

import './index.css'

// import '~slick-carousel/slick/slick.css'
// import '~slick-carousel/slick/slick-theme.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// const SamplePrevArrow = props => {
//   const {className, style, onClick} = props
//   return (
//     <div
//       className={className}
//       style={{
//         ...style,
//         display: 'block',
//         backgroundColor: '#181818',
//       }}
//       onClick={onClick}
//     />
//   )
// }

// const SampleNextArrow = props => {
//   const {className, style, onClick} = props
//   return (
//     <div
//       className={className}
//       style={{...style, display: 'block', background: '#181818'}}
//       onClick={onClick}
//     />
//   )
// }

// const settings = {
//   dots: false,
//   infinite: true,
//   prevArrow: <SamplePrevArrow />,
//   nextArrow: <SampleNextArrow />,
//   responsive: [
//     {
//       breakpoint: 1500,
//       settings: {
//         slidesToShow: 4,
//         slidesToScroll: 1,
//         infinite: true,
//         dots: false,
//       },
//     },
//     {
//       breakpoint: 1300,
//       settings: {
//         slidesToShow: 3,
//         slidesToScroll: 1,
//         infinite: true,
//         dots: false,
//       },
//     },
//     {
//       breakpoint: 1024,
//       settings: {
//         slidesToShow: 3,
//         slidesToScroll: 1,
//         infinite: true,
//         dots: false,
//       },
//     },
//     {
//       breakpoint: 600,
//       settings: {
//         slidesToShow: 3,
//         slidesToScroll: 1,
//         initialSlide: 2,
//       },
//     },
//     {
//       breakpoint: 480,
//       settings: {
//         slidesToShow: 3,
//         slidesToScroll: 1,
//       },
//     },
//   ],
// }

class TrendingNowSection extends Component {
  state = {
    moviesList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getMovies()
  }

  getMovies = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/movies-app/trending-movies'
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
        id: movie.id,
      }))
      this.setState({
        moviesList: updatedData,
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
    const {moviesList} = this.state
    return (
      <div className="trending-now-section">
        <div className="movies-list">
          {moviesList.map(movie => (
            <MovieCard movieData={movie} key={movie.id} />
          ))}
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://res.cloudinary.com/di4qjlwyr/image/upload/v1686379733/alert-triangle_vrl8ee.png"
        alt="alert-triangle"
        className="alert-icon"
      />
      <h1>Something went wrong. Please try again</h1>
      <button type="button" className="try-again-button">
        Try Again
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  render() {
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
}

export default TrendingNowSection
