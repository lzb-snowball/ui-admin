<script>
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'
import CollUtil from '@/parent-ui/src/main/js/utils/CollUtil'

export default {
  name: 'AuthRoute',
  extends: configEntity,
  data() {
    return {
      pageParams: {
        pageSize: 2000,
        pageSizes: [2000],
      },
      tableConfigUnit: {
        entityName: 'authRoute',
        tableConfigs: {
          base: {
            rowKey: 'code',
            afterPage: (page) => {
              page.records = CollUtil.buildTree(page.records)
              page.total = 0
              // page.total = page.records.length
              return page
            },
            removeFieldNames: []
          },
          table: {
            removeFieldNames: ['code', 'pcode'],
            page:{
              hide:true
            },
          },
        },
        fieldConfigsMap: {
          name: {
            base: {
              width: 200
            }
          },
        },
      }
    }
  },
  created() {
    this.getTableConfigDbShowAdmin('authRoute')
    // this.tableConfigUnit.tableConfigs.base.rowKey = 'code'
    // this.tableConfigUnit.tableConfigs.base.afterPage = (page) => {
    //   page.records = CollUtil.buildTree(page.records)
    //   return page
    // }
    // this.tableConfigUnit.fieldConfigsMap.name = {
    //   base: {
    //     width: 200
    //   }
    // }
  }
}
</script>
