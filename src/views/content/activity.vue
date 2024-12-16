<script>
import configEntity from '@/views/component/configEntity.vue'

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
