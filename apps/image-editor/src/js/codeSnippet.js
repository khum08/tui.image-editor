/* eslint-disable */
/*!
 * @file This file contains functions from tui.code-snippet@1.5.2 that are required by our custom
 * build of this package.
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 * @license MIT
 */

/**
 * The last id of stamp
 * @type {number}
 * @private
 */
var lastId = 0;

/**
 * Extend the target object from other objects.
 * @param {object} target - Object that will be extended
 * @param {...object} objects - Objects as sources
 * @returns {object} Extended object
 * @memberof tui.util
 */
function extend(target, objects) { // eslint-disable-line no-unused-vars
  var hasOwnProp = Object.prototype.hasOwnProperty;
  var source, prop, i, len;

  for (i = 1, len = arguments.length; i < len; i += 1) {
    source = arguments[i];
    for (prop in source) {
      if (hasOwnProp.call(source, prop)) {
        target[prop] = source[prop];
      }
    }
  }

  return target;
}

/**
 * Create a new array or plain object with all elements(or properties)
 * that pass the test implemented by the provided function.<br>
 * Callback function(iteratee) is invoked with three arguments:
 *  - The value of the property(or The value of the element)
 *  - The name of the property(or The index of the element)
 *  - The object being traversed
 * @param {Object} obj Object(plain object or Array) that will be traversed
 * @param {function} iteratee Callback function
 * @param {Object} [context] Context(this) of callback function
 * @returns {Object} plain object or Array
 * @memberof tui.util
 * @example
 * //-- #1. Get Module --//
 * var util = require('tui-code-snippet'); // node, commonjs
 * var util = tui.util; // distribution file
 *
 * //-- #2. Use property --//
 * var result1 = util.filter([0,1,2,3], function(value) {
 *     return (value % 2 === 0);
 * });
 * alert(result1); // [0, 2]
 *
 * var result2 = util.filter({a : 1, b: 2, c: 3}, function(value) {
 *     return (value % 2 !== 0);
 * });
 * alert(result2.a); // 1
 * alert(result2.b); // undefined
 * alert(result2.c); // 3
 */
function filter(obj, iteratee, context) {
  var result, add;

  context = context || null;

  if (!isObject(obj) || !isFunction(iteratee)) {
    throw new Error('wrong parameter');
  }

  if (isArray(obj)) {
    result = [];
    add = function(subResult, args) {
      subResult.push(args[0]);
    };
  } else {
    result = {};
    add = function(subResult, args) {
      subResult[args[1]] = args[0];
    };
  }

  forEach(obj, function() {
    if (iteratee.apply(context, arguments)) {
      add(result, arguments);
    }
  }, context);

  return result;
}

/**
 * Execute the provided callback once for each property of object(or element of array) which actually exist.<br>
 * If the object is Array-like object(ex-arguments object), It needs to transform to Array.(see 'ex2' of example).<br>
 * If the callback function returns false, the loop will be stopped.<br>
 * Callback function(iteratee) is invoked with three arguments:
 *  - The value of the property(or The value of the element)
 *  - The name of the property(or The index of the element)
 *  - The object being traversed
 * @param {Object} obj The object that will be traversed
 * @param {function} iteratee Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof tui.util
 * @example
 * //-- #1. Get Module --//
 * var util = require('tui-code-snippet'); // node, commonjs
 * var util = tui.util; // distribution file
 *
 * //-- #2. Use property --//
 * var sum = 0;
 *
 * util.forEach([1,2,3], function(value){
 *     sum += value;
 * });
 * alert(sum); // 6
 *
 * // In case of Array-like object
 * var array = Array.prototype.slice.call(arrayLike); // change to array
 * util.forEach(array, function(value){
 *     sum += value;
 * });
 */
function forEach(obj, iteratee, context) {
  if (isArray(obj)) {
    forEachArray(obj, iteratee, context);
  } else {
    forEachOwnProperties(obj, iteratee, context);
  }
}

