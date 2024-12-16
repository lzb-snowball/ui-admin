<template>
  <div v-if="tableConfigUnitInner.loaded" class="pa-4">
      <area-search
          :table-config-unit="tableConfigUnitInner"
          :page-params.sync="pageParams"
          @getPage="getPage"
          @showForm="showForm"
      />
      <area-table
          ref="table"
          :table-config-unit="tableConfigUnitInner"
          :page-params="pageParams"
          @showForm="showForm"
      />
      <area-form-dialog
          v-model="dialogFormVisible"
          :table-config-unit="tableConfigUnitInner"
          :form-data="formData"
          :formDataOption="formDataOption"
          @saveSuccess="getPage();dialogFormVisible=false"
      />
    </div>
</template>

<script>
// 界面元素

import zselect from '@/parent-ui/src/main/ui-element/zselect.vue'
import AreaTableUnit from '@/parent-ui/src/main/ui-element/autotable/areaTableUnit.vue'
import inputFieldProp from "@/views/content/sub/inputFieldProp.vue";
import areaTableUnitExtend from "@/parent-ui/src/main/ui-element/autotable/areaTableUnitExtend";
import AreaSearch from "@/parent-ui/src/main/ui-element/autotable/areaSearch.vue";
import AreaTable from "@/parent-ui/src/main/ui-element/autotable/areaTable.vue";
import AreaFormDialog from "@/parent-ui/src/main/ui-element/autotable/areaFormDialog.vue";

export default {
  name: 'InputField',
  components: {
    AreaFormDialog,
    AreaTable,
    AreaSearch,
    AreaTableUnit,
    zselect,
    inputFieldProp,
  },
  extends: areaTableUnitExtend,
  filters: {},
  props: {},
  $dataEnums: ['EnumInputFieldTypeOpt', 'JTDConst_EnumFieldUiType'], // 例如 EnumSex
  $dataEntitys: ['payCardType'], // 例如 UserLevelConfig
  data() {
    return {
      tableConfigUnit: {},
      formDataOption: null,
      submitFormEntityName: null,
    }
  },
  watch: {},
  created() {
    const This = this
    const fields = [
      // 银行卡
      'bankUsername', 'bankAccount', 'bankAccount2', 'bankName', 'bankBranchCode', 'bankBranchName', 'bankAddress', 'bankPhone', 'userAddress', 'email', 'idCard',
      // 线下充值
      'pic', 'merchantNo', 'money',
      // 地址
      'phone', 'receiver', 'country', 'postalCode', 'province', 'city', 'district', 'street', 'building', 'houseNumber', 'addressDetail', 'isDefault'
    ]
    const filter = (field) => fields == null || fields.includes(field.fieldName)
    this.tableConfigUnit = {
      entityName: 'inputField',
      tableConfigs: {
        base: {}
      },
      fieldConfigsMap: {
        opt: {
          base: {
            width: 140
          },
          form: {
            render(h, entity) {
              console.log('opt.form render')
              return <zselect classname='EnumInputFieldTypeOpt' v-model={entity.opt} onSelectOption={(selectOptions) => {
                console.log('entity.EnumInputFieldTypeOpt onSelectOption', selectOptions.submitFormEntityName)
                if (selectOptions) {
                  This.submitFormEntityName = selectOptions.submitFormEntityName
                  entity.submitFormEntityName = selectOptions.submitFormEntityName
                }
              }}/>
            }
          },
        },
        prop: {
          base: {
            render(h, entity) {
              console.log('entity.submitFormEntityName base', entity.submitFormEntityName)
              return <inputFieldProp filter={filter.bind(this)} submitFormEntityName={entity.submitFormEntityName} v-model={entity.prop}/>
              // return <div>123</div>
            }
          },
          form: {
            render(h, entity) {
              console.log('entity.submitFormEntityName form', entity.submitFormEntityName)
              return <inputFieldProp filter={filter.bind(this)} submitFormEntityName={This.submitFormEntityName} v-model={entity.prop}/>
              // return <div>123</div>
            }
          },
        },
      }
    }
    this.getTableConfigDb()
  },
  methods: {
    filterFields(field) {
      return this.fields == null || this.fields.includes(field.fieldName)
    },
    showForm(data) {
        this.formData = { ...data.entity, ...this.params }
        this.formDataOption = data.option
        this.dialogFormVisible = true
      },
  }
}
</script>
