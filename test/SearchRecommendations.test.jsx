import React from 'react';
import { mount } from 'enzyme';
import { DataBrowser as Data } from '@owsas/geopromos-private-api/out/DataBrowser';

import SearchRecommendations from '../src/SearchRecommendations';

describe('Rendered view', () => {
  let spy;
  const testResults = [{
    text: 'Super Pizza',
    className: 'Brand',
    objectId: '123',
    alias: 'superpizza',
    picUrl: 'abc',
  }, {
    text: 'Comida rápida',
    className: 'Subcategory',
    alias: 'fast-food',
    objectId: '456',
  }, {
    text: 'Comida italiana',
    className: 'Subcategory',
    alias: 'italian-food',
    objectId: '789',
  }, {
    text: 'Comida',
    className: 'Category',
    alias: 'food',
    objectId: '0123',
  }];

  const onSelect = jest.fn();

  function getCorrectRecommendations(text) {
    return [{ text }].concat(testResults);
  }

  beforeEach(() => {
    spy = jest.spyOn(Data, 'getResultsForSearch');
    spy.mockImplementation(async text => getCorrectRecommendations(text));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Styles', () => {
    test('Styles.result should be ok', () => {
      expect(SearchRecommendations.styles.result).toEqual({
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        textDecoration: false,
      });
    });

    test('Styles.container should be ok', () => {
      expect(SearchRecommendations.styles.container).toEqual({
        position: 'absolute',
        top: 40,
        backgroundColor: 'white',
        zIndex: 100,
        width: 250,
        boxShadow: '-4px 10px 44px 3px rgba(0,0,0,0.45)',
      });
    });
  });

  describe('Mount', () => {
    const m = mount(<SearchRecommendations text="" onSelect={onSelect} />);
    const instance2 = new SearchRecommendations({ text: '', onSelect });

    test('should mount ok', () => {
      expect(m.exists()).toBe(true);
    });

    test('should start with no recommendations', () => {
      expect(m.instance().state.recommendations).toEqual([]);
    });

    describe('#getResultsForSearch', () => {
      test('should call Data #getResultsForSearch', async () => {
        const spyState = jest.spyOn(instance2, 'setState');
        spyState.mockImplementationOnce((s) => { instance2.state = s; });

        await instance2.getResultsForSearch('pizza');

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('pizza', 5);
      });

      test('should set the state recommendations correctly', async () => {
        const spyState = jest.spyOn(instance2, 'setState');
        spyState.mockImplementationOnce((s) => { instance2.state = s; });
        const search = 'pizza en cali';

        await instance2.getResultsForSearch(search);

        expect(spyState).toHaveBeenCalledWith({
          recommendations: getCorrectRecommendations(search),
        });
      });
    });

    test('should call #getResultsForSearch on #componentWillReceiveProps', () => {
      const spyResults = jest.spyOn(m.instance(), 'getResultsForSearch');
      spyResults.mockImplementation(jest.fn());

      // instance2.componentWillReceiveProps({ text: 'custom search' });
      m.setProps({ text: 'custom search', onSelect });

      expect(spyResults).toHaveBeenCalledTimes(1);
      expect(spyResults).toHaveBeenCalledWith('custom search');
    });

    describe('Rendered view with results', async () => {
      const text = 'pizza restaurante';

      beforeAll(() => {
        m.setProps({ text, onSelect });
        m.setState({ recommendations: getCorrectRecommendations(text) });
      });

      describe('Container', () => {
        test('should have the style container', () => {
          expect(m.find('div').prop('style')).toEqual(SearchRecommendations.styles.container);
        });
      });

      describe('First recommendation', () => {
        test('should have an anchor with the searched text', async () => {
          const anchor = m.find('a').at(0);

          expect(anchor.text()).toEqual(text);
        });

        test('should have an anchor with the searched text', async () => {
          const anchor = m.find('a').at(0);

          expect(anchor.text()).toEqual(text);
        });

        test('should call props #onSelect on click with the text', () => {
          const anchor = m.find('a').at(0);

          anchor.prop('onClick')();
          expect(onSelect).toHaveBeenLastCalledWith({ text });
        });
      });

      describe('Other recommendations (#renderRecomendation)', () => {
        const recommendation = testResults[0];
        const rr = mount(instance2.renderRecommendation(recommendation));

        test('should have the Styles.result', () => {
          expect(rr.at(0).prop('style')).toEqual(SearchRecommendations.styles.result);
        });

        test('should call props #onSelect on click with the recommendation object', () => {
          rr.at(0).simulate('click');
          expect(onSelect).toHaveBeenLastCalledWith(recommendation);
        });

        test('should display the recommendation text', () => {
          expect(rr.text()).toEqual(recommendation.text);
        });

        describe('Recommendation image', () => {
          test('should have the correct src', () => {
            const img = rr.find('img');
            expect(img.prop('src')).toEqual(recommendation.picUrl);
          });

          test('should have the correct styling', () => {
            const img = rr.find('img');
            expect(img.prop('style')).toEqual({
              width: 30,
              height: 30,
              backgroundColor: 'whitesmoke',
              marginRight: 5,
            });
          });
        });
      });
    });
  });
});
