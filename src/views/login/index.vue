<template>
  <div class="login-container">
    <div class="header">
      <div class="full-width pa-2 d-flex justify-end">
        <language style="width: 70px;" size="small"></language>
      </div>
    </div>
    <div class="content">
      <div class="title">{{mixin.appName==='agent'?$t('代理'):$t('管理员')}} {{$t('后台登录')}}</div>
      <!--      <HelloWorld />-->
      <!--      <div class="text-primary">main2={{new Main2()}}</div>-->
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
               label-position="left">
        <el-form-item prop="username">
          <span class="svg-container"><svg-icon icon-class="user"/></span>
          <el-input
              ref="username"
              v-model="loginForm.username"
              :placeholder="$t('用户名')"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
              @blur="getGoogleOpen"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container"><svg-icon icon-class="password"/></span>
            <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
               :placeholder="$t('密码')"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType == 'password' ? 'eye' : 'eye-open'"/>
            </span>
          </el-form-item>
        </el-tooltip>

        <el-form-item v-if="googleAuthenticatorFlag && loginForm.username !== 'developer'" prop="captcha">
          <span class="svg-container"><svg-icon icon-class="user"/></span>
          <el-input
              ref="captcha"
              v-model="loginForm.captcha"
              :placeholder="$t('谷歌验证码')"
              name="captcha"
              type="text"
              tabindex="1"
              autocomplete="on"
          />
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                   @click.native.prevent="handleLogin">{{$t('登录')}}
        </el-button>
      </el-form>

      <p class="copyright"><span>Copyright © 2022 See. All Rights Reserved.</span></p>

    </div>
  </div>
</template>

<script>
import Layout from '@/layout/index.vue'
import {login} from "@/parent-ui/src/main/business/common/init";
import ZselectAppend from "@/parent-ui/src/main/ui-element/zselectAppend.vue";
import mixinRouteView from "@/parent-ui/src/main/js/mixin/MixinRouteView";
import Zselect from "@/parent-ui/src/main/ui-element/zselect.vue";
import Language from "@/views/component/_language.vue";

export default {
  name: 'Login',
  mixins:[mixinRouteView],
  components: {
    Language,
    Zselect,
    ZselectAppend
    // HelloWorld
  },
  data() {
    return {
      types: 'username,password',
      // types: ['username','password'],
      Main2: {},
      // Main2:Main2,
      loginForm: {
        username: '',
        password: '',
        captcha: ''
      },
      loginRules: {
        username: [{required: true, message: '请输入登录账号', trigger: 'blur'}],
        password: [{required: true, message: '请输入登录密码', trigger: 'blur'}],
        captcha: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      googleAuthenticatorFlag: false
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.getGoogleOpen()
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
  },
  methods: {
    getGoogleOpen() {
      if (!this.loginForm.username) {
        return
      }
      $$get('/commonLogin/getGoogleAuthOpen', this.loginForm).then(res => {
        this.googleAuthenticatorFlag = res.data
      })
    },
    checkCapslock({shiftKey, key} = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async handleLogin() {
      const valid = await this.$refs.loginForm.validate()
      if (valid) {
        this.loading = true
        login(this.$store, this.loginForm,this.$router, Layout).then(async res => {
          this.loading = false
          this.$message.success('登录成功')
          this.$router.push({path: this.redirect || '/dashboard', query: this.otherQuery})
        }).finally(e => {
          this.loading = false
        })
      }
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .login-form{
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: #333;
        height: 47px;
        caret-color: #333;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }


  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    background: #fff;
    border: 1px solid #e5e5e5;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  //padding-top: 100px;
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  margin: 0;
  border: 0;
  //background-image: url('/static/login_bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  background-attachment: fixed;

  .content {
    .title {
      //margin: 0 auto 20px;
      margin: 50px auto;
      color: #fff;
      width: 400px;
      text-align: center;
      font-size: 30px;
    }

    .title-logo {
      width: 142px;
      height: 142px;
      margin: 0 auto 10px;
      /*background: url(//static.seecsee.com/seego_admin/static/media/logo-white.png) 50% no-repeat;*/
    }
  }

  .login-form {
    position: relative;
    width: 400px;
    max-width: 100%;
    padding: 35px;
    overflow: hidden;
    background: #fff;
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0 50px 100px 0 rgba(45, 65, 82, .56);
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  .copyright {
    color: #efefef;
    margin: 40px auto;
    text-align: center;
    font-size: 12px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }

  .code {
    ::v-deep.el-form-item__content {
      display: flex;
      padding: 5px;
    }
  }
}
</style>
