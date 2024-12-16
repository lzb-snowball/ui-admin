<template>

  <div v-if="tableConfigUnitInner.loaded" class="pa-4">
    <areaSearch
      :table-config-unit="tableConfigUnitInner"
      :page-params.sync="pageParams"
      @getPage="getPage"
      @showForm="showForm"
    />
    <areaTable
      ref="table"
      :table-config-unit="tableConfigUnitInner"
      :page-params="pageParams"
      @showForm="showForm"
    >
      <template #tableOptionColumnOther="scope">
        <el-button type="warning" size="small" @click="openRateDialog(scope.row)">{{$t('编辑倍率')}}</el-button>
      </template>
    </areaTable>
    <areaFormDialog
      v-model="dialogFormVisible"
      :table-config-unit="tableConfigUnitInner"
      :form-data="formData"
      :form-data-option="formDataOption"
      @saveSuccess="getPage();dialogFormVisible=false"
    />
    <el-dialog v-if="dialogFormVisibleRate" append-to-body :visible.sync="dialogFormVisibleRate" width="80%">
      <snowball-product-rate v-if="dialogFormVisibleRate" :params="{productId:formData.id}" />
    </el-dialog>
  </div>
</template>
<script>
import areaTableUnitExtend from '@/parent-ui/src/main/ui-element/autotable/areaTableUnitExtend.js'
import SnowballProductRate from '@/views/snowball/snowballProductRate.vue'
export default {
  name: 'SnowballProduct',
  components: { SnowballProductRate },
  filters: {},
  extends: areaTableUnitExtend,
  props: {
    params: {},
  },
  data() {
    return {
      formData: {},
      formDataOption: null,
      pageParams: {},
      dialogFormVisible: false,
      dialogFormVisibleRate: false,
    }
  },
  watch: {},
  created() {
    this.pageParams = { ...this.pageParams, ...this.params }
    this.formData = { ...this.formData, ...this.params }
    const This = this
    this.tableConfigUnit = {
      entityName: 'snowballProduct',
      tableConfigs: {
        base: {
          adminButtons: ['query', 'edit', 'add', 'delete']
        },
        table: {
          // addFieldNames: ['id'],
        },
      },
      fieldConfigsMap: {}
    }
    this.getTableConfigDb()
  },
  methods: {
    showForm(data) {
      this.formData = { ...data.entity, ...this.params }
      this.formDataOption = data.option
      this.dialogFormVisible = true
    },
    openRateDialog(data) {
      // console.log('openRateDialog', data)
      this.formData = data
      // this.formDataOption = data.option
      this.dialogFormVisibleRate = true
    },
  }
}
</script>
