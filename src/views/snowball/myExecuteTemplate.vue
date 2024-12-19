<template>
  <div v-if="tableConfigUnitInner.loaded" class="pa-4">
    <ztab v-model="pageParams.groupId" entityName="myExecuteGroup" list-code="id" list-label="name"
          @input="getPage({})"></ztab>
    <!--搜索-->
    <areaSearch
        :table-config-unit="tableConfigUnitInner"
        :page-params.sync="pageParams"
        @getPage="getPage"
        @showForm="showForm"
    />
    <!--表格-->
    <areaTable
        ref="table"
        :table-config-unit="tableConfigUnitInner"
        :page-params="pageParams"
        @showForm="showForm"
        :tableColumnPrependCfg="{type:'expand'}"
    >
      <template v-slot:tableColumnPrepend="scope">
        <execute-order :params="{myTemplateId: scope.row.id}"
                       :tableConfigUnitParams="
                              {
                                tableConfigs: {
                                  search: {
                                    hide: true
                                  },
                                  table: {
                                    page:{
                                      hide: true
                                    }
                                  },
                                }
                              }"></execute-order>
      </template>
      <template #tableOptionColumnOther="scope">
        <div v-if="hasPerm('executeOrder','insert')">
          <el-button type="text" size="mini" title="" class="pa-0 mb-4" @click="saveOrUpdate(scope.row,'DOING')">
            开始
          </el-button>
        </div>
        <div v-if="hasPerm('executeOrder','update')">
          <el-button type="text" size="mini" title="" class="pa-0 mb-4" @click="saveOrUpdate(scope.row,'DOING')">
            终止
          </el-button>
        </div>
        <!--        <div v-if="scope.row.merchantCode.includes('SYSTEMPAY')">-->
        <!--          <el-button type="text" size="mini" title="" class="text-red pa-0" @click="directFail(scope.row.id)">-->
        <!--            查看-->
        <!--          </el-button>-->
        <!--        </div>-->
      </template>
    </areaTable>
    <!--编辑弹窗-->
    <areaFormDialog
        v-model="dialogFormVisible"
        :table-config-unit="tableConfigUnitInner"
        :form-data="formData"
        :form-data-option="formDataOption"
        @saveSuccess="getPage();dialogFormVisible=false"
    />
  </div>
</template>
<script>
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'
import Ztab from "@/parent-ui/src/main/ui-element/ztab.vue";
import ExecuteOrder from "@/views/snowball/executeOrder.vue";

export default {
  name: 'myExecuteTemplate',
  components: {ExecuteOrder, Ztab},
  extends: configEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'myExecuteTemplate',
        tableConfigs: {
          base: {
            removeFieldNames: ['groupId']
          },
        },
      }
    }
  },
  methods: {
    saveOrUpdate(row) {
      this.$set(row, 'loading', true)
      let saveOrUpdateFun = this.$refs.table.saveOrUpdateFun
      saveOrUpdateFun().then(res => {
        this.$set(row, 'loading', false)
      }).catch(() => {
        this.$set(row, 'loading', false)
      })
    }
  }
}
</script>
