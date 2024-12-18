<script>
import userEntity from '@/parent-ui/src/main/business/admin/userEntity.vue'

export default {
  name: 'userMoney',
  extends: userEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'userMoney',
        tableConfigs: {
          base: {
            addAdminButtons: ['export']
          }
        },
        // fieldConfigsMap: {}
      }
    }
  },
}
</script>
