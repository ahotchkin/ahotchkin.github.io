import React, { useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar">
        <HashLink smooth to="/#" className={location.pathname === '/' && !location.hash ? 'home-link current' : 'home-link'}>
          AH
        </HashLink>
        <button className={`hamburger-menu ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          <div className="bar"></div>
        </button>
        <div className="navbar-right">
          <HashLink smooth to="/#skills" className={location.hash === '#skills' ? 'current' : ''} onClick={() => setIsOpen(false)}>
            Skills
          </HashLink>
          <HashLink smooth to="/#projects" className={location.hash === '#projects' ? 'current' : ''} onClick={() => setIsOpen(false)}>
            Projects
          </HashLink>
          <Link to="/blog" className={location.pathname.includes('/blog') ? 'current' : ''} onClick={() => setIsOpen(false)}>
            Blog
          </Link>
        </div>
      </div>
      <div className={`navbar-right ${isOpen ? 'open' : ''}`}>
        <HashLink smooth to="/#skills" className={location.hash === '#skills' ? 'current' : ''} onClick={() => setIsOpen(false)}>
          Skills
        </HashLink>
        <HashLink smooth to="/#projects" className={location.hash === '#projects' ? 'current' : ''} onClick={() => setIsOpen(false)}>
          Projects
        </HashLink>
        <Link to="/blog" className={location.pathname.includes('/blog') ? 'current' : ''} onClick={() => setIsOpen(false)}>
          Blog
        </Link>
      </div>
    </nav>
  )
}

export default NavBar;