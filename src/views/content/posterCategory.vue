<script>
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'

export default {
  name: 'posterCategory',
  extends: configEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'posterCategory',
      }
    }
  },
}
</script>
