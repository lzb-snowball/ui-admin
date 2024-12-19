<template>
  <div v-if="tableConfigUnitInner.loaded" class="pa-4">
    <area-field-desc :getDescription="getDescription"></area-field-desc>
    <!--    <el-alert type="success">默认统一为BANK,仅用于展示</el-alert>-->
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
import AreaFieldDesc from "@/views/component/areaFieldDesc.vue";

export default {
  name: 'remoteServer',
  components: {AreaFieldDesc},
  extends: configEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'remoteServer',
      }
    }
  },
  methods:{
    getDescription() {
      let servers = Object.values(this.$refs.table.fieldConfigMap).filter(f => f.fieldName && !['enabled','createTime'].includes(f.fieldName))
          .map(f => '        ' + `#{server.${f.fieldName}}` + ' : ' + f.label + '\n')
      return '<foreach collection="servers" item="server">\n' +
          '    <if test="server.host == \'127.0.0.1\'">\n' +
          servers.join('') +
          '    </if>\n' +
          '</foreach>'
    },
  }
}
</script>
