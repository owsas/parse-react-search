# Parse React Search

Collection of useful components for searching in your Parse database, with `react@^16.0.0`

<!-- TOC -->

- [Parse React Search](#parse-react-search)
    - [Install](#install)
  - [Components](#components)
    - [SearchInput](#searchinput)
  - [Collaborate](#collaborate)
  - [Features](#features)
  - [Folder structure](#folder-structure)
  - [Credits](#credits)
  - [License](#license)

<!-- /TOC -->

### Install 

With npm:
`npm i -S @owsas/parse-react-search`

Or with Yarn:  
`yarn add @owsas/parse-react-search`


## Components

### SearchInput

```jsx
import SearchInput from '../src/SearchInput';

render(
  <section>
    <h1>Search Input</h1>
    <SearchInput scope={['Brand']} />
  </section>
);
```

Alternatively, you may provide a Parse.Query as the `query` prop and it will automatically search those results. However, if you provide a query, you MUST also provide a transformItem function.

```jsx
import SearchInput from '../src/SearchInput';

const query = new Parse.Query('TestClass');

function transformItem(obj) { // Parse.Object
  return {
    text: obj.get('name'),
    objecId: obj.id,
    alias: obj.get('alias'), // optional
    pciUrl: undefined, // optional
  }
}

render(
  <section>
    <h1>Search Input</h1>
    <SearchInput 
      scope={['Brand']}
      query={query}
      transformItem={transformItem} 
    />
  </section>
);
```

When providing a query, you can also define the `querySearchKey` prop. This will match with `query.matches(querySearchKey, inputValue)`, which means that the query provided will be automatically matched with the search text of the input, providing partial match completion to the results.

```js
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
  querySearchKey: PropTypes.string, // which
};
```

## Collaborate
1. Clone this repository
1. Run `yarn install` (Usage of Yarn is recommended)
1. Edit the `src/*.jsx` files and then run `npm run dev`.  
1. This will start the `webpack-dev-server` 
1. Then open your browser at `localhost:3100`
1. The browser will be updated everytime you change the code at `src/index.jsx`

## Features
* Linting with eslint
* Linting code style: Airbnb
* Testing with `jest@^21.2.1` and `enzyme@^3.1.1`
* Uses `babel` for JS transpiling
* Uses `webpack` for building the code

## Folder structure
* `/src`: The module code
* `/test`: The tests for the `src` components
* `/build`: The target compilation directory

## Credits
Juan Camilo Guarín Peñaranda  
[Otherwise SAS](https://github.com/owsas)  
Cali, Colombia, 2017

## License

All rights reserved  
Otherwise SAS  
Cali, Colombia. 
2017
