import React, {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import SearchResultsFunctional from "./SearchResultsFunctional";
import "./styles.css";
import { useTheme } from "./ThemeContext";

const SearchFunctional: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [submittedText, setSubmittedText] = useState<string>("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const savedSearch = localStorage.getItem("searchText");
    if (savedSearch) {
      setInputText(savedSearch);
      setSubmittedText(savedSearch);
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setInputText(newValue);
    localStorage.setItem("searchText", newValue);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSubmittedText(inputText);
    console.log("Search submitted:", inputText);
    localStorage.setItem("searchText", inputText);
  };

  return (
    <>
      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>
      <form onSubmit={handleSubmit} className="form">
        <div>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Search"
          />
          <button type="submit">Submit</button>
        </div>
      </form>
      <SearchResultsFunctional submittedText={submittedText} />
    </>
  );
};

export default SearchFunctional;
