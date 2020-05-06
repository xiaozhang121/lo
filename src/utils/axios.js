import axios from 'axios'
import { Loading } from 'element-ui'
let loadingInstance = null
class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
    this.queue = {}
  }

  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'same-origin',
      withCredentials: true
    }
    // if (user.state.token) {
    //   config.headers.Authorization = user.state.token
    // }
    return config
  }

  distroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // 加载停止
      loadingInstance.close()
    }
  }

  interceptors (instance, url) {
    const that = this
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(that.queue).length) {
        // 加载开始
        loadingInstance = Loading.service({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0)'
        })
      }
      that.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.distroy(url)
      const body = res.data
      const code = body.code || body.errorCode
      // console.log('返回参数的类型=', typeof body)
      if (typeof body === 'string' && !code) {
        const data = body.data
        return { data }
      }
      if (code === 200) {
        const data = JSON.parse(JSON.stringify(body.data))
        const msg = body.msg || body.errorMessage
        return { data, code, msg }
      }
      if (code !== 200) {
        const data = body.data
        const msg = body.msg || body.errorMessage
        return { data, code, msg }
      }
    }, error => {
      this.distroy(url)
      console.log('网络故障')
      // return Promise.reject(error)
      return new Promise((resolve, reject) => {
        if (error.request.status === 401) {
          console.log('401')
        } else if (error.request.status === 500) {
          console.log('500')
        } else {
          console.log('404')
        }
        reject(error)
      })
    })
  }

  request (options) {
    const instance = axios.create()
    let data = {}
    if (options.params || options.data) {
      const dataObj = options.params ? options.params : options.data
      if (!(options.data instanceof FormData)) {
        data = Object.assign(dataObj, dataObj)
        if (options.method === 'post' || options.method === 'put') {

        }
      } else {
        data = dataObj
      }
    }
    if (options.method === 'get') {
      options.params = data
    } else {
      options.data = data
    }
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
