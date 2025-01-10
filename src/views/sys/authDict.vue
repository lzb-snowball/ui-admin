<template>
  <div v-if="tableConfigUnitInner.loaded" class="pa-4">
    <!--搜索-->
    <areaSearch
      :table-config-unit="tableConfigUnitInner"
      :page-params.sync="pageParams"
      @getPage="getPage"
      @showForm="showForm"
    >
      <template #buttonAfter>
        <el-button size="small" type="warning" @click="reload" class="mr-2">{{$t('刷新站点全部缓存')}}</el-button>
        <el-button size="small" type="warning" @click="reloadTranslateKeys" class="mr-2">{{$t('翻译键值')}}</el-button>
        <el-checkbox v-model="isAllExpanded" size="small" type="warning" @change="toggleExpand">{{$t('展开')}}</el-checkbox>
      </template>
    </areaSearch>
    <!--表格-->
    <areaTable
      ref="table"
      default-expand-all
      :table-config-unit="tableConfigUnitInner"
      :page-params="pageParams"
      @showForm="showForm"
    />
    <!--编辑弹窗-->
    <areaFormDialog
      v-model="dialogFormVisible"
      :table-config-unit="tableConfigUnitInner"
      :form-data="formData"
      :form-data-option="formDataOption"
      @saveSuccess="getPage();dialogFormVisible=false"
    />
    <el-dialog v-if="reloadTranslateKeysContentDialog" :visible.sync="reloadTranslateKeysContentDialog" title="翻译键值">
      <div v-html="reloadTranslateKeysContent" ></div>
    </el-dialog>
  </div>
</template>
<script>
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'
import baseField from '@/parent-ui/src/main/ui-element/autotable/baseField.vue'
import zselectAppend from '@/parent-ui/src/main/ui-element/zselectAppend.vue'
import zselect from '@/parent-ui/src/main/ui-element/zselect.vue'
import zinput from '@/parent-ui/src/main/ui-element/zinput.vue'
import { Areas } from '@/parent-ui/src/main/ui-element/autotable/area'
import CollUtil from '@/parent-ui/src/main/js/utils/CollUtil'

export default {
  name: 'AuthDict',
  components: { baseField, zinput, zselect, zselectAppend },
  extends: configEntity,
  // $dataEnums: ['EnumRegisterProps', 'EnumRegisterUsernameFrom'], // 例如 EnumSex
  data() {
    return {
      reloadTranslateKeysContentDialog:false,
      reloadTranslateKeysContent:'',
      isAllExpanded: true,
      pageParams: {
        pageSize: 2000,
        pageSizes: [2000],
      },
    }
  },
  async created() {
    const THIS = this
    this.tableConfigUnit = {
      entityName: 'authDict',
      tableConfigs: {
        table: {
          page:{
            hide:true
          },
        },
        search: {},
        form: {},
        base: {
          rowKey: 'code',
          afterPage: (page) => { page.records = CollUtil.buildTree(page.records); return page },
          adminButtons: ['query', 'edit']
        }
      },
      fieldConfigsMap: {
        label: {
          base: {
            width: 350
          }
        },
        value: {
          base: {
            render(h, entity, attrs, area) {
              // console.log('AuthDict Value ', entity.inputType + ' ' + this.innerValue + ' '+JSON.stringify(attrs)+ ' '+area)
              const onChangeFun = Areas.table === area ? () => { THIS.changeValue(entity) } : () => {}
              // return <div>{this.innerValue}</div>
              switch (entity.inputType) {
                case 'bool':
                  return <zswitch is-edit={this.hasPerm('authDict', 'update')} v-model={entity.value} active-color={'#13ce66'} inactive-color={'#ff4949'}
                    active-value={'1'} inactive-value={'0'} onChange={onChangeFun}/>
                case 'select':
                  if (entity.enumClassMultiple) {
                    return <zselectAppend v-model={entity.value} classname={entity.enumClass}
                      placeholder={'请选择'} w={'100%'}/>
                  } else {
                    return <zselect v-model={entity.value} classname={entity.enumClass}
                      placeholder={'请选择'}/>
                  }
                case 'image':
                  return <zupload v-model={entity.value} module={'front'} height={'60px'}/>
                case 'time':
                  return <el-time-picker v-model={entity.value}
                    picker-options={{ selectableRange: '00:00:00 - 23:59:59' }}
                    value-format={'HH:mm:ss'} format={'HH:mm:ss'} placeholder={'选择时间'}/>
                default:
                  return <zinput v-model={this.innerValue} type={entity.inputType} placeholder={attrs.placeholder} size={attrs.size}/>
              }
            }
          },
        },
      },
    }
    this.getTableConfigDbShowAdmin()

    // console.log('this.$route', this.$route.fullPath)
    // console.log('this.isDeveloper', this.isDeveloper)
    // this.tableConfigUnit.tableConfigs.base.removeFieldNames = this.isDeveloper ? ['enumClassMultiple'] : ['enumClassMultiple','showUser', 'showAdmin', 'enabled']
    if (!this.isDeveloper) {
      this.tableConfigUnit.tableConfigs.table.fieldNames = ['label', 'value', 'remark']
      this.tableConfigUnit.tableConfigs.search.fieldNames = ['label', 'value', 'remark']
      this.tableConfigUnit.tableConfigs.form.fieldNames = ['label', 'value', 'remark']
      this.pageParams.showAdmin = 1
    }
  },
  methods: {
    async reload(data) {
      await $$get('/common/reload')
      this.$message.success('操作成功')
    },
    async reloadTranslateKeys(data) {
      this.reloadTranslateKeysContent = await $$get('/commonTable/reloadTranslateKeys')
      this.$message.success('操作成功')
      this.reloadTranslateKeysContent
      this.reloadTranslateKeysContentDialog = true
    },
    async changeValue(entity) {
      console.log('this.$refs.table.pageLoading', this.$refs.table.pageLoading)
      // this.$nextTick(async() => {
      if (!this.$refs.table.pageLoading) {
        const id = entity.id
        const value = entity.value
        await $$post('/commonData/update/authDict', { id, value })
        this.$message.success('操作成功')
      }
      // })
    },
    toggleExpand(isAllExpanded) {
      // 切换展开或折叠状态
      // this.isAllExpanded = !this.isAllExpanded
      const tableVue = this.$refs.table
      const records = tableVue.pageResponse.records
      const tableRef = tableVue.$refs.table
      console.log('toggleExpand records',records)
      console.log('toggleExpand tableVue',tableVue)

      // 获取当前行的所有树形行并进行折叠或展开
      records.forEach(row => {
        tableRef.toggleRowExpansion(row, isAllExpanded) // 折叠
      })
    },
  }
}
</script>
