import { useEffect, useState } from "react";
import {useLocation} from "react-router-dom";
import Search from "../Components/Search.jsx";
import Spinner from "../Components/Spinner.jsx";
import MovieCard from "../Components/MovieCard.jsx";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "../appwrite.js";

import React from 'react'

const API_BASE_URL = "https://api.themoviedb.org/3/";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        authorization: `Bearer ${API_KEY}`,
    },
};


const MainPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const location = useLocation();
    const [visibleCount, setVisibleCount] = useState(6);
    const [sortOption, setSortOption] = useState("default")


    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    const fetchMovies = async (query = "") => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const endpoint = query
                ? `${API_BASE_URL}search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) throw new Error("Could not fetch movies");

            const data = await response.json();

            // ✅ Safely handle empty or malformed responses
            if (!data || !Array.isArray(data.results)) {
                console.warn("Invalid data format:", data);
                setErrorMessage("No movie data available");
                setMovieList([]);
                return;
            }

            setMovieList(data.results);
            setVisibleCount(6);

            // ✅ Only update Appwrite if movies exist
            if (query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            setErrorMessage("Failed to fetch movies");
        } finally {
            setIsLoading(false);
        }
    };

    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();
            if (Array.isArray(movies)) {
                setTrendingMovies(movies);
            } else {
                console.warn("Trending movies response invalid:", movies);
            }
        } catch (error) {
            console.error("Error fetching trending movies:", error);
        }
    };

    const sortedMovies = [...movieList];

    if (sortOption === "year-desc") {
        sortedMovies.sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""));
    }

    if (sortOption === "year-asc") {
        sortedMovies.sort((a, b) => (a.release_date || "").localeCompare(b.release_date || ""));
    }

    if (sortOption === "rating-desc") {
        sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
    }

    if (sortOption === "rating-asc") {
        sortedMovies.sort((a, b) => a.vote_average - b.vote_average);
    }


    useEffect(() => {
        console.log("Appwrite Project ID:", import.meta.env.VITE_APPWRITE_PROJECT_ID);
        console.log("Appwrite Endpoint:", import.meta.env.VITE_APPWRITE_ENDPOINT);
    }, []);

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get("search")

        if (q) {
            setSearchTerm(q);
            setDebouncedSearchTerm(q);
        }

    }, [location.search]);

    return (
        <main className="pt-20">
            <div className="pattern" />
            <div className="wrapper">
                <header>
                    {/* ✅ Use absolute path so Vercel finds the image */}
                    <img src="/hero-img.png" alt="hero banner" />
                    <h1>
                        Find <span className="text-gradient">Movies</span> You'll Enjoy
                        Without the Hassle
                    </h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {Array.isArray(trendingMovies) && trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.$id || index}>
                                    <p>{index + 1}</p>
                                    <img src={movie.poster_url} alt={movie.title} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className="all-movies">
                    <h2>All Movies</h2>

                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <>
                            <div className="flex justify-end mt-4">
                                <select
                                    className="px-3 py-2 bg-gray-800 text-white rounded"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="default">Sort By</option>
                                    <option value="year-desc">Year (Newest → Oldest)</option>
                                    <option value="year-asc">Year (Oldest → Newest)</option>
                                    <option value="rating-desc">Rating (High → Low)</option>
                                    <option value="rating-asc">Rating (Low → High)</option>
                                </select>
                            </div>

                            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {sortedMovies.slice(0, visibleCount).map((movie) => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </ul>
                        </>
                    )}

                    {visibleCount < movieList.length && (
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => setVisibleCount(prev => prev + 6)}
                                className="px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg text-lg transition cursor-pointer"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </section>

            </div>
        </main>
    );



}
export default MainPage
