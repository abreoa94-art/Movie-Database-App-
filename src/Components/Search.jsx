import React from 'react';
import { useNavigate } from 'react-router-dom';

const Search = ({ searchTerm, setSearchTerm }) => {
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();

        if (searchTerm.trim() === "") return;
        navigate(`/movies?search=${encodeURIComponent(searchTerm)}`);
    }
    return (
        <form onSubmit={handleSubmit} className="search">
            <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="  text-white"
            />
        </form>
    );
};

export default Search;