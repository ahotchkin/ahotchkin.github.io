// import { useState } from 'react';
// import { HashLink } from 'react-router-hash-link';
// import { Link, useLocation } from 'react-router-dom';

// import '../styles/navbar.css';

// const NavBar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();

//   return (
//     <nav className="navbar">
//       <div className="navbar">
//         <HashLink
//           smooth
//           to="/#"
//           className={
//             location.pathname === '/' && !location.hash
//               ? 'home-link current'
//               : 'home-link'
//           }
//         >
//           AH
//         </HashLink>
//         <button
//           className={`navbar-hamburger-menu ${isOpen ? 'open' : ''}`}
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           <div className="bar"></div>
//         </button>
//         <div className="navbar-right">
//           <HashLink
//             smooth
//             to="/#skills"
//             className={location.hash === '#skills' ? 'current' : ''}
//             onClick={() => setIsOpen(false)}
//           >
//             Skills
//           </HashLink>
//           <HashLink
//             smooth
//             to="/#projects"
//             className={location.hash === '#projects' ? 'current' : ''}
//             onClick={() => setIsOpen(false)}
//           >
//             Projects
//           </HashLink>
//           <Link
//             to="/blog"
//             className={location.pathname.includes('/blog') ? 'current' : ''}
//             onClick={() => setIsOpen(false)}
//           >
//             Blog
//           </Link>
//         </div>
//       </div>
//       <div className={`navbar-right ${isOpen ? 'open' : ''}`}>
//         <HashLink
//           smooth
//           to="/#skills"
//           className={location.hash === '#skills' ? 'current' : ''}
//           onClick={() => setIsOpen(false)}
//         >
//           Skills
//         </HashLink>
//         <HashLink
//           smooth
//           to="/#projects"
//           className={location.hash === '#projects' ? 'current' : ''}
//           onClick={() => setIsOpen(false)}
//         >
//           Projects
//         </HashLink>
//         <Link
//           to="/blog"
//           className={location.pathname.includes('/blog') ? 'current' : ''}
//           onClick={() => setIsOpen(false)}
//         >
//           Blog
//         </Link>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;

// **********************************************

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import '../styles/navbar.css';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path, hash) => {
    // Check if the current pathname *includes* the target path OR if the hash matches.
    // This is necessary for nested routes (e.g., /projects/project1).
    if (path.includes('/projects')) {
      return location.pathname.includes('/projects');
    }
    if (path.includes('/blog')) {
      return location.pathname.includes('/blog');
    }

    // For simple, non-nested routes (like /skills) or the root: use direct equality OR hash check.
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
            // Skills: Uses direct equality since it's a non-nested single path
            className={isActive('/skills', '#skills') ? 'current' : ''}
            onClick={() => setIsOpen(false)}
          >
            Skills
          </Link>
          <Link
            to="/projects#projects"
            // Projects: Uses includes() to catch nested routes like /projects/project1
            className={isActive('/projects', '#projects') ? 'current' : ''}
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
          <Link
            to="/blog"
            // Blog: Uses includes() to catch nested routes if applicable
            className={isActive('/blog') ? 'current' : ''}
            onClick={() => setIsOpen(false)}
          >
            Blog
          </Link>
        </div>
      </div>

      {/* MOBILE MENU LINKS (Mirroring desktop logic) */}
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
