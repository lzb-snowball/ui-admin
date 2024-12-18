<script>
import userEntity from '@/parent-ui/src/main/business/admin/userEntity.vue'

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
