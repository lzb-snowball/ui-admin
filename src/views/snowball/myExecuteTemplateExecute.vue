<template>
  <span v-if="order">
    <el-popover
        ref="popover"
        placement="top"
        width="300"
        v-model="scope.row.visibleStart" @show="popoverStartChange">
      <div class="full-width">
<!--        order={{order}} <br/> <br/>-->
        <!--        scope.row={{scope.row}}<br/> <br/>-->
         <div class="">
           {{$t('参数')}}
          <el-alert type="warning" v-if="formDataLoadCommandsLack.length" class="mb-2">
            {{$t('待配置')}}
            <div v-for="formDataLoadCommand in formDataLoadCommandsLack">
              <div v-if="formDataLoadCommand.name">{{ $t(formDataLoadCommand.name) }} : </div>
              <div v-for="paramLack in formDataLoadCommand.contentParamRequiredsLack">
                {{ paramLack }}
              </div>
            </div>
          </el-alert>
          <div>
            {{$t('过滤')}}:  <zbool v-model="inputParamMapFilter.executeEdit" :true-label-input="$t('可编辑')"
                          :false-label-input="$t('不可编辑')" :is-edit="true" size="small"></zbool>
          </div>
          <el-form :model="inputParamMap" label-width="100px">
            <template v-for="param in params">
               <el-form-item v-if="param" :label="$t(param.name || param.modelCode)" :prop="param.modelCode">
                  <zselect v-if="param.model.multipleField" v-model="inputParamMap[param.modelCode]"
                           :dict-list="param.modelSelects" list-label="name" :disabled="!param.executeEdit"
                           :is-edit="true" :multiple="param.model.multipleValue"/>
                  <el-input v-else v-model="inputParamMap[param.modelCode]" type="textarea"
                            :disabled="!param.executeEdit"/>
               </el-form-item>
           </template>
         </el-form>

           <!--           commandParamModelCodes={{commandParamModelCodes}}-->
           <!--          <div>模板参数值:</div>-->
           <!--          <execute-param :params="{myTemplateId:scope.row.id}" style="padding: 0;" :tableConfigUnitParams="executeParamTableConfigUnitParams"></execute-param>-->
           <!--          <div>分组参数值:</div>-->
           <!--          <execute-param :params="{groupId:scope.row.groupId, myTemplateId:'#eq#'}" style="padding: 0;" :tableConfigUnitParams="executeParamTableConfigUnitParams"></execute-param>-->
        </div>
      </div>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="scope.row.visibleStart = false">{{ $t('取消') }}</el-button>
        <el-button :loading="scope.row.loading" type="primary" size="mini"
                   @click="saveOrUpdateExecuteOrder(scope.row,order,'DOING',$t('开始'),'visibleStart')">
          {{ $t('确定') }}
        </el-button>
      </div>
      <el-button slot="reference" :type="'executeOrder'=== from?'warning':'primary'"
                 v-show="hasPerm('executeOrder','insert') && ( ('executeOrder'=== from && ['FAIL','STOP',undefined].includes(order.state)) || ('myExecuteTemplate'=== from && ['SUCCESS','FAIL','STOP',undefined].includes(order.state))) "
                 size="mini" title="" class="pa-0 mr-2">
        {{ 'executeOrder'=== from ? $t('重试') : $t('开始') }}
      </el-button>
    </el-popover>
    <el-popover
        ref="popover"
        placement="top"
        width="300"
        v-model="scope.row.visibleStop">
      <p>{{ $t('确定停止') }} ?</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="scope.row.visibleStop = false">{{ $t('取消') }}</el-button>
        <el-button :loading="scope.row.loading" type="primary" size="mini"
                   @click="saveOrUpdateExecuteOrder(scope.row,order,'STOP',$t('停止'),'visibleStop')">
          {{ $t('确定') }}
        </el-button>
      </div>
      <el-button slot="reference" type="warning"
                 v-show="hasPerm('executeOrder','update') && ['DOING'].includes(order.state)"
                 size="mini" title="" class="pa-0 mr-2">
        {{ $t('终止') }}
      </el-button>
    </el-popover>
  </span>
</template>
<script>
import Ztab from "@/parent-ui/src/main/ui-element/ztab.vue";
import ExecuteOrder from "@/views/snowball/executeOrder.vue";
import areaTableUnit from "@/parent-ui/src/main/ui-element/autotable/areaTableUnit.vue";
import MyExecuteTemplateParam from "@/views/snowball/myExecuteTemplateParam.vue";
import ExecuteParam from "@/views/snowball/executeParam.vue";
import CollUtil from "@/parent-ui/src/main/js/utils/CollUtil";
import Zselect from "@/parent-ui/src/main/ui-element/zselect.vue";
import Zbool from "@/parent-ui/src/main/ui-element/zbool.vue";
import ObjectUtil from "@/parent-ui/src/main/js/utils/ObjectUtil";

