import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import 'react-select/dist/react-select.css';

export default class SelectCategories extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      options: [],
      selectedValues: this.props.selectedValues,
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.getItems();
  }

  onChange(selectedValues) {
    this.setState({ selectedValues });
    if (this.props.onChange) {
      this.props.onChange(selectedValues);
    }
  }

  async getItems() {
    const results = await DataBrowser.getQuery(this.props.className)
      .equalTo('active', true)
      .find();

    const options = results.map(result => ({
      label: result.get('defaultName'), value: result.get('alias'),
    }));

    this.setState({ options });
  }


  render() {
    return (
      <Select
        name={`input-${this.props.className.toLowerCase()}`}
        value={this.state.selectedValues}
        options={this.state.options}
        multi={this.props.multi}
        onChange={this.onChange}
      />
    );
  }
}

SelectCategories.defaultProps = {
  multi: false,
  selectedValues: [],
  className: 'Category',
  onChange: undefined,
};

SelectCategories.propTypes = {
  multi: PropTypes.bool,
  onChange: PropTypes.func,
  selectedValues: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  className: PropTypes.string,
};
