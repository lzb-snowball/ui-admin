<template>
  <div v-if="tableConfigUnitInner.loaded" class="pa-4">
    <!--    pageParams.type={{ type }}-->
    <!--        <zselect v-model="type" classname="EnumRegisterProps"></zselect>-->
    <!--        <zselect v-model="type2" classname="EnumRegisterProps"></zselect>-->
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
      @getPage="listUserMoney"
    >
      <!--      <template #tableColumnOther>-->
      <!--        <el-table-column label="余额">-->
      <!--          <template slot-scope="scope">-->
      <!--            <div class="d-flex flex-column">-->
      <!--              <div v-for="userMoney in scope.row.userMoneys" :key="`userMoney_`+userMoney.id">-->
      <!--                余额: {{ userMoney.amount }}-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <!--      </template>-->
      <template #tableOptionColumnOther="scope">
        <el-button size="small" @click="openList(scope)">{{$t('列表信息')}}</el-button>
        <el-button v-if="hasPerm('userRecharge', 'insert')" type="warning" size="small" @click="openRechargeDialog(scope)">{{$t('充值')}}</el-button>
      </template>
    </areaTable>
    <!--编辑-->
    <areaFormDialog
      v-model="dialogFormVisible"
      :table-config-unit="tableConfigUnitInner"
      :form-data="formData"
      :form-data-option="formDataOption"
      @saveSuccess="getPage();dialogFormVisible=false"
    />
    <!--列表信息-->
    <user-list-popup v-model="showList" :params="{userId,username:user.username}" />
    <!--充值弹窗-->
    <user-recharge-dialog
      v-if="showRechargeDialog"
      v-model="showRechargeDialog"
      :params="{userId,username:user.username}"
      @rechargeSuccess="getPage()"
    />
  </div>
</template>
<script>
import areaTableUnitExtend from '@/parent-ui/src/main/ui-element/autotable/areaTableUnitExtend.js'
import CollUtil from '@/parent-ui/src/main/js/utils/CollUtil'
import UserListPopup from '@/views/user/sub/userListPopup.vue'
import UserRechargeDialog from '@/views/user/sub/userRechargeDialog.vue'
import Zselect from '@/parent-ui/src/main/ui-element/zselect.vue'
import ZselectAppend from '@/parent-ui/src/main/ui-element/zselectAppend.vue'
import NumUtil from '@/parent-ui/src/main/js/utils/NumUtil'

