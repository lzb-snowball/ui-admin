<script>
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'

export default {
  name: 'translation',
  extends: configEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'translation',
      }
    }
  },
}
</script>
