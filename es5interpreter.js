const acorn = require('acorn');

const UNARY_OPERATORS = new Map([
  ['-', (right) => -right],
  ['+', (right) => +right],
  ['!', (right) => !right],
]);

const BINARY_OPERATORS = new Map([
  ['||', (left, right) => left || right],
  ['+', (left, right) => left + right],
  ['-', (left, right) => left - right],
  ['*', (left, right) => left * right],
  ['/', (left, right) => left / right],
]);

function evaluate(inputExp, state) {
  let exp = inputExp;
  if (typeof inputExp === 'string') exp = acorn.parse(exp).body[0];

  // console.log(JSON.stringify(exp, null, 2));

  let operator;
  let argument;
  let left;
  let right;
  switch (exp.type) {
    case 'Literal':
      return exp.value;
    case 'Identifier':
      return state.get(exp.name);
    case 'UnaryExpression':
      argument = evaluate(exp.argument, state);
      operator = UNARY_OPERATORS.get(exp.operator);
      return operator(argument);
    case 'BinaryExpression':
    case 'LogicalExpression':
      left = evaluate(exp.left, state);
      right = evaluate(exp.right, state);
      operator = BINARY_OPERATORS.get(exp.operator);
      return operator(left, right);
    case 'ExpressionStatement':
      return evaluate(exp.expression, state);
    case 'IfStatement':
      console.log({ exp })
      const test = evaluate(exp.test)
      const consequent = evaluate(exp.consequent)
      const alternate = evaluate(exp.consequent)

      state.totalOperators += 1;
      state.distinctOperators.add(exp.type);
      evaluate(exp.test, state);
      evaluate(exp.consequent, state);
      evaluate(exp.alternate, state);
      break;
    // case 'VariableDeclaration':
    //   state.totalOperators += 1;
    //   state.distinctOperators.add(exp.type);
    //   exp.declarations.forEach((element) => {
    //     evaluate(element, state);
    //   });
    //   break;
    // case 'VariableDeclarator':
    //   state.totalOperators += 1;
    //   state.distinctOperators.add(exp.type);
    //   evaluate(exp.init, state);
    //   break;
    // case 'ThisExpression':
    //   state.totalOperators += 1;
    //   state.distinctOperators.add(exp.type);
    //   state.totalOperators += 1;
    //   state.distinctOperators.add(exp.type);
    //   break;
    // case 'ArrayExpression':
    //   state.totalOperators += 1;
    //   state.distinctOperators.add(exp.type);
    //   exp.elements.forEach((element) => {
    //     evaluate(element, state);
    //   });
    //   break;
    // case 'ObjectExpression':
    //   state.totalOperators += 1;
    //   state.distinctOperators.add(exp.type);
    //   exp.properties.forEach((element) => {
    //     evaluate(element, state);
    //   });
    //   break;
    // case 'Property':
    //   evaluate(exp.key, state);
    //   evaluate(exp.value, state);
    //   break;
    // case 'SequenceExpression':
    //   state.totalOperators += 1;
    //   state.distinctOperators.add(exp.type);
    //   exp.expressions.forEach((parameter) => {
    //     evaluate(parameter, state);
    //   });
    //   break;
    // case 'AssignmentExpression':
    //   state.totalOperators += 1;
    //   state.distinctOperators.add(exp.type);
    //   evaluate(exp.operator, state);
    //   evaluate(exp.left, state);
    //   evaluate(exp.right, state);
    //   break;
    // case 'UpdateExpression':
    //   state.totalOperators += 1;
    //   state.distinctOperators.add(exp.type);
    //   evaluate(exp.operator, state);
    //   evaluate(exp.argument, state);
    //   evaluate(exp.prefix, state);
    //   break;
    // case 'ConditionalExpression':
    //   state.totalOperators += 1;
    //   state.distinctOperators.add(exp.type);
    //   evaluate(exp.test, state);
    //   evaluate(exp.alternate, state);
    //   evaluate(exp.consequent, state);
    //   break;
    // case 'NewExpression':
    //   state.totalOperators += 1;
    //   state.distinctOperators.add(exp.type);
    //   evaluate(exp.callee, state);
    //   exp.arguments.forEach((parameter) => {
    //     evaluate(parameter, state);
    //   });
    //   break;
    // case 'CallExpression':
    //   state.totalOperators += 1;
    //   state.distinctOperators.add(exp.type);
    //   evaluate(exp.callee, state);
    //   exp.arguments.forEach((parameter) => {
    //     evaluate(parameter, state);
    //   });
    //   break;
    // case 'MemberExpression':
    //   state.totalOperators += 1;
    //   state.distinctOperators.add(exp.type);
    //   evaluate(exp.object, state);
    //   evaluate(exp.property, state);
    //   evaluate(exp.computed, state);
    //   break;
    // case 'SwitchCase':
    //   state.totalOperators += 1;
    //   state.distinctOperators.add(exp.type);
    //   exp.consequent.forEach((parameter) => {
    //     evaluate(parameter, state);
    //   });
    //   evaluate(exp.test, state);
    //   break;
    // case 'CatchClause':
    //   state.totalOperators += 1;
    //   state.distinctOperators.add(exp.type);
    //   evaluate(exp.param, state);
    //   evaluate(exp.guard, state);
    //   evaluate(exp.body, state);
    //   break;
    default:
      break;
  }
}

function runTests() {
  const state = new Map()
  state.set('x', 1);
  state.set('y', 3);
  // const res = evaluate('if (true) { 1 + 1; } else { 3 }', state);
  const examples = [
    // evaluate('x + y;', new Map({ x: 1, y: 3 })),
    evaluate('x + y;', state),
    // evaluate('if (x) { 1 + 1 }', new Map({ x: true })),
  ]

  examples.map(example => console.log(example))
  // console.log(JSON.stringify(res, null, 2));
}

runTests()

module.exports = {
  evaluate,
};
