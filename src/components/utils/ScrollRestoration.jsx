import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollRestoration = () => {
  const homePageRoutes = ['/', '/skills', '/projects'];
  const location = useLocation();
  const prevPathname = useRef(location.pathname);

  useLayoutEffect(() => {
    const { hash, pathname: currentPathname } = location;
    const prevPathnameValue = prevPathname.current;

    // Check if the change is *within* the Home group (e.g., /skills to /projects)
    const isInternalHomeTransition =
      currentPathname !== prevPathnameValue &&
      homePageRoutes.includes(currentPathname) &&
      homePageRoutes.includes(prevPathnameValue);

    // Only consider it a 'page change' if moving to/from the Home group (e.g., /blog <> /skills)
    const isPageChange =
      !isInternalHomeTransition && currentPathname !== prevPathnameValue;

    // Determine behavior and delay based on the type of navigation
    const scrollBehavior = isPageChange ? 'auto' : 'smooth';
    const delay = isPageChange ? 0 : 100;

    let timeoutId;

    if (hash) {
      const targetElement = document.getElementById(hash.substring(1));

      if (targetElement) {
        timeoutId = setTimeout(() => {
          targetElement.scrollIntoView({ behavior: scrollBehavior });
        }, delay);
      }
    } else {
      // Route is /, scroll to top of page
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: scrollBehavior,
      });
    }

    prevPathname.current = currentPathname;

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [location.pathname, location.hash, location]);

  return null;
};

export default ScrollRestoration;
