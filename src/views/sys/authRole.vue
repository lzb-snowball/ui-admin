<script>
import configEntity from '@/views/component/configEntity.vue'
import routeTree from '@/views/sys/routeTree.vue'

export default {
  name: 'authRole',
  components: { routeTree },
  extends: configEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'authRole',
      }
    }
  },
  created() {
    const This = this
    this.tableConfigUnit = {
      entityName: 'userAuthRole',
      tableConfigs: {
        table: {
          removeFieldNames: ['routeCodes','superFlag']
          // getPageUrl:'',
          // deleteUrl:'',
        },
        search: {
          removeFieldNames: ['routeCodes']
        },

        form: {
          // addFieldNames: ['routeCodes'],
          // removeFieldNames: [''],
          getOneUrl: '/commonData/selectOne/authRole',
          insertUrl: '/commonData/insert/authRole',
          updateUrl: '/commonData/update/authRole',
        },

      },
      fieldConfigsMap: {
        routeCodes: {
          base: {
            fieldName: 'routeCodes',
            render() {
              return <routeTree v-model={this.innerValue}></routeTree>
            },
            simpleLabel: this.$t('权限树')
          },
          tableColumn: {},
          tableSearch: {},
          form: {},
          table: {}
        }
      }
    }
  },
  methods: {}
}
</script>
