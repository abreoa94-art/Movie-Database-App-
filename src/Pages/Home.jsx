import React, { useState } from "react";
import Navbar from "../Components/Navbar.jsx";
import Search from "../Components/Search.jsx";

const Home = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="pt-20">
            <Navbar />

            <main className="pt-20">
                <div className="pattern" />

                <div className="wrapper">
                    <header>
                        <img src="/hero-img.png" alt="hero banner" />

                        <h1>
                            Find <span className="text-gradient">Movies</span> You'll Enjoy
                            Without the Hassle
                        </h1>

                        <Search
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                    </header>
                </div>
            </main>
        </div>
    );
};

export default Home;

