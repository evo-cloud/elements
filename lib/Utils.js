var _ = require('underscore');

function arraySort(a, key) {
    // for built-in Array.sort without a compareFn, it compares integers as strings
    return key == null ? a.slice().sort(function (x, y) { return x < y ? -1 : (x > y ? 1 : 0); })
                       : _.sortBy(a, function (elem) { return elem[key]; });
}

/** @function
 * @description Find the difference between arrays.
 *
 * @param {Array} arr1    the first array
 * @param {Array} arr2    the second array
 * @param {Object} opts   options
 *                        - sorted: two array already sorted
 *                        - key: if present elements in array is objects, compare with key
 *                        - common: if true, "d3" will be present in result
 * @returns [d1, d2, d3]  d1 is an array of elements only present in arr1
 *                        d2 is an array of elements only present in arr2
 *                        d3 is present only when common = true, and is an array of elements in common
 */
function arrayDiff(arr1, arr2, opts) {
    var sorted = opts && opts.sorted;
    if (!sorted) {
        arr1 = arraySort(arr1, opts && opts.key);
        arr2 = arraySort(arr2, opts && opts.key);
    }
    var common = opts && opts.common ? [] : null;
    var val = opts && opts.key ? function (v) { return v[opts.key]; } : function (v) { return v; };
    var a = [{ id: 0, arr: arr1.slice(), i: 0 }, { id: 1, arr: arr2.slice(), i: 0 }];
    var a0 = a[0], a1 = a[1], equalCount = 0;
    while (a0.i< a0.arr.length && a1.i < a1.arr.length) {
        if (val(a0.arr[a0.i]) == val(a1.arr[a1.i])) {
            equalCount ++;
            a0.i ++;
            a1.i ++;
        } else {
            if (equalCount > 0) {
                a0.i -= equalCount;
                a1.i -= equalCount;
                common && (common = common.concat(a0.arr.slice(a0.i, a0.i + equalCount)));
                a0.arr.splice(a0.i, equalCount);
                a1.arr.splice(a1.i, equalCount);
                equalCount = 0;
            }
            var v0 = val(a0.arr[a0.i]), v1 = val(a1.arr[a1.i]);
            if (v0 > v1) {
                a1.i ++;
                a0 = a[1 - a0.id];
                a1 = a[1 - a1.id];
            } else {
                a0.i ++;
            }
        }
    }
    if (equalCount > 0) {
        common && (common = common.concat(a0.arr.slice(a0.i - equalCount, a0.i)));
        a0.arr.splice(a0.i - equalCount, equalCount);
        a1.arr.splice(a1.i - equalCount, equalCount);
    }
    var result = [a[0].arr, a[1].arr];
    common && result.push(common);
    return result;
}

/** @function
 * @description Remove keys unspecified
 */
function reserveKeysOnly(object, keys) {
    if (Array.isArray(keys)) {
        var diff = arrayDiff(Object.keys(object), keys);
        for (var i in diff[0]) {
            delete object[diff[0][i]];
        }
    }
    return object;
}

module.exports = {
    sort: arraySort,
    diff: arrayDiff,
    onlyKeys: reserveKeysOnly
};
