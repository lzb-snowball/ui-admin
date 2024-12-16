<template>
  <div class="pa-4 ft-20">
<!--    <el-alert></el-alert>-->
    <userMoneyRecordSearchCount />
    <!--    1.userMoneyRecord 按tradeType分组求和 过滤userId和createTime-->
    <!--    2.订单总计-->
    <!--    3.注册,在线(登录),三方充值,三方代付-->
    <!--    4.平台总收益-->
  </div>
</template>
<script>
import Zdata from '@/parent-ui/src/main/ui-h5/zdata.vue'
import MixinRouteView from '@/parent-ui/src/main/js/mixin/MixinRouteView'
import userMoneyRecordSearchCount from '@/views/count/sub/userMoneyRecordSearchCount.vue'
import Zselect from '@/parent-ui/src/main/ui-element/zselect.vue'
import Zinput from '@/parent-ui/src/main/ui-element/zinput.vue'

export default {
  name: 'Count',
  components: { Zinput, Zselect, userMoneyRecordSearchCount, Zdata },
  mixins: [MixinRouteView],
  props: {},
  // $dataEnums: ['EnumTradeType'], // 例如 EnumSex
  // $dataEntitys: ['agent'], // 例如 EnumSex
  data() {
    return {
    }
  },
  watch: {},
  created() {
  },
  methods: {
  }
}
</script>
