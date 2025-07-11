import { Component } from "react";

interface SearchProp {
  submittedText: string;
}

interface SearchState {
  searchResults: { name: string; photoUrls: string[] }[];
  loading: boolean;
  errorMessage: string;
}

class SearchResults extends Component<SearchProp, SearchState> {
  constructor(props: SearchProp) {
    super(props);
    this.state = {
      searchResults: [],
      loading: false,
      errorMessage: "",
    };
  }

  componentDidMount() {
    this.fetchData(this.props.submittedText);
  }

  componentDidUpdate(prevProps: SearchProp) {
    if (prevProps.submittedText !== this.props.submittedText) {
      this.fetchData(this.props.submittedText);
    }
  }

  fetchData = (submittedText: string) => {
    if (!submittedText) return;

    this.setState({ loading: true, errorMessage: "", searchResults: [] });

    const url = `https://petstore3.swagger.io/api/v3/pet/findByTags?tags=${submittedText}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const results = data.map((item) => ({
            name: item.name,
            photoUrls: item.photoUrls,
          }));

          this.setState({
            searchResults: results,
            loading: false,
            errorMessage: "",
          });
        } else {
          this.setState({
            searchResults: [],
            loading: false,
            errorMessage: "No results",
          });
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        this.setState({
          searchResults: [],
          loading: false,
          errorMessage: "Error loading data",
        });
      });
  };

  render() {
    const { loading, errorMessage, searchResults } = this.state;

    return (
      <>
        {loading && <div>Loading...</div>}

        {!loading && errorMessage && <div>{errorMessage}</div>}

        {!loading && !errorMessage && searchResults.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Item Description</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result, index) => (
                <tr key={index}>
                  <td>{result.name}</td>
                  <td>{result.photoUrls.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    );
  }
}

export default SearchResults;
