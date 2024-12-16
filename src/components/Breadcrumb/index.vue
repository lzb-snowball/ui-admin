<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item) in levelList" :key="item.code">
        <span>{{ item.name }}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import CollUtil from '@/parent-ui/src/main/js/utils/CollUtil'

export default {
  data() {
    return {
      menuMap: {},
      menuPathMap: {},
      levelList: []
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    const list = this.$store.get('authRouteList')
    this.menuMap = CollUtil.listToMap(list, 'code')
    this.menuPathMap = CollUtil.listToMap(list, 'componentPath')
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      let currMenu = this.menuPathMap[this.$route.path]
      this.levelList = []
      while (currMenu) {
        this.levelList.unshift(currMenu)
        currMenu = this.menuMap[currMenu.pcode]
        if (!currMenu) {
          break
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
