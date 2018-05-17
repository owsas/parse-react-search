import React from 'react';
import PropTypes from 'prop-types';

import { DataBrowser as Data } from '@owsas/geopromos-private-api/out/DataBrowser';


export default class SearchRecommendations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recommendations: [],
    };

    this.renderRecommendation = this.renderRecommendation.bind(this);
  }

  /**
   * @param {{ text: string }} props
   */
  componentWillReceiveProps(props) {
    this.getResultsForSearch(props.text);
  }

  /**
   * Gets the results for the text, and renders them
   * @param {string} text
   */
  async getResultsForSearch(text) {
    let recommendations = [];

    if (text) {
      try {
        recommendations = await Data.getResultsForSearch(text, 5, this.props.scope);
      } catch (error) {
        // do nothing
        console.log('error', error);
      }
    }

    this.setState({ recommendations });
  }

  /**
   * Renders each recommendation
   * @param {{ text: string, objectId: string, className: string, picUrl: string, alias: string }} r
  */
  renderRecommendation(r) {
    return (
      <a
        key={`${r.objectId + Math.random()}`}
        style={SearchRecommendations.styles.result}
        onClick={() => { this.props.onSelect(r); }}
        role="presentation"
      >

        {/* The image */}
        { r.picUrl && <img
          alt=""
          src={r.picUrl}
          style={{
            width: 30,
            height: 30,
            backgroundColor: 'whitesmoke',
            marginRight: 5,
          }}
        /> }

        {/* The text */}
        <span>{r.text}</span>
      </a>
    );
  }

  render() {
    return (
      !!this.props.text &&
      this.state.recommendations.length > 0 &&
      <div style={SearchRecommendations.styles.container}>
        <a
          style={SearchRecommendations.styles.result}
          onClick={() => { this.props.onSelect({ text: this.props.text }); }}
          role="presentation"
        >
          {this.props.text}
        </a>
        {this.state.recommendations.map(this.renderRecommendation)}
      </div>
    );
  }
}

SearchRecommendations.styles = {
  result: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    textDecoration: false,
  },
  container: {
    position: 'absolute',
    top: 40,
    backgroundColor: 'white',
    zIndex: 100,
    width: 250,
    boxShadow: '-4px 10px 44px 3px rgba(0,0,0,0.45)',
  },
};

SearchRecommendations.defaultProps = {
  scope: undefined,
};

SearchRecommendations.propTypes = {
  text: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  scope: PropTypes.arrayOf(PropTypes.string),
};
