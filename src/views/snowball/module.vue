<template>
  <div v-if="tableConfigUnitInner.loaded" class="pa-4">
    <area-field-desc :getDescription="getDescription"></area-field-desc>
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
        ref="dialog"
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
import CodeMirrorEditor from "@/parent-ui/src/main/other-framwork/CodeMirrorEditor.vue";
import AreaFieldDesc from "@/views/component/areaFieldDesc.vue";

export default {
  name: 'module',
  components: {AreaFieldDesc, CodeMirrorEditor},
  extends: configEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'module',
      },
    }
  },
  created() {
  },
  methods: {
    getDescription() {
      let fields = Object.values(this.$refs.table.fieldConfigMap).filter(f => f.fieldName && !['enabled','createTime', 'remoteServerIds', 'myTemplateIds'].includes(f.fieldName))
          .map(f => '        ' + `#{module.${f.fieldName}}` + ' : ' + f.label + '\n')
      return '<foreach collection="modules" item="module">\n' +
          '    <if test="module.code != \'libs\'">\n' +
          fields.join('') +
          '    </if>\n' +
          '</foreach>'
    },
  },
}
</script>
