<template>
  <el-dialog v-if="scope.value" :visible.sync="scope.value" width="80%" :title="$t('列表')+' '+params.username">
    <el-tabs v-model="activeName" type="border-card">
      <!--      <el-tab-pane v-if="hasPerm('user:userBankCard')" label="银行卡列表" name="userBankCard" lazy>-->
      <!--        <user-bank-card :params="params"/>-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane v-if="hasPerm('user:userRecharge')" label="充值列表" name="userRecharge" lazy>-->
      <!--        <userRecharge :params="params"/>-->
      <!--      </el-tab-pane>-->

      <el-tab-pane
          v-for="(label,entityName) in
          {
            'userMoneyRecord':'余额变动',
            'userMoney':'余额',
            'userRecharge':'充值',
            'userBankCard':'银行卡',
            'userWithdraw':'提现',
            'userTransfer':'代付',
            'userAddress':'地址',
          }"
          :key="entityName"
          :label="$t(label)"
          :name="entityName"
          lazy
      >
        <component :is="entityName" :params="params"/>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import userBankCard from '@/views/user/userBankCard.vue'
import MixinScope from '@/parent-ui/src/main/js/mixin/MixinScope'
import userRecharge from '@/views/user/userRecharge.vue'
import userMoneyRecord from '@/views/user/userMoneyRecord.vue'
import userMoney from '@/views/user/userMoney.vue'
import userWithdraw from '@/views/user/userWithdraw.vue'
import userTransfer from '@/views/user/userTransfer.vue'
import userAddress from '@/views/user/userAddress.vue'

export default {
  name: 'UserListPopup',
  components: {
    userBankCard,
    userRecharge,
    userMoneyRecord,
    userMoney,
    userWithdraw,
    userTransfer,
    userAddress,
  },
  filters: {},
  mixins: [MixinScope],
  props: {
    params: Object,
  },
  data() {
    return {
      activeName: 'userMoneyRecord',
    }
  },
  watch: {},
  created() {
  },
  methods: {}
}
</script>
