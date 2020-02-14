# stylelint-design-tokens-plugin
[![Build Status](https://travis-ci.com/LasaleFamine/stylelint-design-tokens-plugin.svg?branch=master)](https://travis-ci.com/LasaleFamine/stylelint-design-tokens-plugin)

> Stylelint plugin for checking Design Tokens use inside your CSS

## Install

```
$ yarn add --dev stylelint-design-tokens-plugin
```


## Usage

Add the plugin within the `.stylelintrc` and activate the rule:

```json
{
	"plugins": ["stylelint-design-tokens-plugin"],
	"rules": {
		"designtokens/check": [true, "./path-to-your-design-tokens.json"]
	}
}
```


## How it works

When launched Stylelint, the plugin:

- will try to load your JSON Tokens from the path you defined on the rule
- will check for `env()` defined variables (eg. `env(--space-8)`)
- will try to map the variable to the Tokens keys
- alert with an error if the no keys are mapped

### The Tokens JSON

Example of a Token JSON file:

```json
{
	"space-8": "8px",
	"space-16": "16px",
	...
}
```

> NOTE: be sure that your Token JSON file is a flat JSON so the plugin can recover the keys for the mapping.

## License

MIT © [Alessio Occhipinti](https://godev.space)
