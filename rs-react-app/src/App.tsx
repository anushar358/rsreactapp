import "./App.css";
import ErrorBoundary from "./ErrorBoundary";
import SearchFunctional from "./SearchFunctional";
import { Routes, Route, Link } from "react-router-dom";
import About from "./About";

function App() {
  return (
    <div>
      <nav
        style={{
          padding: "1rem",
          backgroundColor: "#004d40",
          color: "white",
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          fontSize: "1.2rem",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/about" style={{ color: "white", textDecoration: "none" }}>
          About
        </Link>
      </nav>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<SearchFunctional />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
