<script>
import configEntity from '@/views/component/configEntity.vue'

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
