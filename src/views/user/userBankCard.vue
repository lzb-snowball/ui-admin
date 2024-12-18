<script>
import userEntity from '@/parent-ui/src/main/business/admin/userEntity.vue'

export default {
  name: 'UserBankCard',
  extends: userEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'userBankCard',
        tableConfigs: {
          base: {
            // adminButtons: ['query', 'edit', 'add', 'delete'],
          }
        }
      }
    }
  },
}
</script>
