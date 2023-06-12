import {FaGoogle, FaInstagram, FaTwitter, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <footer className="footer-container">
    <div className="icons-container">
      <FaGoogle className="icon" />
      <FaTwitter className="icon" />
      <FaInstagram className="icon" />
      <FaYoutube className="icon" />
    </div>
    <h1 className="contact-us-head">Contact Us</h1>
  </footer>
)

export default Footer
