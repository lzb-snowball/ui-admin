<script>
import userEntity from '@/parent-ui/src/main/business/admin/userEntity.vue'

export default {
  name: 'userTransfer',
  extends: userEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'userTransfer',
        tableConfigs: {
          base: {
            adminButtons: ['query']
          }
        },
      }
    }
  },
}
</script>
