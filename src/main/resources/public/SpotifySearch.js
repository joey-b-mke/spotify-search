var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SpotifySearch = function (_React$Component) {
  _inherits(SpotifySearch, _React$Component);

  function SpotifySearch(props) {
    _classCallCheck(this, SpotifySearch);

    var _this = _possibleConstructorReturn(this, (SpotifySearch.__proto__ || Object.getPrototypeOf(SpotifySearch)).call(this, props));

    _this.state = {
      query: '',
      artists: [],
      tracks: [],
      hasNext: false,
      hasPrevious: false,
      offset: 0,
      selectedOption: 'artist',
      error: ''
    };
    _this.onButtonClick = _this.onButtonClick.bind(_this);
    _this.onSearchFieldChange = _this.onSearchFieldChange.bind(_this);
    _this.handleOptionChange = _this.handleOptionChange.bind(_this);
    return _this;
  }

  /**
   * updates query state variable to be in sync with the search field.
   * @param event - input field change event
   */


  _createClass(SpotifySearch, [{
    key: 'onSearchFieldChange',
    value: function onSearchFieldChange(event) {
      this.setState({ query: event.target.value });
    }

    /**
     * Handles clicking of Search, previous, and next buttons. Makes the call to the backend service.
     * @param offset - sets the offset param in ajax call if pressing previous or next button
     */

  }, {
    key: 'onButtonClick',
    value: function onButtonClick(offset) {
      var _this2 = this;

      if (this.state.query === "") {
        return this.setState({ error: "Please enter query." });
      }
      this.setState({
        artists: [],
        tracks: [],
        error: ''
      });
      fetch('/search?query=' + this.state.query + '&type=' + this.state.selectedOption + '&offset=' + offset).then(function (res) {
        return res.json();
      }).then(function (result) {
        if (result.error && result.message) {
          _this2.setState({ error: "Error: " + result.message });
        }
        if (result.artists) {
          _this2.setState({ artists: result.artists.items, hasPrevious: result.artists.previous !== null, hasNext: result.artists.next !== null, offset: result.artists.offset });
        }
        if (result.tracks) {
          _this2.setState({ tracks: result.tracks.items, hasPrevious: result.tracks.previous !== null, hasNext: result.tracks.next !== null, offset: result.tracks.offset });
        }
      }, function (error) {
        _this2.setState({ error: "Error: " + error.message });
      });
    }

    /**
     * Handles selection of radio buttons
     * @param e - input change event
     */

  }, {
    key: 'handleOptionChange',
    value: function handleOptionChange(e) {
      this.setState({
        selectedOption: e.target.value
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var prevBtn = this.state.hasPrevious ? React.createElement(
        'button',
        { onClick: function onClick() {
            return _this3.onButtonClick(_this3.state.offset - 20);
          }, className: 'btn btn-outline-secondary pull-left', type: 'button', id: 'button-previous' },
        'Previous'
      ) : null;
      var nextBtn = this.state.hasNext ? React.createElement(
        'button',
        { onClick: function onClick() {
            return _this3.onButtonClick(_this3.state.offset + 20);
          }, className: 'btn btn-outline-secondary pull-right', type: 'button', id: 'button-next' },
        'Next'
      ) : null;
      return React.createElement(
        'div',
        { className: 'container jumbotron text-center' },
        React.createElement(
          'h1',
          null,
          'Spotify Search'
        ),
        React.createElement(
          'div',
          { className: 'input-group mb-3' },
          React.createElement(
            'div',
            { className: 'input-group-prepend' },
            React.createElement(
              'div',
              { className: 'input-group-text' },
              React.createElement('input', { id: 'artistRadio', value: 'artist', type: 'radio', name: 'searchType', checked: this.state.selectedOption === "artist", onChange: this.handleOptionChange, 'aria-label': 'Radio button for following text input' }),
              'Artist'
            )
          ),
          React.createElement(
            'div',
            { className: 'input-group-prepend' },
            React.createElement(
              'div',
              { className: 'input-group-text' },
              React.createElement('input', { id: 'trackRadio', checked: this.state.selectedOption === "track", onChange: this.handleOptionChange, type: 'radio', value: 'track', name: 'searchType', 'aria-label': 'Radio button for following text input' }),
              'Track'
            )
          ),
          React.createElement('input', { onChange: this.onSearchFieldChange, value: this.state.query, type: 'text', className: 'form-control', 'aria-label': 'search input', 'aria-describedby': 'inputGroup-sizing-default' }),
          React.createElement(
            'div',
            { className: 'input-group-append' },
            React.createElement(
              'button',
              { onClick: function onClick() {
                  return _this3.onButtonClick(0);
                }, className: 'btn btn-outline-secondary', type: 'button', id: 'button-search' },
              'Search'
            )
          )
        ),
        React.createElement(
          'div',
          { className: this.state.error === '' ? 'd-none' : '' },
          React.createElement(
            'div',
            { className: 'alert alert-danger ', role: 'alert' },
            this.state.error
          )
        ),
        React.createElement(ResultsList, { artists: this.state.artists, tracks: this.state.tracks }),
        React.createElement(
          'div',
          { className: 'row pt-2' },
          React.createElement(
            'div',
            { className: 'col' },
            prevBtn
          ),
          ' ',
          React.createElement(
            'div',
            { className: 'col' },
            ' ',
            nextBtn
          )
        )
      );
    }
  }]);

  return SpotifySearch;
}(React.Component);

/**
 * Creates list of results. Takes in array of json data for artists and tracks
 */


var ResultsList = function (_React$Component2) {
  _inherits(ResultsList, _React$Component2);

  function ResultsList() {
    _classCallCheck(this, ResultsList);

    return _possibleConstructorReturn(this, (ResultsList.__proto__ || Object.getPrototypeOf(ResultsList)).apply(this, arguments));
  }

  _createClass(ResultsList, [{
    key: 'buildList',


    /**
     * Maps array of json data into JSX
     */
    value: function buildList() {
      if (this.props.artists && this.props.artists.length) {
        return this.props.artists.sort(this.compareItems).map(function (artist) {
          return React.createElement(
            'a',
            { key: artist.id, href: artist.external_urls.spotify, className: 'list-group-item' },
            artist.name
          );
        });
      } else if (this.props.tracks && this.props.tracks.length) {
        return this.props.tracks.sort(this.compareItems).map(function (track) {
          return React.createElement(
            'a',
            { key: track.id, href: track.external_urls.spotify, className: 'list-group-item' },
            track.name,
            ' - ',
            track.artists.map(function (a) {
              return a.name;
            }).join(", ")
          );
        });
      }
    }

    /**
     * Compares JSON artist/track objects for alphabetical sorting purposes
     * @param itemA - JSON artist/track object
     * @param itemB - JSON artist/track object
     */

  }, {
    key: 'compareItems',
    value: function compareItems(itemA, itemB) {
      if (itemA.name < itemB.name) {
        return -1;
      }
      if (itemA.name > itemB.name) {
        return 1;
      }
      return 0;
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'list-group' },
        this.buildList()
      );
    }
  }]);

  return ResultsList;
}(React.Component);

var domContainer = document.querySelector('#react');
ReactDOM.render(React.createElement(SpotifySearch, null), domContainer);