export default {
  name: 'myExecuteTemplateExecute',
  components: {Zbool, Zselect},
  props: {
    from: {},
    scope: {},
    order: {},
  },
  data() {
    return {
      inputParamMapFilter: {
        executeEdit: true,
      },
      inputParamMap: {},
      paramsMap: {},
      paramsModelMap: {},
      formDataLoadCommands: [],
      formDataLoadCommandsLack: [],
      commandParamModelCodes: [],
      commandParams: [],
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
    }
  },
  computed: {
    params() {
      return this.commandParams.filter(p => {
        for (let filterKey of Object.keys(this.inputParamMapFilter)) {
          let filterValue = this.inputParamMapFilter[filterKey];
          let paramValue = p[filterKey]
          if (ObjectUtil.noEmpty(filterValue) && paramValue !== filterValue) {
            return false
          }
        }
        return true
      })
    }
  },
  created() {
  },
  methods: {
    popoverStartChange() {
      // console.log('popoverStartChange', arguments)
      this.loadCommands(this.scope.row)
    },
    saveOrUpdateExecuteOrder(row, order, newState, label, visibleFieldName) {
      this.$set(row, 'loading', true)
      // let id = newState === 'DOING' ? null : order.id
      // let myTemplateId = order.myTemplateId
      // let state = newState
      let orderUpdate = {...order}
      orderUpdate.optType = 'changeState'
      orderUpdate.state = newState
      orderUpdate.inputParamMap = this.inputParamMap
      if (this.from === 'myExecuteTemplate' && newState === 'DOING') {
        orderUpdate.id = null
      }
      // let optType = "changeState"
      this.$emit('executeBefore', row, true)
      // 新增/修改订单 (开始/停止执行订单)
      $$post('/commonData/insertOrUpdate/executeOrder', orderUpdate).then(async (res) => {
        this.$message.success(label + ' ' + this.$t('成功'))
        this.$emit('executeSuccess', row)
        this.$set(row, 'loading', false)
        this.$set(row, visibleFieldName, false)
      }).catch(() => {
        this.$set(row, 'loading', false)
      })
    },
    async loadCommands(row) {
      if (row.id) {
        this.$set(row, 'loading', true)
        let order = await $$get('/execute/loadCommands', {myTemplateId: this.order.myTemplateId})
        let executeParamMap = order.executeParamMap
        this.formDataLoadCommands = order.orderStepCommands
        this.formDataLoadCommandsLack = this.formDataLoadCommands.filter(c => c.contentParamRequiredsLack.length)
        this.commandParamModelCodes = CollUtil.deduplicateArray(this.formDataLoadCommands.map(c => c.contentParamRequireds).flat())
        // Vue.set(row, 'loadCommands', this.formDataLoadCommands)
        if (this.commandParamModelCodes.length) {
          // let paramsMyTemplate = await $$get('/commonData/selectList/executeParam', {
          //   myTemplateId: row.id,
          //   modelCode: '#in#' + this.commandParamModelCodes.join(',')
          // })
          // let paramsGroup = await $$get('/commonData/selectList/executeParam', {
          //   groupId: row.groupId,
          //   modelCode: '#in#' + this.commandParamModelCodes.join(',')
          // })
          this.paramsModelMap = CollUtil.listToMap(await $$get('/commonData/selectList/executeParamModel', {
            code: '#in#' + this.commandParamModelCodes.join(',')
          }), 'code')
          // let paramsMap = {}
          // paramsGroup.forEach(p => paramsMap[p.modelCode] = p)
          // paramsMyTemplate.forEach(p => paramsMap[p.modelCode] = p)
          this.paramsMap = executeParamMap
          let commandParams = this.commandParamModelCodes.map(p => this.paramsMap[p]);
          commandParams.forEach(commandParam => {
            commandParam.model = this.paramsModelMap[commandParam.modelCode]
            if (commandParam.model.multipleField) {
              commandParam.modelSelects = JSON.parse(commandParam.value)
            }
            if (commandParam.defaultValue) {
              // this.inputParamMap[commandParam.modelCode] = commandParam.defaultValue
              let value = commandParam.model.multipleField ? [commandParam.defaultValue] : commandParam.defaultValue
              this.$set(this.inputParamMap, commandParam.modelCode, value)
            }
          })
          this.commandParams = commandParams
          this.$set(row, 'loading', false)
        }
      }
    },
  }
}
</script>
