<template>
  <div v-if="tableConfigUnitInner.loaded" class="pa-4">
    <el-alert type="info">code 和 name 为固有属性</el-alert>
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
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'

export default {
  name: 'executeParamField',
  extends: configEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'executeParamField',
        tableConfigs: {
          table: {
            filterButton(btn, scope) {
              switch (btn) {
                case 'delete':
                  return !scope.row.systemFlag
              }
              return true
            }
          },
        },
        fieldConfigsMap: {
          code: { // 拿id字段的配置举例
            form: {
              changeAttrs(attrs, entity){
                attrs.disabled = entity.systemFlag
                return attrs
              }
            },
          },
          systemFlag: { // 拿id字段的配置举例
            base: {
              changeAttrs(attrs, entity){
                attrs.disabled = true
                return attrs
              }
            },
          },
        },
      },
    }
  },
}
</script>
