<!--<template>-->
<!--  <div>adminButtons={{tableConfigUnitInner.tableConfigs.base.adminButtons}}</div>-->
<!--</template>-->
<script>
import configEntity from '@/views/component/configEntity.vue'

export default {
  name: 'SnowballProductRate',
  extends: configEntity,
  props: {
    params: {},
  },
  data() {
    return {
      tableConfigUnit: {
        entityName: 'snowballProductRate',
        tableConfigs: {
          base: {
            removeFieldNames: this.params && this.params.productId ? ['productId'] : [],
            // addAdminButtons: ['query', 'add', 'edit', 'copy', 'delete'],
          }
        }
      },
      pageParams: { ...this.pageParams, ...this.params }
    }
  },
  created() {
    // this.getTableConfigDbShowAdmin('snowballProductRate')
  }
}
</script>
