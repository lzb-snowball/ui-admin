<template>
  <div>
    <areaFormDialog
      v-if="tableConfigUnitInner.loaded"
      v-model="scope.value"
      :table-config-unit="tableConfigUnitInner"
      :form-data.sync="formData"
      :form-data-option="formDataOption"
      :form-config="{hideNullGroup:['银行卡信息'],saveButtonLabel:'代付'}"
      @saveSuccess="scope.value=false;$emit('transferSuccess')"
    />
    payBanksMerchant={{ payBanksMerchant }}
    payBanksFilter={{ payBanksFilter }}
  </div>
</template>
<script>
import userEntity from '@/views/component/userEntity.vue'
import MixinScope from '@/parent-ui/src/main/js/mixin/MixinScope'
import { Areas, Option } from '@/parent-ui/src/main/ui-element/autotable/area'
import Zselect from '@/parent-ui/src/main/ui-element/zselect.vue'
import CollUtil from '@/parent-ui/src/main/js/utils/CollUtil'

export default {
  name: 'UserTransferDialog',
  components: { Zselect },
  extends: userEntity,
  mixins: [MixinScope],
  props: {
    params: {},
  },
  data() {
    return {
      formData: { bankCodeFilter: true, payoutChannelId: null },
      payoutChannelMap: {},
      payBanksAll: [],
      payBanksMerchant: [],
      payBanksFilter: [],
    }
  },
  watch: {
    // 'formData'(newVal) {
    //   console.log('formData.payoutChannelId change', newVal)
    // }
    // params() {
    //   this.formData = {...this.formData, ...this.params, id: null, userWithdrawId: this.params.id}
    // },
    formData: {
      handler(newVal) {
        // console.log('formData.payoutChannelId change', newVal)
        this.filterBankList(this.payBanksAll, newVal)
        const form = this.tableConfigUnit.tableConfigs.form
        if (newVal.payoutChannelId && form && form.removeFieldNames) {
          if (this.payBanksMerchant.length) {
            // 有选择 就恢复
            const index = form.removeFieldNames.indexOf('bankCode')
            if (index >= 0) {
              form.removeFieldNames.splice(index, 1)
            }
          } else {
            // 没有选择 就移除
            form.removeFieldNames.push('bankCode')
          }
        }
        // console.log('formData handler', this.payBanksFilter)
        // this.$emit('update:pageParams', newVal)
      },
      deep: true
    },
  },
  async created() {
    this.payBanksAll = await $$get('/commonData/selectList/payBank', { enabled: true })
    this.payoutChannelMap = CollUtil.listToMap(await $$get('/commonData/selectList/payoutChannel', { enabled: true }), 'id')
    // console.log('this.payoutChannelMap', this.payoutChannelMap)

    const THIS = this
    this.tableConfigUnit = {
      entityName: 'userTransfer',
      tableConfigs: {
        form: {
          adminButtons: ['add'],
          // @ApiModelProperty(value = "代付渠道银行过滤名称")
          //     @JTDField(group = "代付信息", defaultValue = "1")
          // private Boolean bankCodeFilter;
          addFieldNames: ['bankCodeFilter'],
          removeFieldNames: ['type', 'applyAmount', 'fee', 'status', 'agentStatus', 'beforeMoney', 'money', 'afterMoney', 'rejectReason', 'coinCode', 'exchangeRate', 'coinAmount', 'payNo', 'state', 'offlineFlag', 'errorMessage'],
          // fieldNames: [
          //   'type',
          //   'money',
          //   'userRemark',
          //   'remark',
          // ],
        }
      },
      fieldConfigsMap: {
        bankCodeFilter: {
          form: {
            fieldName: 'bankCodeFilter',
            simpleLabel: '代付银行过滤名称',
            uiType: 'bool',
            group: '代付信息',
          }
        },
        bankCode: {
          form: {
            notNull: 'not_null',
            render(h, entity, attrs, area) {
              // console.log('bankCode render', entity)
              if (!entity.payoutChannelId || !THIS.payBanksMerchant.length) {
                return <div></div>
              }
              // return <div>{THIS.payBanks.length}</div>
              // THIS.payBanksFilter = THIS.filterBankList(THIS.payBanks, entity)
              return <zselect v-model={entity.bankCode} dictList={THIS.payBanksFilter} list-code='code'
                list-label='name' placeholder={'代付银行'}/>
            }
          },
        },
      },
    }
    this.formDataOption = Option.insert
    this.formData = { ...this.formData, ...this.params, id: null, userWithdrawId: this.params.id }
    this.getTableConfigDb()
  },
  methods: {
    filterBankList(bankList, formObj) {
      if ((!bankList) || (!bankList.length) || (!formObj)) {
        return []
      }
      const payoutChannel = this.payoutChannelMap[formObj.payoutChannelId]
      bankList = bankList.filter(bank => bank.merchantCode === (payoutChannel && payoutChannel.merchantCode))
      this.payBanksMerchant = bankList
      if (!formObj.bankCodeFilter) {
        this.payBanksFilter = bankList
      } else {
        const bankName = formObj.bankName || formObj.cardType
        let listFilterName = bankList.filter(bank => bank.code === 'SYSTEMPAY' || (bankName && (bank.code === bankName || bank.name === bankName)))
        if (listFilterName.length === 0) {
          listFilterName = bankList.filter(bank => bank.code === 'SYSTEMPAY' || (bankName && (bank.code.includes(bankName) || bank.name.includes(bankName))))
        }
        this.payBanksFilter = listFilterName
      }
    },
  }
}
</script>
