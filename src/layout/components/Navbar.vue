<template>
  <div class="navbar d-flex justify-between align-center">
    <div>
      <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    </div>

<!--    <div v-if="paramMap['SITE_RECHARGE_AMOUNT_OPEN'] === '1'" class="text-red">-->
<!--      <span>平台充值额度：</span>-->
<!--      <span class="ft-26 font-bold">{{ formatMoney(rechargeAmount) }}</span>-->
<!--    </div>-->
<!--    <div class="service_time">{{ serviceTime }}</div>-->

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!--<search id="header-search" class="right-menu-item" />-->

        <div class="right-menu-item hover-effect" @click="showNotice = true">
          <el-badge is-dot class="item" style="display: initial;">
            <el-icon class="el-icon-message-solid" />
          </el-badge>
        </div>
        <div class="right-menu-item hover-effect">
          <language style="width: 70px;" size="small"></language>
        </div>

<!--        <screenfull id="screenfull" class="right-menu-item hover-effect" />-->

        <!--<el-tooltip content="Global Size" effect="dark" placement="bottom">-->
        <!--<size-select id="size-select" class="right-menu-item hover-effect" />-->
        <!--</el-tooltip>-->

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper d-flex align-center">
          <img src="/static/admin.png" class="user-avatar mr-2">
          <span class="body-2">{{ loginInfo && ( loginInfo.username ) }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/sys/password">
            <el-dropdown-item>{{$t('修改密码')}}</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>{{$t('首页')}}</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{$t('注销')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

<!--      <el-dialog title="系统公告" :visible.sync="showNotice" width="80%" append-to-body>-->
<!--        <el-card v-for="(item,index) in noticeList" :key="index" class="box-card mb-2">-->
<!--          <div slot="header" class="clearfix">-->
<!--            <span class="text-red">{{ item.title }}</span>-->
<!--          </div>-->
<!--          <div v-html="item.content" />-->
<!--        </el-card>-->
<!--      </el-dialog>-->
    </div>
  </div>
</template>

<script>
// //import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import {logout} from "@/parent-ui/src/main/business/common/init";
import Language from "@/views/component/_language.vue";

export default {
  components: {
    Language,
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  data() {
    return {
      showNotice: false
    }
  },
  computed: {
    ...Vuex.mapState(['loginInfo']),

    ...Vuex.mapGetters([
      // 'rechargeAmount',
      // 'paramMap',
      'sidebar',
      'device',
      // 'account',
      // 'noticeList'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      logout(this.$store, this.$router, '/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding-left: 8px;
      padding-right: 8px;
      height: 100%;
      font-size: 20px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        /*margin-top: 5px;*/
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 20px;
          height: 20px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
