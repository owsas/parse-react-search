import React from 'react';
import { mount } from 'enzyme';
import delay from 'delay';

import SearchBar from '../src/SearchBar';

test('should mount ok', () => {
  mount(<SearchBar onSubmit={jest.fn()} />);
});

describe('Rendered view', () => {
  const onSubmit = jest.fn();
  const m = mount(<SearchBar onSubmit={onSubmit} />);

  describe('Initial state', () => {
    test('should have no text', () => {
      expect(m.state().text).toEqual('');
    });

    test('should not show the X button', () => {
      expect(m.state().showX).toEqual(false);
    });

    test('should not show the recommendations', () => {
      expect(m.state().showRecommendations).toEqual(false);
    });
  });

  describe('Wrapper div', () => {
    test('should have position relative', () => {
      // get the first div and test it
      expect(m.find('div').at(0).prop('style')).toEqual({ position: 'relative' });
    });
  });

  describe('Form', () => {
    test('should exist', () => {
      expect(m.find('form').exists()).toEqual(true);
    });

    describe('Search button', () => {
      const m2 = mount(<SearchBar onSubmit={onSubmit} />);
      const button = m2.find('Button');

      test('should exist', () => {
        expect(button.exists()).toBe(true);
      });

      test('should have type submit', () => {
        expect(button.prop('type')).toEqual('submit');
      });

      describe('Search icon', () => {
        test('icon should be fa fa-search', () => {
          expect(button.find('i').prop('className')).toEqual('fa fa-search');
        });

        test('should have a margin of 5px at the right', () => {
          expect(button.find('i').prop('style')).toEqual({ marginRight: 5 });
        });
      });

      test('should have text "Ver todo" when no text in the state', () => {
        expect(button.text()).toEqual('Ver todo');
      });

      test('should have text "Buscar" when text is set in the state', () => {
        m2.setState({ text: 'Some text' });
        expect(button.text()).toEqual('Buscar');
      });
    });

    describe('#onSubmit', () => {
      test("should be the instance's #onSubmit", () => {
        const form = m.find('form');
        expect(form.prop('onSubmit')).toEqual(m.instance().onSubmit);
      });

      test('on call, should call props #onSubmit with the expected text', () => {
        const m2 = mount(<SearchBar onSubmit={onSubmit} />);
        const form = m2.find('form');

        m2.setState({ text: 'mock text' });

        form.simulate('submit');

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith({ text: 'mock text' });
      });

      test('on call, should hide the recommendations', () => {
        const m2 = mount(<SearchBar onSubmit={onSubmit} />);
        const form = m2.find('form');

        m2.setState({ text: 'mock text' });

        form.simulate('submit');
        expect(m2.state().showRecommendations).toBe(false);
      });
    });

    describe('On change text', () => {
      const m2 = mount(<SearchBar onSubmit={onSubmit} />);
      const formInput = m2.find('FormControl');
      const searchText = 'Search text';
      const spyState = jest.spyOn(m2.instance(), 'setState');

      // simulate searching
      formInput.simulate('change', { target: { value: searchText } });

      test('should set the state to the given text', () => {
        expect(m2.state().text).toEqual(searchText);
      });

      test('should set showRecommendations to true on the state', () => {
        expect(m2.state().showRecommendations).toBe(true);
      });

      test('should call setState only once', () => {
        expect(spyState).toHaveBeenCalledTimes(1);
      });

      describe('Shown recommendations', () => {
        const SearchRecommendations = m2.find('SearchRecommendations');

        test('should exist', () => {
          expect(SearchRecommendations.exists()).toEqual(true);
        });

        test("should have the instance's #onSelectRecommendation", () => {
          expect(SearchRecommendations.prop('onSelect')).toEqual(m2.instance().onSelectRecommendation);
        });

        test("should have the instance's state text as a prop", () => {
          expect(SearchRecommendations.prop('text')).toEqual(m2.instance().state.text);
        });

        describe('#onSelectRecommendation', () => {
          describe('is an object with className', () => {
            const obj = {
              className: 'Object',
              objectId: '123',
              text: 'the name',
            };

            test('should call props #onSubmit with the right information', () => {
              m2.instance().onSelectRecommendation(obj);
              expect(onSubmit).toHaveBeenLastCalledWith({ obj });
            });
          });

          describe('is a text object', () => {
            const objText = {
              text: 'the text',
            };

            test('should call props #onSubmit with the right information', () => {
              m2.instance().onSelectRecommendation(objText);
              expect(onSubmit).toHaveBeenLastCalledWith(objText);
            });
          });
        });
      });

      describe('When text is erased', () => {
        const onClearText = jest.fn();
        const m3 = mount(<SearchBar onSubmit={onSubmit} onClearText={onClearText} />);

        const input = m3.find('FormControl');
        const text = 'Search text';
        const spyState2 = jest.spyOn(m3.instance(), 'setState');

        test('should hide recommendations', () => {
          // simulate searching
          input.simulate('change', { target: { value: text } });

          // simulate text emptied
          input.simulate('change', { target: { value: '' } });

          expect(spyState2).toHaveBeenLastCalledWith({ text: '', showRecommendations: false });
        });

        test('should call props #onClearText', () => {
          // simulate searching
          input.simulate('change', { target: { value: text } });

          // simulate text emptied
          input.simulate('change', { target: { value: '' } });

          expect(onClearText).toHaveBeenCalled();
        });
      });

      describe('Clear search button', () => {
        const onClearText = jest.fn();
        const m3 = mount(<SearchBar onSubmit={onSubmit} onClearText={onClearText} />);

        const input = m3.find('FormControl');
        const text = 'Search text';

        // simulate searching
        input.simulate('change', { target: { value: text } });

        test("should be shown if there's a text", () => {
          expect(m3.find('.buttonClearSearch').exists()).toBe(true);
        });

        test('should have the icon fa fa-times', () => {
          const button = m3.find('.buttonClearSearch');
          expect(button.find('i').prop('className')).toEqual('fa fa-times');
        });

        test('should call prop #onClearText when clicked', () => {
          const button = m3.find('.buttonClearSearch');
          button.simulate('click');
          expect(onClearText).toHaveBeenCalledTimes(1);
        });

        test('should have cleaned the state text after click', () => {
          expect(m3.state().text).toEqual('');
        });
      });

      describe('Input onBlur', () => {
        const onClearText = jest.fn();
        const m3 = mount(<SearchBar onSubmit={onSubmit} onClearText={onClearText} />);

        const input = m3.find('FormControl');
        const text = 'Search text';

        // simulate searching
        input.simulate('change', { target: { value: text } });

        test('should have instance #onBlur', () => {
          expect(input.prop('onBlur')).toEqual(m3.instance().onBlur);
        });

        test('on blur should hide recommendations', async () => {
          input.simulate('blur');
          await delay(500);
          expect(m3.instance().state.showRecommendations).toEqual(false);
        });
      });

      describe('Input onFocus', () => {
        const onClearText = jest.fn();
        const m3 = mount(<SearchBar onSubmit={onSubmit} onClearText={onClearText} />);

        const input = m3.find('FormControl');
        const text = 'Search text';

        // simulate searching
        input.simulate('change', { target: { value: text } });

        test('should have instance #onFocus', () => {
          expect(input.prop('onFocus')).toEqual(m3.instance().onFocus);
        });

        test('if state has text, should show recommendations', () => {
          input.simulate('focus');
          expect(m3.instance().state.showRecommendations).toEqual(true);
        });
      });
    });
  });
});
