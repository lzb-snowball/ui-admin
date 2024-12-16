<script>
import userEntity from '@/views/component/userEntity.vue'

export default {
  name: 'userAddress',
  extends: userEntity,
  props: {
  },
  data() {
    return {
      tableConfigUnit: {
        entityName: 'userAddress',
      }
    }
  },
}
</script>
