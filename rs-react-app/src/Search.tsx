import { Component, type FormEvent, type ChangeEvent } from "react";
import SearchResults from "./SearchResults";
import "./styles.css";
interface SearchState {
  inputText: string;
  submittedText: string;
}

class Search extends Component<unknown, SearchState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      inputText: "",
      submittedText: "",
    };
  }
  componentDidMount() {
    const savedsearch = localStorage.getItem("searchText");
    if (savedsearch) {
      this.setState({ inputText: savedsearch, submittedText: savedsearch });
    }
  }
  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    this.setState({ inputText: newValue });
    localStorage.setItem("searchText", newValue);
  };

  handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ submittedText: this.state.inputText });
    console.log("Search submitted:", this.state.submittedText);
    localStorage.setItem("serchText", this.state.inputText);
  };

  render() {
    return (
      <>
        <form onSubmit={this.handleSubmit} className="form">
          <div>
            <input
              type="text"
              value={this.state.inputText}
              onChange={this.handleInputChange}
              placeholder="Search"
            />
            <button type="submit">Submit</button>
          </div>
        </form>
        <SearchResults submittedText={this.state.submittedText} />
      </>
    );
  }
}

export default Search;
