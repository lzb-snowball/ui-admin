<script>
import configEntity from '@/views/component/configEntity.vue'

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
