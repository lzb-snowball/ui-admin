<template>
  <div v-if="tableConfigUnitInner.loaded" class="pa-4">
    <!--    <el-alert type="success">{{$t('提示')}}</el-alert>-->
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
    />
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


import areaTableUnit from "@/parent-ui/src/main/ui-element/autotable/areaTableUnit.vue";

export default {
  name: 'executeOrderStepCommand',
  extends: areaTableUnit,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'executeOrderStepCommand',
      }
    }
  },
}
</script>
