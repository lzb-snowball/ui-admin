<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
<!--      <div v-if="!mixin.isProd" class="el-submenu__title">-->
<!--        <a @click="$router.push('/baseTable')">通用表单</a>-->
<!--      </div>-->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
      >
        <template v-for="menu in menuTree">
          <div :key="menu.id" class="item">
            <sidebar-item :item="menu" :base-path="menu.componentPath || menu.url" />
<!--            <el-badge v-if="menuNoticeMap[menu.componentPath] && menuNoticeMap[menu.componentPath]!==1" :value="menuNoticeMap[menu.componentPath]" />-->
<!--            <el-badge v-if="menuNoticeMap[menu.componentPath] && menuNoticeMap[menu.componentPath]===1" is-dot />-->
            <!--            <el-badge v-if="menu.name === '代办列表' && todoNumber > 0" :value="todoNumber" :max="10"/>-->
          </div>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
// import {mapGetters} from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...Vuex.mapState(['menuTree', 'authRouteList']),
    ...Vuex.mapGetters([
      // 'todoNumber',
      // 'menuTree',
      'sidebar'
    ]),
    activeMenu() {
      const path = this.$route.path
      let list = this.authRouteList.filter(route => route.componentPath === path);
      return list.length ? list[0].id : null
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  data() {
    return {
    }
  },
}
</script>
<style scoped>
.item {
  position: relative;
}

</style>
