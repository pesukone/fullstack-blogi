module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": "airbnb",
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ],
    "eqeqeq": "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": [
      "error", "always"
    ],
    "arrow-spacing": [
      "error", { "before": true, "after": true }
    ],
    "no-console": 0,
    "comma-dangle": [
      "error", "never"
    ]
  },
  "globals": {
    "test": true,
    "expect": true,
    "describe": true,
    "beforeAll": true,
    "afterAll": true
  }
};
