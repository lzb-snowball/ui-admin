<template>
  <areaFormDialog
      v-model="scope.value"
      :title="$t('充值')+' '+params.username"
      :table-config-unit="tableConfigUnitInner"
      :form-data="formData"
      :form-data-option="formDataOption"
      :save-button-label="'充值'"
      @saveSuccess="scope.value=false;$emit('rechargeSuccess')"
  />
</template>
<script>
import userEntity from '@/views/component/userEntity.vue'
import MixinScope from '@/parent-ui/src/main/js/mixin/MixinScope'
import {Option} from '@/parent-ui/src/main/ui-element/autotable/area'

export default {
  name: 'UserRechargeDialog',
  extends: userEntity,
  mixins: [MixinScope],
  props: {
    params: {},
  },
  data() {
    return {
      tableConfigUnit: {
        entityName: 'userRecharge',
        tableConfigs: {
          form: {
            adminButtons: ['add'],
            fieldNames: [
              'type',
              'money',
              'userRemark',
              'remark',
            ],
          }
        },
        fieldConfigsMap: {
          type: {
            form: {
              uiType: 'radio',
              // RECHARGE_ONLINE("在线充值"),
              // RECHARGE_REGISTER("注册赠送"),
              filter: (enu) => enu.code !== 'RECHARGE_ONLINE' && enu.code !== 'RECHARGE_REGISTER'
            },
          },
        },
      }
    }
  },
  watch: {
    params() {
      this.formData = {...this.formData, ...this.params}
    },
  },
  created() {
    this.formDataOption = Option.insert
    console.log('params', this.params)
  },
}
</script>
