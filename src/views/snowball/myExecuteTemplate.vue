<template>
  <div v-if="tableConfigUnitInner.loaded" class="pa-4">
    <ztab v-model="pageParams.groupId" entityName="executeGroup" list-code="id" list-label="name"
          @input="getPage({})"></ztab>
    <!--搜索-->
    <areaSearch
        :table-config-unit="tableConfigUnitInner"
        :page-params.sync="pageParams"
        @getPage="getPage"
        @showForm="showForm"
    >
      <template #buttonAfter>
        <el-button
            size="small"
            @click="expansionAll"
        >{{expansionFlag?$t('展开全部'):$t('关闭全部')}}
        </el-button>
      </template>
    </areaSearch>
    <!--表格-->
    <areaTable
        ref="table"
        :table-config-unit="tableConfigUnitInner"
        :page-params="pageParams"
        @showForm="showForm"
        :tableColumnPrependCfg="{type:'expand'}"
        :row-key="row => row.id"
    >
      <template v-slot:tableColumnPrepend="scope">
        <div>
          <execute-order :ref="`${scope.row.id}_executeOrders`" :params="{myTemplateId: scope.row.id,pageSize:3}"
                         :tableConfigUnitParams="
                              {
                                tableConfigs: {
                                  search: {
                                    hide: true
                                  },
                                  table: {
                                    removeFieldNames: ['myTemplateId','templateId'],
                                    stripe: true,
                                    page:{
                                      hide: true,
                                    }
                                  },
                                }
                              }" style="padding: 0 8px;" :doGetPageAfter="doGetPageAfter"></execute-order>
          <div class="full-width text-center mb-1 pa-1"
               @click="jump(`/snowball/executeOrder?myTemplateId=${scope.row.id}`)">{{ $t('更多') }}
          </div>
        </div>
      </template>
      <template #tableOptionPrepend="scope">
        <my-execute-template-execute :scope="scope"
                                     :order="{id:scope.row.lastOrderId,myTemplateId:scope.row.id,state:scope.row.lastOrderState}"
                                     @executeBefore="expansion" @executeSuccess="executeSuccess"
                                     :from="'myExecuteTemplate'"></my-execute-template-execute>
        <!--          <el-button v-if="hasPerm('executeOrder','selectOne')" size="mini" title="" class="pa-0" @click="viewOrder(scope.row.id)">-->
        <!--            执行详情-->
        <!--          </el-button>-->
      </template>
    </areaTable>
    <!--编辑弹窗-->
    <areaFormDialog
        v-model="dialogFormVisible"
        :table-config-unit="tableConfigUnitInner"
        :form-data="formData"
        :form-data-option="formDataOption"
        @saveSuccess="getPage();dialogFormVisible=false"
    >
      <template #formAppend>
        <div v-if="formData.id" class="">
          <el-alert type="warning" v-if="formDataLoadCommandsLack.length" class="mb-2">
            待配置参数:
            <div v-for="formDataLoadCommand in formDataLoadCommandsLack">
              <div v-if="formDataLoadCommand.name">{{ formDataLoadCommand.name }} :</div>
              <div v-for="paramLack in formDataLoadCommand.contentParamRequiredsLack">
                {{ paramLack }}
              </div>
            </div>
          </el-alert>
          <div>模板参数值:</div>
          <execute-param :params="{myTemplateId:formData.id}" style="padding: 0;"
                         :tableConfigUnitParams="executeParamTableConfigUnitParams"></execute-param>
          <div>分组参数值:</div>
          <execute-param :params="{groupId:formData.groupId, myTemplateId:'#eq#'}" style="padding: 0;"
                         :tableConfigUnitParams="executeParamTableConfigUnitParams"></execute-param>
        </div>
      </template>
    </areaFormDialog>
  </div>
