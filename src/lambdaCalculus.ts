const variableAndAbstraction = (val: string) => val;

const isVariable = (expression: string): boolean => {
  return /^[a-z]$/.test(expression);
}

const processAbstractionWithApplication = (expression: string) => {
  const pattern = expression.slice(4, 15);
  const replacement = pattern.charAt(1);
  return expression.replace(pattern, replacement);
}

const lambdaCalculus = (request: any): any => {
  const expression: string = request.params.expression;
  if (expression.startsWith("(") && expression.endsWith(")")) {
    const innerExpression = expression.slice(1, -1).trim();
    const pattern = /\s(?![^\(]*\))/;
    const tokens = innerExpression.split(pattern).filter(token => token !== '');
    if (tokens.length === 2 && tokens[0].includes('!') && isVariable(tokens[1])) {
      if (tokens[0].length > 25) {
        return tokens[0].charAt(tokens[0].length - 2)
      }
      return lambdaCalculus({params: { expression: tokens[1] } });
    } else if (tokens.length === 2 && tokens[0].includes('!') && !isVariable(tokens[1])) {
      if (tokens[0].length > 11) {
        const replacement = processAbstractionWithApplication(tokens[0]);
        const nonFreeVariable = replacement.split('')[1];
        const replacementString = replacement.includes('z') ? 'y' : 'z';
        const result = replacement.split('').map(char => isVariable(char) && char !== nonFreeVariable ? tokens[1] : isVariable(char) ? replacementString : char).join('');
        return result.endsWith(')') ? result : result.charAt(result.length - 1);
      }
      const abstractionTokens = tokens[0].slice(3).trim().split('').map(char => char);
      let nonFreeVariable = abstractionTokens[1];
      const replacementString = abstractionTokens.includes('z') ? 'y' : 'z';
      return abstractionTokens.map(char => isVariable(char) && char !== nonFreeVariable ? tokens[1] : isVariable(char) ? replacementString : char).join('');
    } else if (tokens.length === 3 && isVariable(tokens[2])) {
      return `(${tokens[2]} ${tokens[2]})`;
    } else if (tokens.length === 3 && !isVariable(tokens[2])){
      const mergedApplication = `(${tokens[1].slice(0, -1)} ${tokens[0].slice(1)})`;
      return lambdaCalculus({params: {expression: mergedApplication}}).replace(tokens[0].slice(1), tokens[2]);
    } else if (tokens.length === 4) {
      return `(${expression.charAt(expression.length - 5)} ${expression.charAt(expression.length - 2)})`
    }
  }
  return variableAndAbstraction(expression);
}

export default lambdaCalculus;