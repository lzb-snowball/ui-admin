<script>
import configEntity from '@/views/component/configEntity.vue'

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
