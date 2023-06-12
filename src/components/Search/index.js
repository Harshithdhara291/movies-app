/* eslint-disable jsx-a11y/no-static-element-interactions */
import {Link} from 'react-router-dom'
import {Component} from 'react'
import {HiOutlineSearch} from 'react-icons/hi'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import MovieCard from '../MovieCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Search extends Component {
  state = {
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    resultMovies: [],
  }

  clickSearchInput = () => {
    this.getResultMovies()
  }

  enterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getResultMovies()
    }
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  getResultMovies = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = fetchedData.results.map(movie => ({
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path,
        id: movie.id,
      }))
      this.setState({
        resultMovies: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderHeader = () => {
    const {searchInput} = this.state
    console.log(searchInput)
    return (
      <nav className="nav-header">
        <div className="nav-bar-large-container">
          <ul className="nav-menu">
            <div className="nav-items">
              <li className="nav-menu-item">
                <Link to="/" className="logo">
                  <img
                    src="https://res.cloudinary.com/di4qjlwyr/image/upload/v1686399906/Group_7399_nfxnz3.png"
                    alt="website logo"
                  />
                </Link>
              </li>
              <li className="nav-menu-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>

              <li className="nav-menu-item">
                <Link to="/popular" className="nav-link">
                  Popular
                </Link>
              </li>
            </div>
            <div className="nav-items">
              <li className="nav-menu-item">
                <Link to="/search" className="nav-link">
                  <div className="search-input-container">
                    <input
                      type="search"
                      className="search-input"
                      value={searchInput}
                      onChange={this.changeSearchInput}
                      onKeyDown={this.enterSearchInput}
                    />
                    <button
                      type="button"
                      className="search-icon"
                      onClick={this.clickSearchInput}
                    >
                      <HiOutlineSearch />
                    </button>
                  </div>
                </Link>
              </li>
              <li className="nav-menu-item">
                <Link to="/account" className="nav-link">
                  <img
                    src="https://res.cloudinary.com/di4qjlwyr/image/upload/v1686379731/Avatar_webfqe.png"
                    alt="profile"
                  />
                </Link>
              </li>
            </div>
          </ul>
        </div>
      </nav>
    )
  }

  renderMoviesListView = () => {
    const {resultMovies, searchInput} = this.state
    const Results = resultMovies.length > 0
    return Results ? (
      <div className="search-section">
        {resultMovies.map(movie => (
          <MovieCard movieData={movie} key={movie.id} />
        ))}
      </div>
    ) : (
      <div className="no-result-search-section">
        <img
          src="https://res.cloudinary.com/di4qjlwyr/image/upload/v1686480269/Group_7394_cks4mg.png"
          alt="Search no results"
        />
        <h1 className="no-result-search-head">
          Your search for {searchInput} did not find any matches.
        </h1>
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
    <div className="loader-container-popular">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderAllMovies = () => {
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
      <div className="search-container">
        <div>{this.renderHeader()}</div>
        {this.renderAllMovies()}
      </div>
    )
  }
}

export default Search
