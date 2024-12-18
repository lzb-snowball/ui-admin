<script>
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'

export default {
  name: 'payBank',
  extends: configEntity,
  data() {
    return {
    }
  },
  created() {
    this.getTableConfigDbShowAdmin('payBank')
  }
}
</script>
