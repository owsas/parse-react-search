import * as Index from '../src/index';
import SelectCategories from '../src/SelectCategories';
import SearchInput from '../src/SearchInput';
import SearchLocationInput from '../src/SearchLocationInput';
import SearchForm from '../src/SearchForm';
import SearchFormWithLocation from '../src/SearchFormWithLocation';
import SearchBar from '../src/SearchBar';


const { version } = require('../package.json');

test('should export the version', () => {
  expect(Index.version).toEqual(version);
});

test('should export the SearchInput', () => {
  expect(Index.SearchInput).toEqual(SearchInput);
});

test('should export the SearchBar', () => {
  expect(Index.SearchBar).toEqual(SearchBar);
});

test('should export the SearchForm', () => {
  expect(Index.SearchForm).toEqual(SearchForm);
});

test('should export the SearchFormWithLocation', () => {
  expect(Index.SearchFormWithLocation).toEqual(SearchFormWithLocation);
});

test('should export the SearchLocationInput', () => {
  expect(Index.SearchLocationInput).toEqual(SearchLocationInput);
});

test('should export the SelectCategories', () => {
  expect(Index.SelectCategories).toEqual(SelectCategories);
});

