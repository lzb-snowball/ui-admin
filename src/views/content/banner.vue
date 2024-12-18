<script>
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'

export default {
  name: 'banner',
  extends: configEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'banner',
      }
    }
  },
}
</script>
