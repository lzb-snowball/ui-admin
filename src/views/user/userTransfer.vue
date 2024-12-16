<script>
import userEntity from '@/views/component/userEntity.vue'

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
