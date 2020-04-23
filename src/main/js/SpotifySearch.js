class SpotifySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      query: '',
      artists: [],
      tracks: [],
      hasNext: false,
      hasPrevious: false,
      offset: 0,
      selectedOption: 'artist',
      error: ''
    };
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onSearchFieldChange = this.onSearchFieldChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  /**
   * updates query state variable to be in sync with the search field.
   * @param event - input field change event
   */
  onSearchFieldChange(event) {
    this.setState({query: event.target.value});
  }

  /**
   * Handles clicking of Search, previous, and next buttons. Makes the call to the backend service.
   * @param offset - sets the offset param in ajax call if pressing previous or next button
   */
  onButtonClick(offset) {
    if (this.state.query === "") {
      return this.setState({error: "Please enter query."});
    }
    this.setState({
      artists: [],
      tracks: [],
      error: ''
    });
    fetch(`/search?query=${this.state.query}&type=${this.state.selectedOption}&offset=${offset}`)
    .then(res => res.json())
    .then(
      (result) => {
        if (result.error && result.message) {
          this.setState({error: "Error: " + (result.message)});
        }
        if (result.artists) {
          this.setState({artists: result.artists.items, hasPrevious: result.artists.previous !== null, hasNext: result.artists.next !==null, offset: result.artists.offset});

        }
        if (result.tracks) {
          this.setState({tracks: result.tracks.items, hasPrevious: result.tracks.previous !== null, hasNext: result.tracks.next !==null, offset: result.tracks.offset});
        }
      },
      (error) => {
        this.setState({error: "Error: " + error.message});
      }
    )
  }

  /**
   * Handles selection of radio buttons
   * @param e - input change event
   */
  handleOptionChange(e) {
    this.setState({
      selectedOption: e.target.value
    });
  }
  render() {
    const prevBtn = this.state.hasPrevious ? <button onClick={() => this.onButtonClick(this.state.offset - 20)} className="btn btn-outline-secondary pull-left" type="button" id="button-previous">Previous</button> : null;
    const nextBtn = this.state.hasNext ? <button onClick={() => this.onButtonClick(this.state.offset + 20)} className="btn btn-outline-secondary pull-right" type="button" id="button-next">Next</button> : null;
    return (
      <div className="container jumbotron text-center">
        <h1>Spotify Search</h1>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <input id="artistRadio" value="artist" type="radio" name="searchType" checked={this.state.selectedOption === "artist"} onChange={this.handleOptionChange} aria-label="Radio button for following text input"/>
                Artist
            </div>
          </div>
          <div className="input-group-prepend">
            <div className="input-group-text">
              <input id="trackRadio" checked={this.state.selectedOption === "track"} onChange={this.handleOptionChange} type="radio" value="track" name="searchType" aria-label="Radio button for following text input"/>
                Track
            </div>
          </div>
          <input onChange = {this.onSearchFieldChange} value={this.state.query} type="text" className="form-control" aria-label="search input" aria-describedby="inputGroup-sizing-default"/>
          <div className="input-group-append">
            <button onClick={() => this.onButtonClick(0)} className="btn btn-outline-secondary" type="button" id="button-search">Search</button>
          </div>
        </div>
        <div className={(this.state.error === '' ? 'd-none' : '')}>
          <div className="alert alert-danger " role="alert">
            {this.state.error}
          </div>
        </div>
        <ResultsList artists={this.state.artists} tracks={this.state.tracks}/>
        <div className="row pt-2" ><div className="col">{prevBtn}</div> <div className="col"> {nextBtn}</div></div>
      </div>
    );
  }
}

/**
 * Creates list of results. Takes in array of json data for artists and tracks
 */
class ResultsList extends React.Component {
  
  /**
   * Maps array of json data into JSX
   */
  buildList() {
    if (this.props.artists && this.props.artists.length) {
      return this.props.artists.sort(this.compareItems).map((artist) => {
        return <a key={artist.id} href={artist.external_urls.spotify} className="list-group-item">{artist.name}</a>
      });
    } else if (this.props.tracks && this.props.tracks.length) {
      return this.props.tracks.sort(this.compareItems).map((track) => {
        return <a key={track.id} href={track.external_urls.spotify} className="list-group-item">{track.name} - {track.artists.map(a => a.name).join(", ")}</a>
      });
    }
  }

  /**
   * Compares JSON artist/track objects for alphabetical sorting purposes
   * @param itemA - JSON artist/track object
   * @param itemB - JSON artist/track object
   */
  compareItems(itemA, itemB) {
    if (itemA.name < itemB.name) {
      return -1;
    }
    if (itemA.name > itemB.name) {
      return 1;
    }
    return 0;
  }

  render() {
    return (
      <div className="list-group">
        {this.buildList()}
      </div>
    )
  }
}
let domContainer = document.querySelector('#react');
ReactDOM.render(<SpotifySearch />, domContainer);