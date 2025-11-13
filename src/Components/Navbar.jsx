import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [isDark, setIsDark] = useState(false);
    const [isSmall, setIsSmall] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Fade-in when component loads
    useEffect(() => {
        setTimeout(() => setIsVisible(true), 50);
    }, []);

    // Netflix scroll behavior
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            // Darken background on scroll
            setIsDark(scrollY > 20);

            // Shrink navbar on scroll
            setIsSmall(scrollY > 80);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300 

        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}

        ${isDark ? "bg-black/80 shadow-lg backdrop-blur-md" : "bg-transparent"}

        ${isSmall ? "py-2" : "py-4"}
      `}
        >
            <div className="flex items-center justify-between px-6 font-poppins">
                {/* LOGO */}
                <img
                    src="/reel-finder-logo.svg"
                    className={`transition-all duration-300 
            ${isSmall ? "h-8" : "h-10"}
          `}
                    alt="Reel Finder"
                />

                {/* LINKS */}
                <ul className="flex gap-8 text-white text-lg font-medium">
                    <li>
                        <Link to="/" className="hover:text-blue-500 transition">Home</Link>
                    </li>
                    <li>
                        <Link to="/movies" className="hover:text-blue-500 transition">
                            All Movies
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;

