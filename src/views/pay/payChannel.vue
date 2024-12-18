<script>
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'

export default {
  name: 'payChannel',
  extends: configEntity,
  data() {
    return {
    }
  },
  created() {
    this.getTableConfigDbShowAdmin('payChannel')
  }
}
</script>
