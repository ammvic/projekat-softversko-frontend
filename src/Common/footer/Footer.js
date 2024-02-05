import React from "react"
import "./Footer.css"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <>
      <footer>
        <div className='container grid'>
          <div className='box'>
            <h2>O NAMA</h2>
            <p>Dobrodošli u našu zajednicu putnika! Mi smo strastveni tim posvećen pružanju nezaboravnih iskustava kroz našu platformu za rezervaciju hotela.</p>
            <br />
            <p>Naša priča počinje sa željom da transformišemo način putovanja i pružimo vam ne samo mesto za boravak, već i dom daleko od kuće.</p>
            <div className='icon flex_space'>
            <a href='https://www.facebook.com' target='_blank' rel='noopener noreferrer'>
    <i className='fab fa-facebook-f'></i>
  </a>
  <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
    <i className='fab fa-twitter'></i>
  </a>
  <a href='https://www.linkedin.com' target='_blank' rel='noopener noreferrer'>
    <i className='fab fa-linkedin'></i>
  </a>
  <a href='https://www.instagram.com' target='_blank' rel='noopener noreferrer'>
    <i className='fab fa-instagram'></i>
  </a>
  <a href='https://www.pinterest.com' target='_blank' rel='noopener noreferrer'>
    <i className='fab fa-pinterest'></i>
  </a>
  <a href='https://www.youtube.com' target='_blank' rel='noopener noreferrer'>
    <i className='fab fa-youtube'></i>
  </a>
            </div>
          </div>

          <div className='box'>
            <h2>NAVIGACIJA</h2>
            <ul>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/O-nama'>O nama</Link>
              </li>
              <li>
                <Link to='/Hoteli'>Hoteli</Link>
              </li>
              <li>
                <Link to='/Kontakt'>Kontaktirajte nas</Link>
              </li>
            </ul>
          </div>
      </div>
      </footer>
      <div className='legal'>
        <p>© 2023 Sva prava zadržana.</p>
      </div>
    </>
  )
}

export default Footer
