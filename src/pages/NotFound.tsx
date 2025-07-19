import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle GitHub Pages SPA routing
    const search = location.search;
    if (search) {
      const params = new URLSearchParams(search);
      const redirect = params.get('/');
      if (redirect) {
        const newPath = redirect.replace(/~and~/g, '&');
        navigate(newPath, { replace: true });
        return;
      }
    }

    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname, location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <button 
          onClick={() => navigate('/')}
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Return to ADIS Home Page
        </button>
      </div>
    </div>
  );
};

export default NotFound;
