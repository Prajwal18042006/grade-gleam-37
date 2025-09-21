import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-cyan-900/30 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-cyan-400/20"></div>
      
      <div className="text-center relative z-10 animate-fade-in hover-scale">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-8 shadow-2xl">
          <h1 className="mb-4 text-6xl font-bold text-white drop-shadow-lg">404</h1>
          <p className="mb-6 text-xl text-gray-200 drop-shadow-md">Oops! Page not found</p>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg font-semibold drop-shadow-lg transition-all duration-300 hover:scale-105"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
