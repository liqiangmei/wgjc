/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
import QS from 'qs';  // qs 模块是安装 axios 模块的时候就有的，不用另行安装，通过 import 引入即可使用
import { Loading, Message } from "element-ui";
import store from '../store/index'

// 环境的切换
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = 'http://192.168.1.61:8080';
}else if (process.env.NODE_ENV == 'debug') {
  axios.defaults.baseURL = 'https://www.ceshi.com';
}else if (process.env.NODE_ENV == 'production') {
  axios.defaults.baseURL = 'https://www.production.com';
}

let loadingInstance;

// 请求超时时间
axios.defaults.timeout = 10000;
 
// post请求头
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
 
// 请求拦截器（请求前的拦截）
axios.interceptors.request.use(
  config => {
    // ==========  所有请求之前都要执行的操作  ==============  
    loadingInstance  = Loading.service({  // 加载loading
      fullscreen: true, 
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)' 
    });
    
    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = store.state.token;
    token && (config.headers.Authorization = token);

    // 判断为post请求，序列化传来的参数
    /*config.method === 'post' 
      ? config.data = qs.stringify({...config.data}) 
      : config.params = {...config.params};*/ 

    return config;    
  },
  error => { 
    // ==================  错误处理  ====================   
    loadinginstace.close();  // 响应成功关闭loading
    Message.error({
      message: '退出登陆',
      onClose: function () {
        //关闭时的回调函数, 参数为被关闭的 message 实例
        router.push({name: 'error-404'});
      }
    }) 
    return Promise.reject(error);    
  }
)
 
// 响应拦截器
axios.interceptors.response.use(  
  // ==============  所有请求完成后都要执行的操作  ==================  
  response => {  
    loadinginstace.close();  // 响应成功关闭loading
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误       
    if (response.status === 200) {            
      return Promise.resolve(response);        
    }else {            
      return Promise.reject(response);        
    }    
  },
  // 服务器状态码不是200的情况    
  error => {    
    loadinginstace.close();  // 响应成功关闭loading    
    if (error.response.status) {            
        switch (error.response.status) {                
            // 401: 未登录                
            // 未登录则跳转登录页面，并携带当前页面的路径                
            // 在登录成功后返回当前页面，这一步需要在登录页操作。                
            case 401:  
                Message.error({
                  message: '未授权，请登录',
                  onClose: function () {
                    router.replace({                        
                        path: '/login',                        
                        query: { redirect: router.currentRoute.fullPath } 
                    });
                  }
                })                  
                break;
            // 403 token过期                
            // 登录过期对用户进行提示                
            // 清除本地token和清空vuex中token对象                
            // 跳转登录页面                
            case 403:                     
                Message.error({                        
                    message: '登录过期，请重新登录',
                    onClose: function () {
                      // 清除token                    
                      localStorage.removeItem('token');                    
                      store.commit('loginSuccess', null); 
                      // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                      router.replace({                            
                          path: '/login',                            
                          query: { redirect: router.currentRoute.fullPath }                        
                      });  
                    }                                                                 
                });                                                         
                break; 
            // 404请求不存在                
            case 404:                    
                Message.error({                        
                    message: '网络请求不存在'                 
                });                    
            break;                
            // 其他错误，直接抛出错误提示                
            default:                    
                Message.error({                        
                    message: error.response.data.message,                                         
                });            
        }            
        return Promise.reject(error.response);        
    }       
  }
);

/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url,params={}){
  return new Promise((resolve,reject) => {
    axios.get(url,{
      params:params
    })
    .then(res => {
      resolve(res.data);
    })
    .catch(err => {
      reject(err)
    })
  })
}


/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url,data={}){
  return new Promise((resolve,reject) => {
    axios.post(url, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',  // 转换为key=value的格式必须增加content-type
      }
    })
    .then(res => {
      resolve(res.data);
    })
    .catch((error) => {
      reject(error);
    })
  })
}

/**
 * 封装文件上传请求
 */
/*export function uploadFile(url, data, handle) {
  let instance = axios.create({
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  instance.post(url, data).then(res => {
    handle(res.data);
  }).catch(error => {
    console.log(error);
  })
}*/

export function fileUpload(url,data) {
  return new Promise((resolve, reject) => {
    //根据data对象生成FormData对象
    var temp = new FormData();
    for (var i in data) {
      temp.append(i, data[i]);
    }
    axios.post(url, temp,{
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then(res => {
      resolve(res.data);
    })
    .catch((error) => {
      reject(error);
    })
  })
}