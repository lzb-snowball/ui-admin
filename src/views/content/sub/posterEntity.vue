<template>
  <!--
  delete from auth_route where id in (10001,10002,10003);
  INSERT INTO `auth_route` (`id`, `create_time`, `update_time`, `deleted`, `parent_id`, `type`, `name`, `url`, `regular`, `perms`, `icon`, `component_path`, `view_path`, `ext`, `sort`, `enabled`) VALUES
  (10001, '2023-12-20 00:00:00', '2023-12-20 00:00:00', 0, 1000, 2, '文章内容可引用时实体', '/poster/posterEntity', '', 'posterEntity:page', '', '', '', '', 1, 1),
  (10002, '2023-12-20 00:00:00', '2023-12-20 00:00:00', 0, 1000, 3, '文章内容可引用时实体保存', '', '', 'posterEntity:save', '', '', '', '', 10, 1),
  (10003, '2023-12-20 00:00:00', '2023-12-20 00:00:00', 0, 1000, 4, '文章内容可引用时实体删除', '', '', 'posterEntity:deleteById', '', '', '', '', 10, 1)
  ;
-->
  <div class="app-container">
    <zparent :is-edit="true">
      <zinput v-model="posterEntityListQuery.label" placeholder="名称" />
      <zinput v-model="posterEntityListQuery.dataKey" placeholder="取值key" />
      <zinput v-model="posterEntityListQuery.entityClass" placeholder="实体类" />
      <zdatepicker v-model="posterEntityDateRange" size="small" />
      <el-button type="primary" icon="el-icon-search" @click="posterEntitySearch">查询</el-button>
      <el-button v-if="hasPerm('posterEntity', 'insert')" type="primary" icon="el-icon-plus" @click="posterEntityHandleAdd">添加</el-button>
    </zparent>
    <el-table
      v-loading="posterEntityListLoading"
      :is-edit="false"
      :data="posterEntitys"
      :header-cell-style="posterEntityHandleTheadStyle"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort="posterEntityChangeSort"
      @sort-change="posterEntityChangeSort"
    >
      <el-table-column
        label="名称"
        prop="label"
        align="center"
        :width="null"
      >
        <template v-slot="scope">
          <zinput v-model="scope.row.label" />
        </template>
      </el-table-column>
      <el-table-column
        label="取值key"
        prop="dataKey"
        align="center"
        :width="null"
      >
        <template v-slot="scope">
          <zinput v-model="scope.row.dataKey" />
        </template>
      </el-table-column>
      <el-table-column
        label="实体类"
        prop="entityClass"
        align="center"
        :width="null"
      >
        <template v-slot="scope">
          <zinput v-model="scope.row.entityClass" />
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        label="创建时间"-->
<!--        prop="createTime"-->
<!--        align="center"-->
<!--        :width="150"-->
<!--      >-->
<!--        <template v-slot="scope">-->
<!--          <zinput v-model="scope.row.createTime" w="150" />-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button v-if="hasPerm('posterEntity', ['insert','update'])" size="mini" type="primary" @click="posterEntityHandleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="hasPerm('posterEntity','delete')" size="mini" type="danger" @click="()=>{posterEntitys.remove(scope.row);$emit('update:list',posterEntitys)}">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pa-4"
      :total="posterEntityTotal"
      :current-page.sync="posterEntityListQuery.curPage"
      :page-size.sync="posterEntityListQuery['pageSize']"
      v-bind="$attrs"
      align="center"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="posterEntityPage"
      @current-change="posterEntityPage"
    />

    <el-dialog v-if="posterEntityDialogFormVisible" title="文章内容可引用时实体" :visible.sync="posterEntityDialogFormVisible" :is-edit="true" width="80%" append-to-body>
      <el-form ref="posterEntityDataForm" :rules="posterEntityRules" :model="posterEntityFormObj" label-position="left" label-width="160px" style="margin: 0 5%;">
        <el-form-item label="名称" prop="label">
          <zinput
            v-model="posterEntityFormObj.label"
          />
        </el-form-item>
        <el-form-item label="取值key" prop="dataKey">
          <zinput
            v-model="posterEntityFormObj.dataKey"
          />
        </el-form-item>
        <el-form-item label="实体类" prop="entityClass">
          <zinput
            v-model="posterEntityFormObj.entityClass"
          />
        </el-form-item>
<!--        <el-form-item label="创建时间" prop="createTime">-->
<!--          <zdatetime-->
<!--            v-model="posterEntityFormObj.createTime"-->
<!--            w="200"-->
<!--            :disabled="true"-->
<!--          />-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="posterEntityDialogFormVisible = false">取消</el-button>
        <el-button v-if="hasPerm('posterEntity',['insert','update'])" type="primary" @click="posterEntitySave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Zinput from "@/parent-ui/src/main/ui-element/zinput.vue";
