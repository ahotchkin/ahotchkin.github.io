import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();
  const prevPathname = useRef(location.pathname);

  useLayoutEffect(() => {
    const hash = location.hash;
    const currentPathname = location.pathname;
    
    const isPageChange = currentPathname !== prevPathname.current;

    let timeoutId;

    if (hash) {
      const targetElement = document.getElementById(hash.substring(1));
      
      if (targetElement) {
        if (isPageChange) {
          timeoutId = setTimeout(() => {
             targetElement.scrollIntoView({ behavior: 'auto' });
          }, 0);
        } else {
          timeoutId = setTimeout(() => {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }, 100); 
        }
      }  
    } else {
      const scrollBehavior = isPageChange ? 'auto' : 'smooth';

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: scrollBehavior
      });
    }

    prevPathname.current = currentPathname;

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

  }, [location.pathname, location.hash]);

  return null;
}

export default ScrollToTop;