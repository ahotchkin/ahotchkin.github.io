import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import '../styles/navbar.css';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path, hash) => {
    if (path.includes('/projects')) {
      return location.pathname.includes('/projects');
    }
    if (path.includes('/blog')) {
      return location.pathname.includes('/blog');
    }

    return location.pathname === path || location.hash === hash;
  };

  return (
    <nav className="navbar">
      <div className="navbar">
        <Link
          to="/"
          className={
            location.pathname === '/' && !location.hash
              ? 'home-link current'
              : 'home-link'
          }
        >
          AH
        </Link>
        <button
          className={`navbar-hamburger-menu ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="bar"></div>
        </button>

        <div className="navbar-right">
          <Link
            to="/skills#skills"
            className={isActive('/skills', '#skills') ? 'current' : ''}
            onClick={() => setIsOpen(false)}
          >
            Skills
          </Link>
          <Link
            to="/projects#projects"
            className={isActive('/projects', '#projects') ? 'current' : ''}
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
          <Link
            to="/blog"
            className={isActive('/blog') ? 'current' : ''}
            onClick={() => setIsOpen(false)}
          >
            Blog
          </Link>
        </div>
      </div>

      <div className={`navbar-right ${isOpen ? 'open' : ''}`}>
        <Link
          to="/skills#skills"
          className={isActive('/skills', '#skills') ? 'current' : ''}
          onClick={() => setIsOpen(false)}
        >
          Skills
        </Link>
        <Link
          to="/projects#projects"
          className={isActive('/projects', '#projects') ? 'current' : ''}
          onClick={() => setIsOpen(false)}
        >
          Projects
        </Link>
        <Link
          to="/blog"
          className={isActive('/blog') ? 'current' : ''}
          onClick={() => setIsOpen(false)}
        >
          Blog
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
