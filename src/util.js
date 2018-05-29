// 工具函数库
import config from './config'

export function get (url, data) {
  return request(url, 'GET', data)
}

export function post (url, data) {
  return request(url, 'POST', data)
}

export function request (url, method, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      method,
      data,
      url: config.host + url,
      success: res => {
        if (res.data.code === 0) {
          resolve(res.data.data)
        } else {
          showModal('操件失败', res.data.data.msg)
          reject(res.data.data)
        }
      }
    })
  })
}

export function showSuccess (text) {
  wx.showToast({
    title: text,
    icon: 'success'
  })
}

export function showModal (title, content) {
  wx.showModal({
    title,
    content,
    showCancel: false
  })
}

export default {
  get,
  post,
  showSuccess
}
