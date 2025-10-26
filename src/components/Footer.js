import { FaGithub, FaLinkedin, FaCode } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

import '../styles/footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p className="footer-copyright">
          © {new Date().getFullYear()} Allyson Hotchkin. All rights reserved.
        </p>
        <div className="footer-links">
          <a
            href="https://www.linkedin.com/in/allyrh/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit my LinkedIn profile"
          >
            <FaLinkedin size={25} />
          </a>
          <a
            href="https://github.com/ahotchkin"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit my GitHub profile"
          >
            <FaGithub size={25} />
          </a>
          <a
            href="mailto:contact@allysonhotchkin.com"
            aria-label="Send me an email"
          >
            <MdEmail size={25} />
          </a>
          <a
            href="https://github.com/ahotchkin/ahotchkin.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View the source code for this portfolio site"
          >
            <FaCode size={25} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
