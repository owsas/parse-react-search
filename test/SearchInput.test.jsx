import React from 'react';
import { mount, shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import SearchInput from '../src/SearchInput';

describe('#getCountryFlagURL', () => {
  test('should convert upper case to lowercase', () => {
    const countryCode = 'US';
    const expected = `https://s3-us-west-2.amazonaws.com/otherwise-files/flags/${countryCode.toLowerCase()}.png`;

    const result = SearchInput.getCountryFlagURL(countryCode);
    expect(result).toEqual(expected);
  });
});

describe('#getValue', () => {
  test('should get the value on the state', () => {
    const m = mount(<SearchInput />);
    m.setState({ value: 'test value' });
    expect(m.instance().getValue()).toEqual({ text: 'test value' });
  });

  test('should return the selected item if it exists', () => {
    const m = mount(<SearchInput />);
    m.setState({ value: 'test value' });
    m.instance().selected = { test: 'ok' };
    expect(m.instance().getValue()).toEqual({ test: 'ok' });
  });
});

describe('#renderItem', () => {
  test('should match the snapshot', () => {
    const m = shallow(<SearchInput />);
    const m2 = shallow(m.instance().renderItem({
      text: 'Test',
      countryCode: 'CO',
      objectId: '123',
      official: true,
      picUrl: 'testUrl',
    }));
    expect(toJSON(m2)).toMatchSnapshot();
  });
});

test('should match the snapshot', () => {
  const m = shallow(<SearchInput />);
  expect(toJSON(m)).toMatchSnapshot();
});
