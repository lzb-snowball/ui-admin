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
        <template v-if="scope.row.state === 'UNPAID' && hasPerm('userRecharge','update')">
          <div>
            <el-button type="text" size="mini" title="" class="pa-0 mb-4" @click="directSuccess(scope.row.id)">
              设为成功
            </el-button>
          </div>
          <div v-if="scope.row.merchantCode.includes('SYSTEMPAY')">
            <el-button type="text" size="mini" title="" class="text-red pa-0" @click="directFail(scope.row.id)">
              设为失败
            </el-button>
          </div>
        </template>
<!--        <template v-else>-->
<!--          <div>{{ scope.row.payTime }}</div>-->
<!--          <div>{{ scope.row.merchantNo }}</div>-->
<!--          <div-->
<!--            v-if="scope.row.state === 'PAID' && scope.row.merchantCode === 'SYSTEMPAY' && scope.row.deductMoney <= 0"-->
<!--          >-->
<!--            <el-button type="text" size="mini" title="" class="pa-0" @click="handleDeduct(scope.row)">扣款</el-button>-->
<!--          </div>-->
<!--        </template>-->
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
  </div>
</template>
<script>
import userEntity from '@/parent-ui/src/main/business/admin/userEntity.vue'

export default {
  name: 'UserRecharge',
  extends: userEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'userRecharge',
        tableConfigs: {
          base: {
            adminButtons: ['query']
          },
        }
      }
    }
  },
  methods: {
    directSuccess: function(recordId) {
      this.$prompt('请确认充值金额', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
        inputErrorMessage: '金额格式不正确'
      }).then(({ value }) => {
        this.$confirm('确定设置充值成功?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await $$post('/commonData/update/userRecharge',
            {
              id: recordId,
              state: 'PAID',
              money: value,
            })
          this.$message.success('设置充值成功!')
          this.getPage()
        })
      }).catch(() => {
      })
    },
    directFail(recordId) {
      this.$prompt('请输入失败原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '驳回理由不能为空'
      }).then(async({ value }) => {
        await $$post('/commonData/update/userRecharge', {
          id: recordId,
          state: 'FAILED',
          userRemark: value
        }).then(res => {
          this.$message.success('操作成功!')
          this.getPage()
        })
      })
    },
  },
}
</script>
