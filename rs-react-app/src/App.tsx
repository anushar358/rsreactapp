import "./App.css";
import Search from "./Search";
import ErrorBoundary from "./ErrorBoundary";

function App() {
  return (
    <>
      <div>
        <ErrorBoundary>
          <Search />
        </ErrorBoundary>
      </div>
    </>
  );
}

export default App;
