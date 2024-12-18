<script>
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'

export default {
  name: 'sysAddress',
  extends: configEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'sysAddress',
      }
    }
  },
}
</script>
