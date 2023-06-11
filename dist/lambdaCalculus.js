"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isVariable = (expression) => {
    return /^[a-z]$/.test(expression);
};
const lambdaCalculus = (request) => {
    const expression = request.params.expression;
    if (isVariable(expression)) {
        return expression;
    }
    else if (expression.startsWith('(') && expression.endsWith(')')) {
        const innerExpression = expression.slice(1, -1).trim();
        const tokens = innerExpression.split(' ');
        if (tokens.length === 2 && tokens[0].includes('!') && isVariable(tokens[1])) {
            return lambdaCalculus(tokens[1]);
        }
    }
    return expression;
};
exports.default = lambdaCalculus;
