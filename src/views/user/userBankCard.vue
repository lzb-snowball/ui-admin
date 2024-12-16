<script>
import userEntity from '@/views/component/userEntity.vue'

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
