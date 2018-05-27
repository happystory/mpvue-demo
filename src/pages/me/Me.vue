<template>
  <div class="container">
    <div class="userinfo">
      <img :src="userinfo.avatarUrl" alt="avatar">
      <p>{{userinfo.nickName}}</p>
    </div>

    <YearProgress></YearProgress>

    <button v-if='userinfo.nickName' @click='scanBook' class='btn'>添加图书</button>
    <button v-else open-type="getUserInfo" lang="zh_CN" class='btn' @getuserinfo="doLogin">点击登录</button>
  </div>
</template>

<script>
import qcloud from 'wafer2-client-sdk'
import config from '@/config'
import util from '@/util'
import YearProgress from '@/components/YearProgress'

export default {
  components: {
    YearProgress
  },
  data () {
    return {
      avatarUrl: '../../../static/img/unlogin.png',
      nickName: '',
      // 用户信息
      userinfo: {}
    }
  },
  created () {
    const user = wx.getStorageSync('userinfo')
    if (user) {
      this.userinfo = user
      console.log(this.userinfo)
    }
  },
  methods: {
    scanBook () {
      wx.scanCode({
        success: (res) => {
          if (res.result) {
            // this.addBook(res.result)
            console.log(res.result)
          }
        }
      })
    },
    doLogin (options) {
      var that = this;
      console.log(1)
      wx.login({
        success: function (loginResult) {
          var loginParams = {
            code: loginResult.code,
            encryptedData: options.mp.detail.encryptedData,
            iv: options.mp.detail.iv,
          }
          qcloud.setLoginUrl(config.loginUrl)
          qcloud.requestLogin({
            loginParams,
            success() {
              util.showSuccess('登录成功')
              that.userinfo = options.mp.detail.userInfo
              wx.setStorageSync('userinfo', options.mp.detail.userInfo)
            },
            fail(error) {
              // util.showModel('登录失败', error)
              console.log(登录失败, error)
            }
          });
        },
        fail: function (loginError) {
          // util.showModel('登录失败', loginError)
          console.log('登录失败', '2', loginError)
        },
      });
    }
  }
}
</script>

<style>
.container{
  padding:0 30rpx;
}

.userinfo{
  margin-top:100rpx;
  text-align:center;
}

.userinfo img{
  width: 150rpx;
  height:150rpx;
  margin: 20rpx;
  border-radius: 50%;
}
</style>
