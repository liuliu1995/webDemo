/**
 * author 刘流
 * created 2019-10-29
 * js错误提示依赖jquery和layer
 */
/* 验证输入框非空 */
function ckIsNull($input, msg) {
    let val = $input.val();
    if (val == "") {
        layer.tips(msg + "不能为空！", $input, {
            tips: [3, '#333'],
            time: 1500
        });
        return false
    } else {
        return true
    }
}
/* 验证手机号码 */
function ckIsPhone($input) {
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if ($input.val() == '') {
        layer.msg("手机号不能为空！")
        return false;
    } else {
        if (!myreg.test($input.val())) {
            layer.tips('您输入的手机号不合法，请重新输入！', $input, {
                tips: [3, '#333'],
                time: 1500
            });
            $input.val("");
            return false;
        } else {
            return true;
        }
    }
}
//移动端虚拟键盘问题
function hideKeyboard(id) {
    $(id).blur(function() {
        setTimeout(function() {
            let scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
            window.scrollTo(0, Math.max(scrollHeight - 1, 0));
        }, 100)
    })
}
/* 获取地址栏的参数 
  let key = getUrlParms("key");
*/
function getUrlParms(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
/**
 * 函数节流方法
 * @param Function fn 延时调用函数
 * @param Number delay 延迟多长时间
 * @param Number atleast 至少多长时间触发一次
 * @return Function 延迟执行的方法
 */
var throttle = function(fn, delay, atleast) {
    var timer = null;
    var previous = null;

    return function() {
        var now = +new Date();

        if (!previous) previous = now;

        if (now - previous > atleast) {
            fn();
            // 重置上一次开始时间为本次结束时间
            previous = now;
        } else {
            clearTimeout(timer);
            timer = setTimeout(function() {
                fn();
            }, delay);
        }
    }
};
/**
 * 防抖函数
 * @param func 用户传入的防抖函数
 * @param wait 等待的时间
 * @param immediate 是否立即执行
 */
const debounce = function(func, wait = 50, immediate = false) {
    // 缓存一个定时器id
    let timer = null;
    let result;
    let debounced = function(...args) {
        // 如果已经设定过定时器了就清空上一次的定时器
        if (timer) clearTimeout(timer);
        if (immediate) {
            let callNow = !timer;
            //等待wait的时间间隔后，timer为null的时候，函数才可以继续执行
            timer = setTimeout(() => {
                timer = null;
            }, wait);
            //未执行过，执行
            if (callNow) result = func.apply(this, args);
        } else {
            // 开始一个定时器，延迟执行用户传入的方法
            timer = setTimeout(() => {
                //将实际的this和参数传入用户实际调用的函数
                func.apply(this, args);
            }, wait);
        }
        return result;
    };
    debounced.cancel = function() {
        clearTimeout(timer);
        timer = null;
    };
    // 这里返回的函数时每次用户实际调用的防抖函数
    return debounced;
};