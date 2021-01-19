/* eslint-disable */
export default {
  required: (mes = "此项必填", trigger = "blur") => {
    // 必填验证
    return {
      required: true,
      message: mes,
      trigger: trigger
    };
  },
  $length: (len = 1, trigger = "blur") => {
    // 固定长度
    return {
      len: len,
      message: "长度必须为" + len,
      trigger: trigger
    };
  },
  len: (min = 1, max = 255, trigger = "blur") => {
    // 长度验证
    return {
      min: min,
      max: max,
      message: "长度为" + min + "-" + max,
      trigger: trigger
    };
  },
  $min: (min:number) => {
    // 验证数字最小值
    const reg = /^\d+$/;
    const va = (rule, value:string, callback) => {
      if (reg.test(value)) {
        if (Number(value)  > min) {
          callback();
        } else {
          callback(new Error("请输入大于" + min + "的值"));
        }
      } else {
        callback(new Error("请输入正整数"));
      }
    };
    return {
      validator: va,
      trigger: "blur"
    };
  },

  min: (min = 1, message = `最小长度为${min}`, trigger = "blur") => {
    return {
      min: min,
      message: message,
      trigger: trigger
    };
  },
  max: (max = 255, message = `最大长度为${max}`, trigger = "blur") => {
    return {
      max: max,
      message: message,
      trigger: trigger
    };
  },
  type: (
    type = "string",
    message = `输入的类型必须为${type}`,
    trigger = "blur"
  ) => {
    return {
      type: type,
      message: message,
      trigger: trigger
    };
  },

  password: (callback:object) => {
    return {
      validator: callback,
      trigger: "blur"
    };
  },
  custom: (callback:object, trigger = "blur") => {
    return {
      validator: callback,
      trigger: trigger
    };
  },
  email: () => {
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const va = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的邮箱地址"));
      }
    };
    return {
      validator: va,
      trigger: "blur"
    };
  },
  english: () => {
    const reg = /^\w+$/;
    const va = (rule, value, callback) => {
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("只能输入字母，数字,下划线"));
      }
    };
    return {
      validator: va,
      trigger: "blur"
    };
  },
  capital: () => {
    // 大写字母验证
    const reg = /^[0-9A-Z]*$/;
    const va = (rule, value, callback) => {
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入大写字母"));
      }
    };
    return {
      validator: va,
      trigger: "blur"
    };
  },
  phone: () => {
    // 手机号码验证
    const reg = /^1[3456789]\d{9}$/;
    const va = (rule, value, callback) => {
      if (value === "") {
        callback();
      }
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号码"));
      }
    };
    return {
      validator: va,
      trigger: "blur"
    };
  },
  float: (message = "请输入合法的数字", trigger = "blur") => {
    const reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
    const va = (rule, value, callback) => {
      if (value === null || value === "") {
        callback();
      }
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error(message));
      }
    };
    return {
      validator: va,
      trigger: trigger
    };
  },
  // 两位小数
  decimal: (message = "请输入最多两位小数", trigger = "blur") => {
    const reg = /^(([0-9]*)|(([0]\.\d{1,2}|[0-9]*\.\d{1,2})))$/;
    const va = (rule, value, callback) => {
      if (value === null || value === "") {
        callback();
      }
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error(message));
      }
    };
    return {
      validator: va,
      trigger: trigger
    };
  },
  //
  number: (message = "请输入合法的数字", trigger = "blur") => {
    const reg = /^[0-9]\d*$/;
    const va = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else if (reg.test(value)) {
        callback();
      } else {
        callback(new Error(message));
      }
    };
    return {
      validator: va,
      trigger: trigger
    };
  },
  url: (message = "请输入正确的网址", trigger = "blur") => {
    // const reg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/;
    const reg = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
    const va = (rule, value, callback) => {
      if (value === "") {
        callback();
      }
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error(message));
      }
    };
    return {
      validator: va,
      trigger: trigger
    };
  }
};
