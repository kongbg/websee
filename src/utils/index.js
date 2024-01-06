// 深拷贝
export const deepClone = (target, hash = new WeakMap) => {
    let result;
    let type = checkedTypeFn(target);
    if(type === 'object') result = {};
    else if(type === 'array') result = [];
    else  return target;
    if(hash.get(target)) return target;

    let copyObj = new target.constructor();
    hash.set(target, copyObj)
    for (let key in target) {
        if(checkedTypeFn(target[key]) === 'object' || checkedTypeFn(target[key]) === 'array') {
            result[key] = deepClone(target[key], hash);
        } else {
            result[key] = target[key];
        }
    }
    function checkedTypeFn (target) {
        return Object.prototype.toString.call(target).replace(/\[object (\w+)\]/, "$1").toLowerCase();
    }
    return result;
}

