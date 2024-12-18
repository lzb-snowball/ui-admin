<script>
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'

export default {
  name: 'activity',
  extends: configEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'activity',
      }
    }
  },
}
</script>