export default {
  name: 'User',
  components: { ZselectAppend, Zselect, UserRechargeDialog, UserListPopup },
  filters: {},
  extends: areaTableUnitExtend,
  props: {},
  $dataEntitys: ['userLevelConfig', 'poster'],
  $dataEnums: ['EnumTradeType', 'EnumRegisterProps', 'EnumRechargeType'],
  data() {
    return {
      tableConfigUnit: {},
      formData: {},
      formDataOption: null,
      pageParams: {},
      type: 'password',
      types: 'username,password',
      dialogFormVisible: false,
      showList: false,
      showRechargeDialog: false,
      user: {},
      userId: null,
      userAmountTotalTableInfo: null,
    }
  },
  watch: {},
  async created() {
    this.userAmountTotalTableInfo = await $$get('/commonTable/info/userAmountTotal')
    console.log('userAmountTotalTableInfo',this.userAmountTotalTableInfo)
    const This = this
    this.tableConfigUnit = {
      entityName: 'user',
      tableConfigs: {
        base: {
          adminButtons: ['query', 'edit', 'add', 'export']
        },
        search: {
          addFieldNames: { 0: 'isOnline' },
          removeFieldNames: ['password', 'tkPassword']
        },
        table: {
          addFieldNames: {
            2: 'userMoneys',
            6: 'userAmountTotal_todayCommissionMoney',
            7: 'userAmountTotal_buyMoney',
            10: 'userAmountTotal_commissionMoney',
            11: 'userAmountTotal_todayRechargeMoney',
            12: 'userAmountTotal_totalRechargeMoney',
            13: 'userAmountTotal_totalRechargeTimes',
            14: 'userAmountTotal_todayTkMoney',
            15: 'userAmountTotal_totalTkMoney',
            16: 'userAmountTotal_todayTkTimes',
            17: 'userAmountTotal_totalTkTimes',
          },
          removeFieldNames: ['password', 'tkPassword']
        },
      },
      fieldConfigsMap: {
        isOnline: {
          search: {
            fieldName: 'isOnline',
            uiType: 'bool',
            simpleLabel: '是否在线',
          }
        },
        username: {
          table: {
            style: 'font-size:15px;',
          }
        },
        levelId: {
          table: {
            style: 'font-size:14px;',
          }
        },
        userMoneys: {
          table: {
            fieldName: 'userMoneys',
            style: 'font-size:15px;',
            group: this.$t('数额'),
            simpleLabel: this.$t('余额'),
            // uiType: 'text',
            render(h, entity, attrs) {
              const amount = this.innerValue && this.innerValue.length && this.innerValue[0].amount || 0
              return <span style={'font-size:15px;'}>
                {NumUtil.formatMoney(amount, This.$store.get('currency'))}</span>
            }
          }
        },
        userAmountTotal_todayCommissionMoney: this.getCfg('数额', 'todayCommissionMoney', '今日佣金金额'),
        userAmountTotal_commissionMoney: this.getCfg('数额', 'commissionMoney', '总佣金金额'),

        userAmountTotal_todayRechargeMoney: this.getCfg('充值提现', 'todayRechargeMoney', '今日充值金额'),
        userAmountTotal_totalRechargeMoney: this.getCfg('充值提现', 'totalRechargeMoney', '累计充值金额'),
        userAmountTotal_totalRechargeTimes: this.getCfg('充值提现', 'totalRechargeTimes', '累计充值次数'),
        userAmountTotal_todayTkMoney: this.getCfg('充值提现', 'todayTkMoney', '今日提款金额'),
        userAmountTotal_totalTkMoney: this.getCfg('充值提现', 'totalTkMoney', '累计提款金额'),
        userAmountTotal_todayTkTimes: this.getCfg('充值提现', 'todayTkTimes', '今日提款次数'),
        userAmountTotal_totalTkTimes: this.getCfg('充值提现', 'totalTkTimes', '累计提款次数'),
      }
    }
    await this.getTableConfigDb()
  },
  methods: {
    getCfg(group, propCode, propLabel) {
      let propCfg = this.userAmountTotalTableInfo.fieldConfigsMap[propCode];
      if (propCfg) {
        propLabel = propCfg.base.simpleLabel
      }
      // group = this.fieldConfigsMap[propCode].base.group
      return {
        table: {
          fieldName: 'userAmountTotal_' + propCode,
          group: this.$t(group),
          simpleLabel: propLabel,
          render(h, entity, attrs) {
            const userAmountTotal = entity.userAmountTotal || {}
            return <span>{userAmountTotal[propCode]}</span>
          }
        }
      }
    },
    showForm(data) {
      this.formData = { ...data.entity }
      this.formDataOption = data.option
      this.dialogFormVisible = true
    },
    openList(scope) {
      this.user = scope.row
      this.userId = scope.row.id
      this.showList = true
    },
    openRechargeDialog(scope) {
      this.user = scope.row
      this.userId = scope.row.id
      this.showRechargeDialog = true
    },
    async listUserMoney(data) {
      const users = data.records
      const userMoneys = await $$get('/commonData/selectList/userMoney', { userId: '#in#' + users.map(u => u.id).join(',') })
      const userMoneysMap = CollUtil.listToListMap(userMoneys, 'userId')
      const userAmountTotals = await $$get('/commonData/selectList/userAmountTotal', { userId: '#in#' + users.map(u => u.id).join(',') })
      const userAmountTotalMap = CollUtil.listToMap(userAmountTotals, 'userId')
      users.forEach(u => {
        this.$set(u, 'userMoneys', userMoneysMap[u.id])
        this.$set(u, 'userAmountTotal', userAmountTotalMap[u.id])
        this.$set(u, 'userAmountTotal_todayCommissionMoney', 1)
        this.$set(u, 'userAmountTotal_commissionMoney', 1)
        this.$set(u, 'userAmountTotal_todayRechargeMoney', 1)
        this.$set(u, 'userAmountTotal_totalRechargeMoney', 1)
        this.$set(u, 'userAmountTotal_totalRechargeTimes', 1)
        this.$set(u, 'userAmountTotal_todayTkMoney', 1)
        this.$set(u, 'userAmountTotal_totalTkMoney', 1)
        this.$set(u, 'userAmountTotal_todayTkTimes', 1)
        this.$set(u, 'userAmountTotal_totalTkTimes', 1)
      })
    },
  }
}
</script>
