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
    >
      <template #tableOptionPrepend="scope">
        <my-execute-template-execute :scope="scope" :order="scope.row" @executeSuccess="executeSuccess" :opts="['STOP']"></my-execute-template-execute>
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
import areaTableUnit from "@/parent-ui/src/main/ui-element/autotable/areaTableUnit.vue";
import MyExecuteTemplateExecute from "@/views/snowball/myExecuteTemplateExecute.vue";

export default {
  name: 'executeOrder',
  components: {MyExecuteTemplateExecute},
  extends: areaTableUnit,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'executeOrder',
        tableConfigs: {
          base: {
            addFieldNames: {0:'id',7: 'stepNoCurrent'},
          },
        },
        fieldConfigsMap: {
          id: {
            base: {
              fieldName: 'id',
              label: this.$t('ID'),
              uiType:'text',
              width:60,
            },
            search: {
              isEdit: true,
            },
          },
          stepNoCurrent: {
            table: {
              fieldName: 'stepNoCurrent',
              label: this.$t('第几步'),
              render(p1,entity){
                 return <div>{entity.stepNoCurrent + '/' + entity.stepNoAll}</div>
                 // return `<div>entity.stepNoCurrent + '/' + entity.stepNoAll</div>`
              }
            }
          },
        },
      }
    }
  },
  created(){

  },
  methods: {
    saveOrUpdateExecuteOrder(row, newState) {
      this.$set(row, 'loading', true)
      let id = row.id
      let myTemplateId = null
      let state = newState
      let optType = "changeState"
      // 新增/修改订单 (开始/停止执行订单)
      $$post('/commonData/insertOrUpdate/executeOrder', {
        id,
        myTemplateId,
        state,
        optType,
      }).then(res => {
        this.getPage()
        this.$set(row, 'loading', false)
      }).catch(() => {
        this.$set(row, 'loading', false)
      })
    },
    viewOrder() {

    },
    async executeSuccess(row) {
      this.getPage()
    },
  }
}
</script>
