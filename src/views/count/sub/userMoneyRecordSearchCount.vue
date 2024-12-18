<template>
  <div v-if="tableConfigUnitInner.loaded" class="pa-4">
    <!--搜索-->
    <areaSearch
      :table-config-unit="tableConfigUnitInner"
      :page-params.sync="pageParams"
      @getPage="getPage"
    >
      <template #buttonBefore>
        <!--    <el-button type="primary" @click="getPage">查询</el-button>-->
        <el-button size="small" @click="()=>{pageParams.start=pageParams.end=DateUtil.formatDate(new Date());getPage()}">{{$t('今日')}}</el-button>
        <!--    <el-button @click="()=>{pageParams.start=pageParams.end=DateUtil.formatDate(new Date());getPage()}">今日</el-button>-->
        <el-button size="small" @click="()=>{pageParams.start=DateUtil.formatDate(new Date(),'yyyy-MM')+'-01';pageParams.end=DateUtil.formatDate(new Date(),'yyyy-MM-dd');getPage()}">{{$t('本月')}}</el-button>
        <el-button size="small" @click="()=>{pageParams.start=null;pageParams.end=null;getPage()}">{{$t('累计')}}</el-button>
      </template>
    </areaSearch>
   <div class="d-flex u-m-t-8">
      <div class="areaFormGroup text-center u-m-r-8">
        <div class="title">{{$t('实时在线用户数')}}</div>
        {{ userCountLogin && userCountLogin.length && userCountLogin[0].count }}
      </div>
      <div class="areaFormGroup text-center u-m-r-8">
        <div class="title">{{$t('新注册用户数')}}</div>
        {{ userCounts && userCounts.length && userCounts[0].count }}
      </div>
      <div class="areaFormGroup text-center u-m-r-8">
        <div class="title">{{$t('总充值')}}</div>
        {{ getSumAmount('RECHARGE_BACK') + getSumAmount('RECHARGE_ONLINE') }}
      </div>
      <div class="areaFormGroup text-center u-m-r-8">
        <div class="title">{{$t('总提款')}}</div>
        {{ getSumAmount('WITHDRAW') - getSumAmount('WITHDRAW_REJECT') }}
      </div>
      <div class="areaFormGroup text-center u-m-r-8">
        <!--        充值校正-->
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('平台总收益说明')"
          placement="top-start"
        >
          <div class="title">{{$t('平台总收益')}}</div>
        </el-tooltip>
        {{ getSumAmount('RECHARGE_BACK') + getSumAmount('RECHARGE_ONLINE') - ( getSumAmount('WITHDRAW') - getSumAmount('WITHDRAW_REJECT') ) }}
      </div>
    </div>
    <div class="areaFormGroup">
      <div class="title">{{$t('用户帐变统计')}}</div>
      <el-table :is-edit="false" :data="userMoneyRecordCountsGroupBy">
        <el-table-column :label="$t('类型')">
          <template v-slot="scope">
            <div v-if="scope.row.title" class="text-primary">{{ scope.row.title }}</div>
            <zselect v-else classname="EnumTradeType" :value="scope.row.props.recordType" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('总额')">
          <template v-slot="scope">
            <zinput :value="scope.row.sum['userMoneyRecord.amount']" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('人数')">
          <template v-slot="scope">
            <zinput :value="scope.row.countDistinct.userId" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('记录数')">
          <template v-slot="scope">
            <zinput :value="scope.row.count" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import MixinScope from '@/parent-ui/src/main/js/mixin/MixinScope'
import Zinput from '@/parent-ui/src/main/ui-element/zinput.vue'
import Zselect from '@/parent-ui/src/main/ui-element/zselect.vue'
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'
import CollUtil from '@/parent-ui/src/main/js/utils/CollUtil'

export default {
  name: 'UserMoneyRecordSearch',
  components: { Zselect, Zinput },
  extends: configEntity,
  mixins: [MixinScope],
  data() {
    return {
      pageParams: {
        isDemo: false,
        start: null,
        end: null,
        // start: DateUtil.formatDate(new Date()),
        // end: DateUtil.formatDate(new Date()),
      },
      userCounts: [],
      userCountLogin: [],
      userMoneyRecordCounts: [],
      userMoneyRecordCountsGroupBy: [],
      userMoneyRecordCountsGroupByMap: {},
      tableConfigUnit: {
        entityName: 'userMoneyRecord',
        tableConfigs: {
          search: {
            showTableColumnNoGroup:false,
            fieldNames: ['agentId', 'username', 'recordType', 'isDemo'],
            removeFieldNames: ['orderNo'],
            adminButtons: ['query']
          }
        },
        fieldConfigsMap: {
          agentId: {
            base: {
              "fieldName": "agentId",
              "simpleLabel": this.$t("推广代理"),
              "uiType": "select",
              // "mainLength": 20,
              // "group": "邀请",
              "entityClass": "com.pro.common.module.api.agent.model.db.Agent",
              "entityClassKey": "id",
              "entityClassLabel": "username",
              "entityClassTargetProp": "code",
              "entityName": "agent",
              "multiple": false
            }
          },
        },
      }
    }
  },
  created() {
    this.getPage()
  },
  methods: {
    async getPage() {
      this.getUserCounts()
      this.getUserMoneyRecordCounts()
    },
    async getUserCounts() {
      this.userCounts = await $$get('/commonData/selectCountSum/user', {
        ...this.pageParams,
        // groupBys: ['recordType']
      })
      this.userCountLogin = await $$get('/commonData/selectCountSum/user', {
        ...this.pageParams,
        isOnline: true,
        start: null,
        end: null,
        // groupBys: ['recordType']
      })
    },
    async getUserMoneyRecordCounts() {
      this.userMoneyRecordCounts = await $$get('/commonData/selectCountSum/userMoneyRecord', {
        ...this.pageParams,
      })
      this.userMoneyRecordCountsGroupBy = await $$get('/commonData/selectCountSum/userMoneyRecord', {
        ...this.pageParams,
        groupBys: ['recordType']
      })
      this.userMoneyRecordCountsGroupByMap = CollUtil.listToMapFun(this.userMoneyRecordCountsGroupBy, o => o.props.recordType)
      if (this.userMoneyRecordCountsGroupBy.length) {
        this.userMoneyRecordCountsGroupBy.push({
          title: `<${this.$t('总览')}>`,
          ...this.userMoneyRecordCounts[0]
        })
      }
    },
    getSumAmount(type) {
      const o = this.userMoneyRecordCountsGroupByMap[type]
      return o && o.sum['userMoneyRecord.amount'] || 0
    }
  }
}
</script>
