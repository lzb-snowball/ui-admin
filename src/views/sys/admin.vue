<script>
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'

export default {
  name: 'admin',
  extends: configEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'admin',
      }
    }
  },
}
</script>
