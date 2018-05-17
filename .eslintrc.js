module.exports = {
  "extends": "airbnb",
  rules: {
    'class-methods-use-this': 0,
    'jsx-a11y/click-events-have-key-events': 1,
    'jsx-a11y/anchor-is-valid': 1,
  },
  env: {
    jest: true,
    browser: true,
  }
};