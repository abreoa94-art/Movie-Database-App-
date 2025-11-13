import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import MainPage from "./Pages/MainPage.jsx";
import Navbar from "./Components/Navbar.jsx";  // ← we'll move your existing UI here


const App = () => {
return (
    <Router>
        <Navbar />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<MainPage />} />
        </Routes>
    </Router>
)
        }

export default App;

