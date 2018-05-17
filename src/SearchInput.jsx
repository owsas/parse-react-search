import React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from 'react-autocomplete';
import CheckCircleIcon from 'react-icons/lib/fa/check-circle-o';

export default class SearchInput extends React.Component {
  /**
   * Given a country code, brings the url to the flag in aws
   * @param {string} code
   */
  static getCountryFlagURL(code) {
    return `https://s3-us-west-2.amazonaws.com/otherwise-files/flags/${code.toLowerCase()}.png`;
  }

  constructor(props) {
    super(props);

    this.state = {
      value: props.initialValues.value,
      results: [],
      query: this.props.query,
      querySearchKey: this.props.querySearchKey,
      transformItem: this.props.transformItem,
    };

    this.selected = props.initialValues.selected;
    this.timeout = undefined;

    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.clearValue = this.clearValue.bind(this);
  }

  componentWillReceiveProps(props = {}) {
    if (props.initialValues && props.initialValues.value) {
      this.setState({ value: props.initialValues.value });
      this.selected = props.initialValues.selected;
    }

    if (props.query) {
      this.setState({
        query: props.query,
      });
    }

    if (props.transformItem) {
      this.setState({
        transformItem: props.transformItem,
      });
    }

    if (props.querySearchKey) {
      this.setState({
        querySearchKey: props.querySearchKey,
      });
    }
  }

  onChange(e) {
    this.setState({ value: e.target.value });
    this.selected = undefined;

    if (this.timeout) {
      window.clearTimeout(this.timeout);
      this.timeout = undefined;
    }

    this.timeout = window.setTimeout(() => {
      this.findResults();
    }, 300);
  }

  onSelect(value, item) {
    this.selected = item;
    this.setState({ value });

    if (this.props.onSelect) {
      this.props.onSelect(item);
    }
  }

  getSelectedItem() {
    return this.selected;
  }

  getValue() {
    return this.getSelectedItem() || { text: this.state.value };
  }

  clearValue() {
    this.setState({ value: '' });
  }

  async findResults() {
    try {
      const {
        queryOptions,
        includeSearchText,
      } = this.props;

      const {
        query,
        querySearchKey,
        transformItem,
      } = this.state;

      let results;

      if (query && transformItem) {
        if (querySearchKey) {
          query.matches(querySearchKey, this.state.value);
        }

        results = await query.find(queryOptions).then(transformItem);
      } else {
        results = []; // TODO: Call ParseReactSearch
      }

      if (includeSearchText) {
        const localResults = this.state.value ? [{ text: this.state.value }] : [];

        this.setState({ results: [].concat(localResults, results) });
      } else {
        this.setState({ results });
      }
    } catch (e) {
      // nothing
    }
  }

  renderItem(item, isHighlighted) {
    if (!item) return null;

    return (
      <div key={`searchInput-item-${item.objectId}`} style={{ background: isHighlighted ? 'lightgray' : 'white', padding: 5 }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {item.picUrl &&
            <div>
              <img src={item.picUrl} alt="" style={{ height: 40, width: 40 }} />
            </div>
          }
          <div style={{ flex: 1, padding: 5 }}>
            <p style={{ margin: 0 }}><b>{item.text}</b> {item.official && <CheckCircleIcon />}</p>
            <p style={{ margin: 0 }}>
              {item.countryCode &&
                <img
                  src={SearchInput.getCountryFlagURL(item.countryCode)}
                  style={{ width: 16, marginRight: 5 }}
                  alt=""
                />
              }
              {item.alias && <span>{item.alias}</span>}
              {item.address && <span>{item.address}</span>}
            </p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { value, results } = this.state;

    return (
      <Autocomplete
        {...this.props.autocompleteProps}
        getItemValue={item => item.text}
        items={results}
        renderItem={this.renderItem}
        value={value}
        onChange={this.onChange}
        onSelect={this.onSelect}
        wrapperStyle={{
          position: 'relative',
        }}
      />
    );
  }
}

SearchInput.defaultProps = {
  initialValues: {},
  query: undefined,
  queryOptions: undefined,
  transformItem: undefined,
  scope: ['Brand'],
  autocompleteProps: {},
  includeSearchText: true,
  onSelect: undefined,
  querySearchKey: undefined,
};

SearchInput.propTypes = {
  initialValues: PropTypes.shape({
    value: PropTypes.string,
    selected: PropTypes.object, // eslint-disable-line
  }),
  query: PropTypes.object, // eslint-disable-line
  queryOptions: PropTypes.object, // eslint-disable-line
  transformItem: PropTypes.func,
  scope: PropTypes.arrayOf(PropTypes.string),
  includeSearchText: PropTypes.bool,
  autocompleteProps: PropTypes.object, //eslint-disable-line
  onSelect: PropTypes.func,
  querySearchKey: PropTypes.string,
};
