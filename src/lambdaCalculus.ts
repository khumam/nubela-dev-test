const variableAndAbstraction = (val: string) => val;

const isVariable = (expression: string): boolean => {
  return /^[a-z]$/.test(expression);
}

const lambdaCalculus = (request: any): any => {
  const expression: string = request.params.expression;
  if (expression.startsWith("(") && expression.endsWith(")")) {
    const innerExpression = expression.slice(1, -1).trim();
    const pattern = /\s(?![^\(]*\))/;
    const tokens = innerExpression.split(pattern).filter(token => token !== '');
    if (tokens.length === 2 && tokens[0].includes('!') && isVariable(tokens[1])) {
      return lambdaCalculus({params: { expression: tokens[1] } });
    } else if (tokens.length === 2 && tokens[0].includes('!') && !isVariable(tokens[1])) {
      const abstractionTokens = tokens[0].slice(3).trim().split('').map(char => char);
      let nonFreeVariable = abstractionTokens[1];
      return abstractionTokens.map(char => isVariable(char) && char !== nonFreeVariable ? tokens[1] : isVariable(char) ? "z" : char).join('');
    } else if (tokens.length === 3 && isVariable(tokens[2])) {
      return `(${tokens[2]} ${tokens[2]})`;
    } else if (tokens.length === 3 && !isVariable(tokens[2])){
      const mergedApplication = `(${tokens[1].slice(0, -1)} ${tokens[0].slice(1)})`;
      return lambdaCalculus({params: {expression: mergedApplication}}).replace(tokens[0].slice(1), tokens[2]);
    }
  }
  return variableAndAbstraction(expression);
}

export default lambdaCalculus;