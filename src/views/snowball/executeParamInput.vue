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
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'
import executeParamValue from './executeParamValue'

export default {
  name: 'executeParamInput',
  components: { executeParamValue, },
  extends: configEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'executeParam',
      }
    }
  },
  created(){
    this.tableConfigUnit = {
      entityName: 'executeParam',
      fieldConfigsMap: {
        value:{
          form :{
            render(p1,entity) {
              // console.log('modelCode',arguments)
              return <executeParamValue v-model={this.innerValue} modelCode={entity.modelCode}></executeParamValue>
              // return <el-input v-model={this.innerValue}></el-input>
            }
          }
        }
      }
    }
  }
}
</script>
