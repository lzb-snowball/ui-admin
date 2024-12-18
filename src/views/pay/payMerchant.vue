<script>
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'

export default {
  name: 'payMerchant',
  extends: configEntity,
  data() {
    return {
    }
  },
  created() {
    this.getTableConfigDbShowAdmin('payMerchant')
  }
}
</script>
