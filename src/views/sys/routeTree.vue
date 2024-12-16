<template>
  <div>
    <!--    <template v-for="i in [3]">-->
    <!--      treeFull={{ treeFull && treeFull[i] && treeFull[i].children && treeFull[i].children}}-->
    <!--    </template>-->
    <el-tree
      ref="tree"
      :is-empty="false"
      :data="treeFull"
      :default-expanded-keys="listFull.filter(o=>o.type==='CATALOG').map(o=>o.code)"
      :default-checked-keys="routeCodes"
      :props="defaultProps"
      node-key="code"
      show-checkbox
      @check="handleCheck"
    />
  </div>
</template>

<script>
import CollUtil from '@/parent-ui/src/main/js/utils/CollUtil'

export default {
  name: 'RouteTree',
  props: {
    role: {},
    value: {}
  },
  data() {
    return {
      routeCodes: [], // 选中
      treeFull: [], // 全部树形权限列表
      listFull: [], // 全部树形权限列表
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        this.routeCodes = newVal.split(',')
      },
      deep: true
    },
    routeCodes: {
      handler(newVal, oldVal) {
        this.$emit('input', newVal && newVal.join((',')))
      },
      deep: true
    }
  },
  created() {
    this.getMenuTreeList()
    this.routeCodes = this.value && this.value.split(',') || []
  },
  methods: {
    // handleCheck(data, checkInfo) {
    //
    // },
    handleCheck(node, checkedKeys, indeterminateKeys) {
      this.updateParentState(node)
      this.$nextTick(() => {
        this.routeCodes = this.$refs['tree'].getCheckedKeys()
      })
    },
    updateParentState(node) {
      const parentNode = this.findParentNode(node)
      if (parentNode) {
        const parentChecked = parentNode.childNodes.every(child => child.checked)
        this.$refs.tree.setChecked(parentNode.data, parentChecked, true)
        this.updateParentState(parentNode.data)
      }
    },
    findParentNode(node) {
      const parentNode = this.$refs.tree.getNode(node.parent)
      return parentNode && parentNode.level > 0 ? parentNode : null
    },
    resetChecked() {
      this.$nextTick(() => {
        this.routeCodes = this.$refs['tree'].getCheckedKeys()
      })
    },
    async getMenuTreeList() {
      const res = await $$get('/commonData/selectPage/authRoute?pageSize=1000')
      this.listFull = res.records || []
      this.treeFull = CollUtil.listToTree(this.listFull)
    },
    // save() {
    //   this.value = this.$refs['tree'].getCheckedKeys()
    // },
    // buildTree(data) {
    //   const tree = []
    //   const map = {}
    //   // 创建一个映射表，将每个对象的 code 作为键
    //   data.forEach(item => {
    //     map[item.code] = item
    //     item.pcode = []
    //   })
    //   // 构建树结构
    //   data.forEach(item => {
    //     if (!item.pcode || item.pcode.length === 0) {
    //       // 如果 parentId 为 0，将当前节点添加到树的顶层
    //       tree.push(item)
    //     } else {
    //       // 否则，将当前节点添加到其父节点的 children 数组中
    //       if (map[item.pcode]) {
    //         map[item.pcode].children.push(item)
    //       }
    //     }
    //   })
    //
    //   return tree
    // }

  }
}
</script>
<style scoped>
.requiredPerm {
  color: #ff0e13;
}
</style>
