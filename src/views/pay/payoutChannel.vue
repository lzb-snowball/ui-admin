<script>
import configEntity from '@/views/component/configEntity.vue'

export default {
  name: 'payoutChannel',
  extends: configEntity,
  data() {
    return {
    }
  },
  created() {
    this.getTableConfigDbShowAdmin('payoutChannel')
  }
}
</script>