/**
 * Execute the provided callback once for each element present
 * in the array(or Array-like object) in ascending order.<br>
 * If the callback function returns false, the loop will be stopped.<br>
 * Callback function(iteratee) is invoked with three arguments:
 *  - The value of the element
 *  - The index of the element
 *  - The array(or Array-like object) being traversed
 * @param {Array} arr The array(or Array-like object) that will be traversed
 * @param {function} iteratee Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof tui.util
 * @example
 * //-- #1. Get Module --//
 * var util = require('tui-code-snippet'); // node, commonjs
 * var util = tui.util; // distribution file
 *
 * //-- #2. Use property --//
 * var sum = 0;
 *
 * util.forEachArray([1,2,3], function(value){
 *     sum += value;
 * });
 * alert(sum); // 6
 */
function forEachArray(arr, iteratee, context) {
  var index = 0;
  var len = arr.length;

  context = context || null;

  for (; index < len; index += 1) {
    if (iteratee.call(context, arr[index], index, arr) === false) {
      break;
    }
  }
}

/**
 * Execute the provided callback once for each property of object which actually exist.<br>
 * If the callback function returns false, the loop will be stopped.<br>
 * Callback function(iteratee) is invoked with three arguments:
 *  - The value of the property
 *  - The name of the property
 *  - The object being traversed
 * @param {Object} obj The object that will be traversed
 * @param {function} iteratee  Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof tui.util
 * @example
 * //-- #1. Get Module --//
 * var util = require('tui-code-snippet'); // node, commonjs
 * var util = tui.util; // distribution file
 *
 * //-- #2. Use property --//
 * var sum = 0;
 *
 * util.forEachOwnProperties({a:1,b:2,c:3}, function(value){
 *     sum += value;
 * });
 * alert(sum); // 6
 **/
function forEachOwnProperties(obj, iteratee, context) {
  var key;

  context = context || null;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (iteratee.call(context, obj[key], key, obj) === false) {
        break;
      }
    }
  }
}

/**
 * Returns the first index at which a given element can be found in the array
 * from start index(default 0), or -1 if it is not present.<br>
 * It compares searchElement to elements of the Array using strict equality
 * (the same method used by the ===, or triple-equals, operator).
 * @param {*} searchElement Element to locate in the array
 * @param {Array} array Array that will be traversed.
 * @param {number} startIndex Start index in array for searching (default 0)
 * @returns {number} the First index at which a given element, or -1 if it is not present
 * @memberof tui.util
 * @example
 * //-- #1. Get Module --//
 * var util = require('tui-code-snippet'); // node, commonjs
 * var util = tui.util; // distribution file
 *
 * //-- #2. Use property --//
 * var arr = ['one', 'two', 'three', 'four'];
 * var idx1 = util.inArray('one', arr, 3); // -1
 * var idx2 = util.inArray('one', arr); // 0
 */
var inArray = function(searchElement, array, startIndex) {
  var i;
  var length;
  startIndex = startIndex || 0;

  if (!isArray(array)) {
    return -1;
  }

  if (Array.prototype.indexOf) {
    return Array.prototype.indexOf.call(array, searchElement, startIndex);
  }

  length = array.length;
  for (i = startIndex; startIndex >= 0 && i < length; i += 1) {
    if (array[i] === searchElement) {
      return i;
    }
  }

  return -1;
};

/**
 * Check whether the given variable is an instance of Array or not.<br>
 *  If the given variable is an instance of Array, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is array instance?
 * @memberof tui.util
 */
function isArray(obj) {
  return obj instanceof Array;
}

/**
 * Check whether the given variable is existing or not.<br>
 *  If the given variable is not null and not undefined, returns true.
 * @param {*} param - Target for checking
 * @returns {boolean} Is existy?
 * @memberof tui.util
 * @example
 * //-- #1. Get Module --//
 * var util = require('tui-code-snippet'); // node, commonjs
 * var util = tui.util; // distribution file
 *
 * //-- #2. Use property --//
 * util.isExisty(''); //true
 * util.isExisty(0); //true
 * util.isExisty([]); //true
 * util.isExisty({}); //true
 * util.isExisty(null); //false
 * util.isExisty(undefined); //false
 */
function isExisty(param) {
  return !isUndefined(param) && !isNull(param);
}

