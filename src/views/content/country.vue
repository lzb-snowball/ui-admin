<script>
import configEntity from '@/views/component/configEntity.vue'

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
