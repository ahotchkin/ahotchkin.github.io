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
            href="https://github.com/ahotchkin" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Visit my GitHub profile"
          >
            GitHub
          </a>
          <a 
            href="https://www.linkedin.com/in/allyrh/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Visit my LinkedIn profile"
          >
            LinkedIn
          </a>
          <a href="mailto:allyson.hotchkin@gmail.com" aria-label="Send me an email">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;