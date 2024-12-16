<template>
  <!--
    delete from auth_route where id in (10001,10002,10003);
    INSERT INTO `auth_route` (`id`, `create_time`, `update_time`, `deleted`, `parent_id`, `type`, `name`, `url`, `regular`, `perms`, `icon`, `component_path`, `view_path`, `ext`, `sort`, `enabled`) VALUES
    (10001, '2023-05-04 00:00:00', '2023-05-04 00:00:00', 0, 10000, 2, '', '/poster/posterCmd', '', 'posterCmd:page', '', '', '', '', 1, 1),
    (10002, '2023-05-04 00:00:00', '2023-05-04 00:00:00', 0, 10000, 3, '保存', '', '', 'posterCmd:save', '', '', '', '', 10, 1),
    (10003, '2023-05-04 00:00:00', '2023-05-04 00:00:00', 0, 10000, 4, '删除', '', '', 'posterCmd:deleteById', '', '', '', '', 10, 1)
    ;
  -->
  <div class="app-container">
    <!--    <zparent :is-edit="true">-->
    <!--      <zselect v-model="posterCmdListQuery.cmdType" classname="EnumPosterCmdType" placeholder="指令类型"/>-->
    <!--      <zinput v-model="posterCmdListQuery.title" placeholder="指令标题"/>-->
    <!--      <zinput v-model="posterCmdListQuery.value1" placeholder="取值传参点1"/>-->
    <!--      <zinput v-model="posterCmdListQuery.value2" placeholder="取值传参点2"/>-->
    <!--      <zdatepicker v-model="posterCmdDateRange" size="small"/>-->
    <!--      <el-button type="primary" icon="el-icon-search" @click="posterCmdSearch">查询</el-button>-->
    <!--    </zparent>-->
    <el-button type="primary" icon="el-icon-plus" @click="posterCmdHandleAdd">添加</el-button>
    <el-table
      v-loading="posterCmdListLoading"
      :is-edit="false"
      :data="posterCmds"
      :header-cell-style="posterCmdHandleTheadStyle"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort="posterCmdChangeSort"
      @sort-change="posterCmdChangeSort"
    >
      <el-table-column
        label="指令类型"
        prop="cmdType"
        align="center"
        :width="null"
      >
        <template slot-scope="scope">
          <zselect v-model="scope.row.cmdType" classname="EnumPosterCmdType" />
        </template>
      </el-table-column>
      <el-table-column
        label="指令标题"
        prop="title"
        align="center"
        :width="null"
      >
        <template slot-scope="scope">
          <zinput v-model="scope.row.title" />
        </template>
      </el-table-column>
      <el-table-column
        label="取值传参点1"
        prop="value1"
        align="center"
        :width="null"
      >
        <template slot-scope="scope">
          <zinput v-model="scope.row.value1" />
        </template>
      </el-table-column>
      <el-table-column
        label="取值传参点2"
        prop="value2"
        align="center"
        :width="null"
      >
        <template slot-scope="scope">
          <zinput v-model="scope.row.value2" />
        </template>
      </el-table-column>
      <el-table-column
        label="取值传参点3"
        prop="value3"
        align="center"
        :width="null"
      >
        <template slot-scope="scope">
          <zinput v-model="scope.row.value3" />
        </template>
      </el-table-column>
      <el-table-column
        label="排序"
        prop="sort"
        align="center"
        :width="null"
      >
        <template slot-scope="scope">
          <zinput v-model="scope.row.sort" />
        </template>
      </el-table-column>
      <!--      <el-table-column-->
      <!--          label="创建时间"-->
      <!--          prop="createTime"-->
      <!--          align="center"-->
      <!--          :width="150"-->

      <!--      >-->
      <!--        <template slot-scope="scope">-->
      <!--          <zinput v-model="scope.row.createTime" w="150"/>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--          v-if="hasPerm('posterCmd:save')"-->
          <el-button
            size="mini"
            type="primary"
            @click="posterCmdHandleUpdate(scope.row)"
          >编辑
          </el-button>
          <!--          v-if="hasPerm('posterCmd:deleteById')"-->
          <el-button
            size="mini"
            type="danger"
            @click="posterCmdHandleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pa-4"
      :total="posterCmdTotal"
      :current-page.sync="posterCmdListQuery.curPage"
      :page-size.sync="posterCmdListQuery['pageSize']"
      v-bind="$attrs"
      align="center"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="posterCmdPage"
      @current-change="posterCmdPage"
    />

    <el-dialog
      v-if="posterCmdDialogFormVisible"
      title=""
      :visible.sync="posterCmdDialogFormVisible"
      :is-edit="true"
      width="80%"
      append-to-body
    >
      <el-form
        ref="posterCmdDataForm"
        :rules="posterCmdRules"
        :model="posterCmdFormObj"
        label-position="left"
        label-width="160px"
        style="margin: 0 5%;"
      >
        <el-form-item label="指令类型" prop="cmdType">
          <zselect v-model="posterCmdFormObj.cmdType" classname="EnumPosterCmdType" />
        </el-form-item>
        <el-form-item label="指令标题" prop="title">
          <zinput
            v-model="posterCmdFormObj.title"
          />
        </el-form-item>
        <el-form-item label="取值传参点1" prop="value1">
          <zinput
            v-model="posterCmdFormObj.value1"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="取值传参点2" prop="value2">
          <zinput
            v-model="posterCmdFormObj.value2"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="取值传参点3" prop="value3">
          <zinput
            v-model="posterCmdFormObj.value3"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="属性校验规则" prop="ruleReg">
          <zinput
            v-model="posterCmdFormObj.ruleReg"
            placeholder="例如^01\d{9}$表示11位数字01开头"
          />
        </el-form-item>
        <el-form-item label="属性校验规则错误提示" prop="ruleErrorTip">
          <zinput
            v-model="posterCmdFormObj.ruleErrorTip"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <zinput
            v-model="posterCmdFormObj.sort"
            type="number"
          />
        </el-form-item>
        <!--        <el-form-item label="创建时间" prop="createTime">-->
        <!--          <zdatetime v-model="posterCmdFormObj.createTime" w="200"-->
        <!--                     :disabled="true"-->
        <!--          />-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="posterCmdDialogFormVisible = false">取消</el-button>
        <!--        v-if="hasPerm('posterCmd:save')"-->
        <el-button type="primary" @click="posterCmdSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'PosterCmd',
  components: { },
  filters: {},
  props: {
    value: {},
  },
  data() {
    return {
      posterCmdDefault: {
        'cmdType': 'copy',
        'title': '',
        'value1': '',
        'value2': '',
      },
      posterCmds: [],
      posterCmdTotal: 0,
      posterCmdListLoading: false,
      posterCmdDateRange: [null, null],
      posterCmdListQuery: {
        'cmdType': '',
        'title': '',
        // 'value1': '',
        // 'value2': '',
        // 'value3': '',
        curPage: 1,
        pageSize: 20
      },
      posterCmdFormObjOld: {},
      posterCmdFormObj: {
        enabled: true,
      },
      posterCmdFormOption: '',
      posterCmdSortMap: {},
      posterCmdDialogFormVisible: false,
      posterCmdRules: {
        'cmdType': [{ required: true, message: '指令类型不能为空', trigger: 'blur' }],
        // 'title': [{required: true, message: '指令标题不能为空', trigger: 'blur'}],
        // 'value1': [{required: true, message: '取值传参点1不能为空', trigger: 'blur'}],
        // 'value2': [{required: true, message: '取值传参点2不能为空', trigger: 'blur'}],
      }
    }
  },
  computed: {},
  async beforeRouteEnter(to, from, next) {
    // await store.dispatch('common/dictListComputeIfAbsent','sysStaffPosition')
    next((vm) => {
      // access to component public instance via `vm`
    })
  },
  watch: {
    posterCmds: {
      handler(newVal, oldVal) {
        this.$emit('input', JSON.stringify(newVal))
      },
      deep: true
      // immediate: true
    }
  },
  created() {
    // this.posterCmdPage()
    this.posterCmds = JSON.parse(this.value || '[]')
  },
  methods: {
    /**
     * 设置表头排序
     */
    posterCmdHandleTheadStyle({ row, column, rowIndex, columnIndex }) {
      const props = Object.keys(this.posterCmdSortMap)
      for (const prop of props) {
        if (prop === column.property) {
          column.order = this.posterCmdSortMap[prop]
        }
      }
    },
    posterCmdChangeSort(e) {
      if (e.order) {
        this.posterCmdSortMap[e.prop] = e.order
      } else {
        delete this.posterCmdSortMap[e.prop]
      }
      this.posterCmdPage()
    },
    async posterCmdPage() {
      // let map = this.posterCmdSortMap;
      //
      // this.posterCmdListLoading = true
      // if (this.posterCmdDateRange && this.posterCmdDateRange.length === 2) {
      //   this.posterCmdListQuery.start = this.posterCmdDateRange[0]
      //   this.posterCmdListQuery.end = this.posterCmdDateRange[1]
      // }
      // this.posterCmdListQuery.orders = Object.keys(map).filter(key => map[key]).map(key => {
      //   return {column: key, asc: map[key] === 'ascending'}
      // })
      // const data = await this.$page('posterCmd', this.posterCmdListQuery)
      // this.posterCmds = data.records
      // this.posterCmdTotal = parseInt(data.total)
      // this.posterCmdListLoading = false
    },
    posterCmdSearch() {
      this.posterCmdListQuery.curPage = 1
      this.posterCmdPage()
    },

    posterCmdHandleAdd() {
      this.posterCmdFormOption = 'add'
      this.posterCmdFormObj = { ...this.posterCmdDefault }
      this.posterCmdFormObjOld = null
      this.posterCmdDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs
          ['posterCmdDataForm'].clearValidate()
      })
    },
    posterCmdHandleUpdate(row) {
      this.posterCmdFormOption = 'update'
      this.posterCmdFormObjOld = row
      this.posterCmdFormObj = Object.assign({}, row)
      this.posterCmdDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs
          ['posterCmdDataForm'].clearValidate()
      })
    },
    posterCmdSave() {
      // $a.b再加左括号,会velocity模板语法错误
      this.$refs
        ['posterCmdDataForm']
        .validate((valid) => {
          if (valid) {
            const temp = Object.assign({}, this.posterCmdFormObj)
            if (this.posterCmdFormOption === 'update') {
              for (const key of Object.keys(this.posterCmdFormObj)) {
                const val = this.posterCmdFormObj[key]
                this.$set(this.posterCmdFormObjOld, key, val)
              }
            } else {
              this.posterCmds.push(this.posterCmdFormObj)
            }
            this.posterCmdDialogFormVisible = false
            let posterCmds = this.posterCmds
            posterCmds = posterCmds.sort((a, b) => a.sort && b.sort ? a.sort - b.sort : 0)
            this.posterCmds = []
            this.$nextTick(() => {
              this.posterCmds = posterCmds
            })
            console.log('posterCmds', this.posterCmds)
          }
        })
    },
    posterCmdHandleDelete(row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.posterCmds.remove(row)
        // this.$deleteById('posterCmd', id).then(() => {
        //   this.$message.success('删除成功')
        //   this.posterCmdPage()
        // })
      })
    },
    posterCmdChangeState(row) {
      this.$updateById('posterCmd', row).then(() => {
        this.posterCmdDialogFormVisible = false
        this.$message.success('保存成功')
      })
    }
  }
}
</script>
