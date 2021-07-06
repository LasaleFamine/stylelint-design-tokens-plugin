const path = require('path');
const stylelint = require('stylelint');
var flatten = require('flat')

// Support for Node 10
const matchAll = require('string.prototype.matchall');

const ruleName = 'designtokens/check';
const messages = stylelint.utils.ruleMessages(ruleName, {
	expected(value, similarArray) {
		return similarArray.length > 0 ?
			`[Design Tokens Error]: ${value}. You mean: --${similarArray.join(' --')}?` :
			`[Design Tokens Error]: ${value}.`;
	}
});

module.exports = stylelint.createPlugin(
	ruleName,
	(primaryOption, secondaryOptionsObject) => (root, result) => {
		if (!primaryOption) {
			return;
		}

		const validOptions = stylelint.utils.validateOptions(
			result,
			ruleName,
			{
				actual: secondaryOptionsObject,
				possible: [value => typeof value === 'string']
			}
		);

		if (!validOptions) {
			return;
		}

		const isLocal = secondaryOptionsObject.startsWith('./');
		const requirePath = isLocal ? path.resolve(process.cwd(), secondaryOptionsObject) : secondaryOptionsObject;
		const tokens = require(requirePath);

		root.walkDecls(decl => {
			if (decl.value.includes('env(')) {
				const reg = /env\(([^)]+)\)/gm;
				const extractedVars = [...matchAll(decl.value, reg)];
				const cleanedVars = extractedVars.filter(item => item[1].startsWith('--')).map(item => item[1].replace(/^--/i, ''));
				const tokensKeys = Object.keys(flatten(tokens, {
					delimiter: '-'
				}));

				cleanedVars.forEach(cleanVar => {
					const found = tokensKeys.find(key => key === cleanVar);
					if (!found) {
						const similar = tokensKeys.filter(key => key.includes(cleanVar));
						stylelint.utils.report({
							result,
							ruleName,
							message: messages.expected(`${decl.prop}, ${decl.value}`, similar),
							node: decl,
							word: decl.value
						});
					}
				});
			}
		});
	});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
