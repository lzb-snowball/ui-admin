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
    <el-button size="small" type="primary" @click="dialogFormVisibleEnum = true">另存枚举</el-button>
    <el-dialog :close-on-click-modal="false" v-if="dialogFormVisibleEnum" :title="$t('另存枚举')" :visible.sync="dialogFormVisibleEnum" width="80%">
      <pre v-for="data in $refs.table.pageResponse.records">_{{data.id}}("{{data.name}}", {{data.stepId}}L, "{{data.content.replaceAll('\n','\\n').replaceAll('"','\\"')}}", "", 100, true, null),</pre>
    </el-dialog>
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
  name: 'executeStepCommand',
  extends: configEntity,
  data() {
    return {
      dialogFormVisibleEnum:false,
      tableConfigUnit: {
        entityName: 'executeStepCommand',
        tableConfigs: {
          search: {
            addFieldNames: ['content'],
          }
        },
        fieldConfigsMap: {
          name: {
            base: {
              width: 170
            }
          },
          stepId: {
            base: {
              width: 200
            }
          },
        },
      }
    }
  },
}
</script>
