import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import Vue from 'vue'

let device_type = 'pc'
let u = navigator.userAgent;
if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
  device_type =  'ios';
}
import querystring from 'querystring';

import store from '@/store'

// create an axios instance
const service = axios.create({
  // baseURL: '/api/v1/1',
    baseURL:store.state.baseUrl+'/api/admins',//正式环境


    // withCredentials: true, // 当跨域请。求时发送cookie
  timeout: 300000 // 请求超时
})



// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // config.headers['device_type'] =device_type
    // config.headers['transatction_id'] =device_type
    // config.headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8"
    // config.headers['Content-Type'] = "application/x-www-form-urlencoded"

    let accessToken=store.state.userInfo.accessToken
    if (accessToken) {
      // 让每个请求携带 token
      config.headers['accesstoken'] =accessToken
    }
    config.headers['weapp']=store.state.userInfo.weapp
    // if (Object.prototype.toString.call(config.data) != '[object FormData]') {
    //   config.data = querystring.stringify(config.data)
    // }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // console.log(res)



    // 如果状态码不是200，则判断为错误
    if(res.code == 200){
      return res
    } else if (res.code === 401) {
      store.dispatch('logout')
      Vue.prototype.$Message.error("登陆已过期，请重新登陆");
      return res
      // return Promise.reject(res.msg || 'error')
    }else if(res.code == 500){
      Vue.prototype.$Message.error(res.msg||"操作失败");
      return res
      // return Promise.reject(res.msg || 'error')
    }else if(res.code == 0){
      Vue.prototype.$Message.error(res.msg||"操作失败");
      return res
      // return Promise.reject(res.msg || 'error')
    }else{
      return res
    }
  },
  error => {
    console.log(error) // for debug
    // Toast('系統異常')
    // removeToken()
    // window.location.href='/'

    return Promise.reject(error)
  }
)

export default service
