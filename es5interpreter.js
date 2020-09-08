const acorn = require('acorn');

export default function evaluate(exp, state) {
  const parsedExp = acorn.parse(exp).body;

  const OPERATORS = new Map([
    ['!', (right) => !right],
    ['||', (left, right) => left || right],
  ]);
}
