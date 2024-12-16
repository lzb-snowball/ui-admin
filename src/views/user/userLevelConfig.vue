<template>

  <div v-if="tableConfigUnitInner.loaded" class="pa-4">
    <div>
      <p class="u-font-18 font-bold">{{$t('佣金等级限制开关')}}</p>
      <p class="u-font-18 font-bold">{{$t('佣金比例')}}</p>
    </div>
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
    />
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
import areaTableUnitExtend from '@/parent-ui/src/main/ui-element/autotable/areaTableUnitExtend.js'
export default {
  name: 'UserLevelConfig',
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
    }
  },
  watch: {},
  created() {
    this.pageParams = { ...this.pageParams, ...this.params }
    this.formData = { ...this.formData, ...this.params }
    const This = this
    this.tableConfigUnit = {
      entityName: 'userLevelConfig',
      tableConfigs: {
        base: {
          adminButtons: ['query', 'edit', 'add', 'export']
        }
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
  }
}
</script>
