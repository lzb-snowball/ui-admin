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
        @getPage="getPageAfter"
        :tableColumnPrependCfg="{type:'expand'}"
    >

      <template v-slot:tableColumnPrepend="scope">
        <terminal :ref="`terminal_${scope.row.id}`" :value="getFileViewUrl(scope.row.logFileFull)"
                  style="height: 300px;"
                  :subscribeGet="getSubscribe(scope)"
        ></terminal>
      </template>
      <template #tableOptionPrepend="scope">
        <i v-if="['FAIL','DOING','STOP'].includes(scope.row.state)" class="el-icon-refresh mr-4" @click="refreshRow(scope.row)"></i>
        <my-execute-template-execute :scope="scope" :order="scope.row" @executeBefore="expansion(scope.row)"
                                     @executeSuccess="executeSuccess"
                                     :from="'executeOrder'"></my-execute-template-execute>
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
import Terminal from "@/parent-ui/src/main/other-framwork/Terminal.vue";
import {eventBus} from "@/parent-ui/src/main/js/utils/WebsocketUtil";
import Zselect from "@/parent-ui/src/main/ui-element/zselect.vue";
const stateMap = {
  'DOING':null,
  'SUCCESS':'success',
  'FAIL':'exception',
  'STOP':'warning',
}
export default {
  name: 'executeOrder',
  components: {Zselect, Terminal, MyExecuteTemplateExecute},
  extends: areaTableUnit,
  props: {
    doGetPageAfter:{},
  },
  data() {
    return {
      tableConfigUnit: {
        entityName: 'executeOrder',
        tableConfigs: {
          base: {
            addFieldNames: {0:'id'},
          },
        },
        fieldConfigsMap: {
          id: {
            base: {
              fieldName: 'id',
              label: this.$t('ID'),
              uiType: 'text',
              width: 60,
            },
            search: {
              isEdit: true,
            },
          },
          // stepNoCurrent: {
          //   table: {
          //     fieldName: 'stepNoCurrent',
          //     label: this.$t('第几步'),
          //     render(p1, entity) {
          //       return <div>{entity.stepNoCurrent + '/' + entity.stepNoAll}</div>
          //       // return `<div>entity.stepNoCurrent + '/' + entity.stepNoAll</div>`
          //     }
          //   }
          // },
          state: {
            table: {
              fieldName: 'state',
              label: this.$t('状态'),
              changeResult(content,p1, entity) {
                  return <div class="d-flex flex-column">
                    <div>{content} {entity.stepNoCurrent + '/' + entity.stepNoAll}</div>
                    <el-progress show-text={false} class={'full-width mt-1 '+(this.innerValue === 'DOING'?'blinking':'')} percentage={parseInt(entity.stepNoCurrent*100/entity.stepNoAll)||0} status={stateMap[entity.state]}></el-progress>
                  </div>
              }
            }
          },
        },
      }
    }
  },
  created() {

  },
  mounted() {
    let dataEntity = 'ExecuteOrder'
    // 组件挂载时开始监听事件
    eventBus.$on(`get${dataEntity}Msg`, this.handleWebSocketMessage)
  },
  beforeDestroy() {
    let dataEntity = 'ExecuteOrder'
    // 组件卸载时移除事件监听器
    eventBus.$off(`get${dataEntity}Msg`, this.handleWebSocketMessage)
  },
  methods: {
    getPageAfter() {
      if (this.doGetPageAfter) {
        this.doGetPageAfter()
      }
    },
    // saveOrUpdateExecuteOrder(row, newState) {
    //   this.$set(row, 'loading', true)
    //   let id = row.id
    //   let myTemplateId = null
    //   let state = newState
    //   let optType = "changeState"
    //   // 新增/修改订单 (开始/停止执行订单)
    //   $$post('/commonData/insertOrUpdate/executeOrder', {
    //     id,
    //     myTemplateId,
    //     state,
    //     optType,
    //   }).then(res => {
    //     this.getPage()
    //     this.$set(row, 'loading', false)
    //   }).catch(() => {
    //     this.$set(row, 'loading', false)
    //   })
    // },
    async executeSuccess(row) {
      await this.refreshRow(row)
    },
    async refreshRow(row) {
      let newTemplate = await $$get('/commonData/selectOne/executeOrder', {id: row.id});
      Object.keys(newTemplate).forEach((key) => {
        this.$set(row, key, newTemplate[key]);
      });
    },
    getSubscribe(scope) {
      let This = this
      return {
        topic: `ExecuteOrder_${scope.row.id}`,
        topicFn: (data) => {
          // console.log('收到' + `ExecuteOrder_${scope.row.id}` + '消息:', data.body)
          // debugger
          This.$refs[`terminal_${scope.row.id}`].writeToTerminalWebsocket(JSON.parse(data.body).data)
        }
      }
    },
    async expansion(row) {
      await this.$nextTick();
      let records = this.$refs.table.pageResponse.records;
      this.$refs.table.$refs.table.toggleRowExpansion(row || records.length && records[0] || null, true)
    },
    handleWebSocketMessage(dataStr) {
      let data = JSON.parse(dataStr)
      this.$refs.table.pageResponse && this.$refs.table.pageResponse.records.filter(row=>{
        // debugger
        if (row.id === data.id) {
          // console.log('handleWebSocketMessage executeOrder', data)
          Object.keys(data).forEach((key) => {
            this.$set(row, key, data[key]);
          });
        }
      })
    },
  }
}
</script>
