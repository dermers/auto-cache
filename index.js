'use strict';

function $(foo) {
  const memo = {}
  return new Proxy(foo, {
    apply(target, thisArg, argumentsList) {
      const key = `${JSON.stringify(thisArg)}${JSON.stringify(argumentsList)}`;
      console.log(key);
      if (memo[key] === undefined) {
        memo[key] = Reflect.apply(target, thisArg, argumentsList);
      }
      return memo[key];
    }
  });
}


// tests
const assert = require('node:assert/strict');

let n = 0;
const testFunc = $(function(a, b, c) {
  n += 1;
  return `a: ${JSON.stringify(a)}
b: ${JSON.stringify(b)}
c: ${JSON.stringify(c)}`;
});

// start
assert.equal(n, 0);

// new call
console.log(testFunc(1, 2, 3));
assert.equal(n, 1);
// repeated calls
console.log(testFunc(1, 2, 3));
assert.equal(n, 1);
console.log(testFunc(1, 2, 3));
assert.equal(n, 1);

// new call with objects
console.log(testFunc({q: {test: 'bar'}}, 2, 3));
assert.equal(n, 2);
console.log(testFunc({q: {test: 'bar'}}, 2, 3));
assert.equal(n, 2);
console.log(testFunc({q: {test: 'bar'}}, 2, 3));
assert.equal(n, 2);

// new call with objects and functions
// TODO fallback to toString for functions
console.log(testFunc({q: {test: 'bar'}}, 2, function(x){ return x }));
assert.equal(n, 3);
console.log(testFunc({q: {test: 'bar'}}, 2, function(x) { return x }));
assert.equal(n, 3);
console.log(testFunc({q: {test: 'bar'}}, 2, function(x) { return x }));
assert.equal(n, 3);