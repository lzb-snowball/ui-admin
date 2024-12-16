<script>
import configEntity from '@/views/component/configEntity.vue'

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
