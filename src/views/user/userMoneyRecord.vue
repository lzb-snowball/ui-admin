<script>
import userEntity from '@/parent-ui/src/main/business/admin/userEntity.vue'

export default {
  name: 'userMoneyRecord',
  extends: userEntity,
  $dataEnums: ['EnumTradeType'],
  data() {
    return {
      tableConfigUnit: {
        entityName: 'userMoneyRecord',
        fieldConfigsMap: {
          recordType: {
            table: {
              type: 'select',
              uiType: 'select',
              classname: 'EnumTradeType',
            }
          }
        }
      }
    }
  },
}
</script>
