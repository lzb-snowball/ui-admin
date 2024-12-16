<template>
  <div v-if="tableConfigUnitInner.loaded" class="pa-4">
    <!--搜索-->
    <areaSearch
      :table-config-unit="tableConfigUnitInner"
      :page-params.sync="pageParams"
      @getPage="getPage"
      @showForm="showForm"
    />
    <!--表格-->
    <areaTable
      ref="table"
      :table-config-unit="tableConfigUnitInner"
      :page-params="pageParams"
      @showForm="showForm"
    >
      <template #tableOptionColumnOther="scope">
        <el-button
          v-if="hasPerm('userTransfer','insert') && scope.row.status === 'CHECKING'"
          type="warning"
          size="small"
          @click="openTransferDialog(scope.row)"
        >代付
        </el-button>
        <el-button
          v-if="hasPerm('userWithdraw','update') && scope.row.status === 'CHECKING'"
          type="danger"
          size="small"
          @click="handleReject(scope.row)"
        >驳回
        </el-button>
        <div v-if="hasPerm('user:withdraw:reject')">
          <el-button type="danger" size="mini" @click="handleReject(scope.row)">驳回</el-button>
        </div>
      </template>
    </areaTable>
    <!--编辑弹窗-->
    <areaFormDialog
      v-model="dialogFormVisible"
      :table-config-unit="tableConfigUnitInner"
      :form-data="formData"
      :form-data-option="formDataOption"
      @saveSuccess="getPage();dialogFormVisible=false"
    />
    <user-transfer-dialog
      v-if="showTransferDialog"
      v-model="showTransferDialog"
      :params="userWithdraw"
      @transferSuccess="getPage();"
    />
  </div>
</template>
<script>
import userEntity from '@/views/component/userEntity.vue'
import UserTransferDialog from '@/views/user/sub/userTransferDialog.vue'

export default {
  name: 'UserWithdraw',
  components: { UserTransferDialog },
  extends: userEntity,
  data() {
    return {
      userWithdraw: {},
      showTransferDialog: false,
      tableConfigUnit: {
        entityName: 'userWithdraw',
        tableConfigs: {
          base: {
            adminButtons: ['query'],
          },
        },
      }
    }
  },
  methods: {
    openTransferDialog(userWithdraw) {
      this.userWithdraw = userWithdraw
      this.showTransferDialog = true
    },
    handleReject(row) {
      this.$prompt('请输入驳回理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '驳回理由不能为空'
      }).then(({ value }) => {
        $$post('/commonData/update/userWithdraw', { id: row.id, status: 'REJECT', rejectReason: value }).then(res => {
          this.$message.success('驳回成功')
          this.getPage()
        })
      }).catch(() => {
      })
    },
  },
}
</script>