import Zdatepicker from "@/parent-ui/src/main/ui-element/zdatepicker.vue";

export default {
  name: 'PosterEntity',
  components: {Zdatepicker, Zinput},
  filters: {
  },
  props: {
    list: Array,
  },
  data() {
    return {
      posterEntityDefault: {
        'label': '',
        'dataKey': '',
        'entityClass': '',
      },
      posterEntitys: [],
      posterEntityTotal: 0,
      posterEntityListLoading: false,
      posterEntityDateRange: [null, null],
      posterEntityListQuery: {
        'label': '',
        'dataKey': '',
        'entityClass': '',
        curPage: 1,
        pageSize: 20
      },
      posterEntityFormObj: { enabled: true },
      posterEntityFormOption: '',
      posterEntitySortMap: {},
      posterEntityDialogFormVisible: false,
      posterEntityRules: {
        // 'label': [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        // 'dataKey': [{ required: true, message: '取值key不能为空', trigger: 'blur' }],
        // 'entityClass': [{ required: true, message: '实体类不能为空', trigger: 'blur' }],
      }
    }
  },
  computed: {
  },
  async beforeRouteEnter(to, from, next) {
    // await store.dispatch('common/dictListComputeIfAbsent','sysStaffPosition')
    next((vm) => {
      // access to component public instance via `vm`
    })
  },
  created() {
    this.posterEntitys = this.list
    // this.posterEntityPage()
  },
  methods: {
    /**
     * 设置表头排序
     */
    posterEntityHandleTheadStyle({ row, column, rowIndex, columnIndex }) {
      const props = Object.keys(this.posterEntitySortMap)
      for (const prop of props) {
        if (prop === column.property) {
          column.order = this.posterEntitySortMap[prop]
        }
      }
    },
    posterEntityChangeSort(e) {
      if (e.order) {
        this.posterEntitySortMap[e.prop] = e.order
      } else {
        delete this.posterEntitySortMap[e.prop]
      }
      this.posterEntityPage()
    },
    async posterEntityPage() {
      // let map = this.posterEntitySortMap;
      //
      // this.posterEntityListLoading = true
      // if (this.posterEntityDateRange && this.posterEntityDateRange.length === 2) {
      //   this.posterEntityListQuery.start = this.posterEntityDateRange[0]
      //   this.posterEntityListQuery.end = this.posterEntityDateRange[1]
      // }
      // this.posterEntityListQuery.orders = Object.keys(map).filter(key=>map[key]).map(key=>{ return {column: key, asc: map[key] === 'ascending'} })
      // const data = await this.$page('posterEntity', this.posterEntityListQuery)
      // this.posterEntitys = data.records
      // this.posterEntityTotal = parseInt(data.total)
      // this.posterEntityListLoading = false
    },
    posterEntitySearch() {
      this.posterEntityListQuery.curPage = 1
      this.posterEntityPage()
    },

    posterEntityHandleAdd() {
      this.posterEntityFormOption = 'add'
      this.posterEntityFormObj = { ...this.posterEntityDefault }
      this.posterEntityDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs
          ['posterEntityDataForm'].clearValidate()
      })
    },
    posterEntityHandleUpdate(row) {
      this.posterEntityFormOption = 'update'
      // this.posterEntityFormObj = Object.assign({}, row)
      this.posterEntityFormObj = row
      this.posterEntityDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs
          ['posterEntityDataForm'].clearValidate()
      })
    },
    posterEntitySave() {
      // $a.b再加左括号,会velocity模板语法错误
      this.$refs
        ['posterEntityDataForm']
        .validate((valid) => {
          if (valid) {
            if (this.posterEntityFormOption === 'add') {
              const temp = Object.assign({}, this.posterEntityFormObj)
              this.posterEntitys.push(temp)
            }
            // this.$saveOrUpdate('posterEntity', temp).then(() => {
            //   this.posterEntityDialogFormVisible = false
            //   this.$message.success('保存成功')
            //   this.posterEntityPage()
            // })
            this.$emit('update:list', this.posterEntitys)
            this.posterEntityDialogFormVisible = false
          }
        })
    },
    posterEntityHandleDelete(id) {
      this.$confirm('确认删除文章内容可引用时实体?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$deleteById('posterEntity', id).then(() => {
          this.$message.success('删除成功')
          this.posterEntityPage()
        })
      })
    },
    posterEntityChangeState(row) {
      this.$updateById('posterEntity', row).then(() => {
        this.posterEntityDialogFormVisible = false
        this.$message.success('保存成功')
      })
    },
    hasPerm(){
      return true
    },
  }
}
</script>
