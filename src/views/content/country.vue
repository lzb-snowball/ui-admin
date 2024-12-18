<script>
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'

export default {
  name: 'country',
  extends: configEntity,
  data() {
    return {
    }
  },
  created() {
    this.getTableConfigDbShowAdmin('country')
  }
}
</script>
