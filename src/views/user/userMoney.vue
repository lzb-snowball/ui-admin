<script>
import userEntity from '@/views/component/userEntity.vue'

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
