import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function LockNavigation() {
  const location = useLocation();

  useEffect(() => {
    // Push the current state to prevent immediate back navigation
    window.history.pushState(null, document.title, window.location.href);

    const handlePopState = (event) => {
      // Re-push the current state if a back navigation is attempted
      window.history.pushState(null, document.title, window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location]); // Re-run effect if location changes

  return (
    <div>
      {/* Your component content */}
    </div>
  );
}

export default LockNavigation;