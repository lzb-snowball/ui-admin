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
    />
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
                              }" style="padding: 0 8px;"></execute-order>
          <div class="full-width text-center mb-1 pa-1"
               @click="jump(`/snowball/executeOrder?myTemplateId=${scope.row.id}`)">{{ $t('更多') }}
          </div>
        </div>
      </template>
      <template #tableOptionPrepend="scope">
        <my-execute-template-execute :scope="scope"
                                     :order="{id:scope.row.lastOrderId,myTemplateId:scope.row.id,state:scope.row.lastOrderState}"
                                     @executeBefore="executeBefore" @executeSuccess="executeSuccess"
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

export default {
  name: 'myExecuteTemplate',
  components: {MyExecuteTemplateExecute, ExecuteParam, MyExecuteTemplateParam, ExecuteOrder, Ztab},
  extends: areaTableUnit,
  data() {
    return {
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
          lastOrderState: {
            table: {
              style: 'text-decoration-line: underline',
              _listeners: {}
            }
          }
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
        // setTimeout(()=>{
        if (page.records.length) {
          This.executeBefore(page.records[0])
        }
        // },500)
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
  methods: {
    showForm(data) {
      this.formData = {...data.entity, ...this.params}
      this.formDataOption = data.option
      this.dialogFormVisible = true
      this.loadCommands(data.entity)
    },
    async loadCommands(row) {
      if (row.id) {
        this.formDataLoadCommands = await $$get('/execute/loadCommands', {myTemplateId: row.id})
        this.formDataLoadCommandsLack = this.formDataLoadCommands.filter(c => c.contentParamRequiredsLack.length)
        this.$set(row, 'loadCommands', this.formDataLoadCommands)
      }
    },
    async executeBefore(row) {
      let This = this
      await this.$nextTick();
      This.$refs.table.$refs.table.toggleRowExpansion(row, true)
      await this.$nextTick();
      setTimeout(()=>{
        This.$refs[`${row.id}_executeOrders`].executeBefore()
      },300)
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
    }
  }
}
</script>