/**
 * Check whether the given variable is a function or not.<br>
 *  If the given variable is a function, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is function?
 * @memberof tui.util
 */
function isFunction(obj) {
  return obj instanceof Function;
}

/**
 * Check whether the given variable is null or not.<br>
 *  If the given variable(arguments[0]) is null, returns true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is null?
 * @memberof tui.util
 */
function isNull(obj) {
  return obj === null;
}

/**
 * Check whether the given variable is an object or not.<br>
 *  If the given variable is an object, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is object?
 * @memberof tui.util
 */
function isObject(obj) {
  return obj === Object(obj);
}

/**
 * Check whether the given variable is a string or not.<br>
 *  If the given variable is a string, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is string?
 * @memberof tui.util
 */
function isString(obj) {
  return typeof obj === 'string' || obj instanceof String;
}

/**
 * Check whether the given variable is undefined or not.<br>
 *  If the given variable is undefined, returns true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is undefined?
 * @memberof tui.util
 */
function isUndefined(obj) {
  return obj === undefined; // eslint-disable-line no-undefined
}

/**
 * Execute the provided callback function once for each element in an array, in order,
 * and constructs a new array from the results.<br>
 * If the object is Array-like object(ex-arguments object),
 * It needs to transform to Array.(see 'ex2' of forEach example)<br>
 * Callback function(iteratee) is invoked with three arguments:
 *  - The value of the property(or The value of the element)
 *  - The name of the property(or The index of the element)
 *  - The object being traversed
 * @param {Object} obj The object that will be traversed
 * @param {function} iteratee Callback function
 * @param {Object} [context] Context(this) of callback function
 * @returns {Array} A new array composed of returned values from callback function
 * @memberof tui.util
 * @example
 * //-- #1. Get Module --//
 * var util = require('tui-code-snippet'); // node, commonjs
 * var util = tui.util; // distribution file
 *
 * //-- #2. Use property --//
 * var result = util.map([0,1,2,3], function(value) {
 *     return value + 1;
 * });
 *
 * alert(result);  // 1,2,3,4
 */
function map(obj, iteratee, context) {
  var resultArray = [];

  context = context || null;

  forEach(obj, function() {
    resultArray.push(iteratee.apply(context, arguments));
  });

  return resultArray;
}

/**
 * Retrieve a nested item from the given object/array
 * @param {object|Array} obj - Object for retrieving
 * @param {...string|number} paths - Paths of property
 * @returns {*} Value
 * @memberof tui.util
 * @example
 * //-- #1. Get Module --//
 * var util = require('tui-code-snippet'); // node, commonjs
 * var util = tui.util; // distribution file
 *
 * //-- #2. Use property --//
 * var obj = {
 *     'key1': 1,
 *     'nested' : {
 *         'key1': 11,
 *         'nested': {
 *             'key1': 21
 *         }
 *     }
 * };
 * util.pick(obj, 'nested', 'nested', 'key1'); // 21
 * util.pick(obj, 'nested', 'nested', 'key2'); // undefined
 *
 * var arr = ['a', 'b', 'c'];
 * util.pick(arr, 1); // 'b'
 */
function pick(obj, paths) { // eslint-disable-line no-unused-vars
  var args = arguments;
  var target = args[0];
  var i = 1;
  var length = args.length;

  for (; i < length; i += 1) {
    if (isUndefined(target) ||
      isNull(target)) {
      return;
    }

    target = target[args[i]];
  }

  return target; // eslint-disable-line consistent-return
}

/**
 * Assign a unique id to an object
 * @param {object} obj - Object that will be assigned id.
 * @returns {number} Stamped id
 * @memberof tui.util
 */
function stamp(obj) {
  if (!obj.__fe_id) {
    lastId += 1;
    obj.__fe_id = lastId; // eslint-disable-line camelcase
  }

  return obj.__fe_id;
}

module.exports = {
  extend,
  filter,
  forEach,
  forEachArray,
  forEachOwnProperties,
  inArray,
  isArray,
  isExisty,
  isFunction,
  isObject,
  isString,
  isUndefined,
  map,
  pick,
  stamp,
};
