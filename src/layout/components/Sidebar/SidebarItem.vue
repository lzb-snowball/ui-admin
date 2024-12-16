<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <!--    <template v-if="hasOneShowingChild(item.children,item) || empty(item.children)">-->
    <template v-if="!(item.children && item.children.length)">
      <app-link :to="item.componentPath || item.url">
        <el-menu-item :index="item.id" :class="{'submenu-title-noDropdown':!isNest}" @click.native="$store.commit('setState',{key:`${getEntityClass(item)}s`, value:null})">
          <item :icon="item.icon" :title="item.name" :number="item.number"/>
          <el-badge class="mr-2" v-if="$store.get(`${getEntityClass(item)}s`)" is-dot/>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="item.id" popper-append-to-body>
      <template slot="title">
        <item :icon="item.icon" :title="item.name"/>
      </template>
      <sidebar-item
          v-for="child in item.children"
          :key="child.id"
          :is-nest="true"
          :item="child"
          class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import {isExternal} from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: {Item, AppLink},
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    // this.onlyOneChild = null
    return {}
  },
  methods: {
    getEntityClass(item) {
      const componentPath = item.componentPath
      return this.StrUtil.upperFirst(componentPath.substring(componentPath.lastIndexOf('/') + 1))
    },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => item.hidden)
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // // Show parent if there are no child router to display
      // if (showingChildren.length == 0) {
      //   this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
      //   return true
      // }

      return false
    },
  }
}
</script>
