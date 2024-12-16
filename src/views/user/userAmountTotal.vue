<script>
import userEntity from '@/views/component/userEntity.vue'

export default {
  name: 'userMoneyRecord',
  extends: userEntity,
  $dataEnums: ['EnumTradeType'],
  data() {
    return {
      tableConfigUnit: {
        entityName: 'userAmountTotal',
        fieldConfigsMap: {
        }
      }
    }
  },
}
</script>