</template>
<script>
import Ztab from "@/parent-ui/src/main/ui-element/ztab.vue";
import ExecuteOrder from "@/views/snowball/executeOrder.vue";
import areaTableUnit from "@/parent-ui/src/main/ui-element/autotable/areaTableUnit.vue";
import MyExecuteTemplateParam from "@/views/snowball/myExecuteTemplateParam.vue";
import ExecuteParam from "@/views/snowball/executeParam.vue";
import MyExecuteTemplateExecute from "@/views/snowball/myExecuteTemplateExecute.vue";
import {eventBus} from "@/parent-ui/src/main/js/utils/WebsocketUtil";
const stateMap = {
  'DOING':null,
  'SUCCESS':'success',
  'FAIL':'exception',
  'STOP':'warning',
}
export default {
  name: 'myExecuteTemplate',
  components: {MyExecuteTemplateExecute, ExecuteParam, MyExecuteTemplateParam, ExecuteOrder, Ztab},
  extends: areaTableUnit,
  data() {
    return {
      doGetPageAfter: null,
      expansionFlag: true,
      formDataLoadCommands: [],
      formDataLoadCommandsLack: [],
      executeParamTableConfigUnitParams: {
        tableConfigs: {
          search: {
            removeAdminButtons: ['query'],
          },
          table: {
            removeFieldNames: ['myTemplateId'],
            page: {
              hide: true,
            }
          },
        }
      },
      tableConfigUnit: {
        entityName: 'myExecuteTemplate',
        tableConfigs: {
          base: {
            removeFieldNames: ['groupId']
          },
          table: {
            opt: {
              size: 236,
            },
          },
        },
        fieldConfigsMap: {
          // lastOrderState: {
          //   table: {
          //     style: 'text-decoration-line: underline',
          //     _listeners: {}
          //   }
          // },
          lastOrderState: {
            table: {
              _listeners: {},// 关闭监听避免click事件触发不了
              style: 'text-decoration-line: underline',
              fieldName: 'lastOrderState',
              label: this.$t('状态'),
              changeResult(content,p1, entity) {
                  return <div class="d-flex flex-column">
                    <div>{content} {entity.lastOrderStepNoCurrent + '/' + entity.lastOrderStepNoAll}</div>
                    <el-progress show-text={false}  class={'full-width mt-1 '+(this.innerValue === 'DOING'?'blinking':'')}
                                 percentage={parseFloat(entity.lastOrderStepNoCurrent * 100 / entity.lastOrderStepNoAll)||0}
                                 status={stateMap[entity.lastOrderState]}></el-progress>
                  </div>
                  // return <div>{content}<i class="el-icon-loading"></i></div>
              },
            }
          },
        }
      }
    }
  },
  created() {
    let This = this
    this.tableConfigUnit.tableConfigs.table.afterPage = function (page) {
      page.records.forEach(record => {
        record.visibleStop = false
        record.visibleStart = false
      })
      if (!This.mixin.isProd) {
        if (page.records.length) {
          This.expansion(page.records[0])
        }
      }
      return page
    }

    this.tableConfigUnit.fieldConfigsMap.lastOrderState.table._listeners.click = function (v2, v1, entity) {
      console.log(entity)
      // todo 订单详情
      This.jump(`/snowball/executeOrder?id=${entity.lastOrderId}`)
    }


    // this.$refs.table.$refs.table.toggleRowExpansion(row, true)
  },
  mounted() {
    let dataEntity = 'MyExecuteTemplate'
    // 组件挂载时开始监听事件
    eventBus.$on(`get${dataEntity}Msg`, this.handleWebSocketMessage)
  },
  beforeDestroy() {
    let dataEntity = 'MyExecuteTemplate'
    // 组件卸载时移除事件监听器
    eventBus.$off(`get${dataEntity}Msg`, this.handleWebSocketMessage)
  },
  methods: {
    showForm(data) {
      this.formData = {...data.entity, ...this.params}
      this.formDataOption = data.option
      this.dialogFormVisible = true
      this.loadCommands(data.entity)
    },
    async loadCommands(row) {
      if (row.id) {
        let order = await $$get('/execute/loadCommands', {myTemplateId: row.id});
        this.formDataLoadCommands = order.orderStepCommands
        this.formDataLoadCommandsLack = this.formDataLoadCommands.filter(c => c.contentParamRequiredsLack.length)
        this.$set(row, 'loadCommands', this.formDataLoadCommands)
      }
    },
    async expansion(row, expansionFlag = true) {
      let This = this
      await this.$nextTick();
      if (expansionFlag) {
        this.doGetPageAfter = ()=>{
          This.$refs[`${row.id}_executeOrders`].expansion()
          this.doGetPageAfter = null
        }
        This.$refs.table.$refs.table.toggleRowExpansion(row, expansionFlag)
        await this.$nextTick();
      } else {
        This.$refs.table.$refs.table.toggleRowExpansion(row, expansionFlag)
      }
    },
    async expansionAll() {
      this.$refs.table.pageResponse.records.forEach(row=>{
        this.expansion(row,  this.expansionFlag)
      })
      this.expansionFlag = !this.expansionFlag
    },
    async executeSuccess(row) {
      let newTemplate = await $$get('/commonData/selectOne/myExecuteTemplate', {id: row.id});
      Object.keys(newTemplate).forEach((key) => {
        this.$set(row, key, newTemplate[key]);
      });
      this.$refs[`${row.id}_executeOrders`].getPage()
    },
    tabInput() {
      console.log('tabInput', arguments)
    },
    handleWebSocketMessage(dataStr) {
      let data = JSON.parse(dataStr)
      // console.log('handleWebSocketMessage myExecuteTemplate', data)
      this.$refs.table.pageResponse.records.filter(row=>{
        if (row.id === data.id) {
          Object.keys(data).forEach((key) => {
            this.$set(row, key, data[key]);
          });
        }
      })
    },
  }
}
</script>
