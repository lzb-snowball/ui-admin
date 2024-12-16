<template>
  <div v-if="tableConfigUnitInner.loaded" class="pa-4">
    <el-alert
      :title="$t('链接示例')"
      type="success"
    >
      <el-form label-width="80px" size="mini">
        <el-form-item label="Telegram">
          <el-input :value="`https://t.me/zhangsan`"></el-input>
        </el-form-item>
        <el-form-item label="Whatsapp">
          <el-input :value="`https://wa.me/1234567890`"></el-input>
        </el-form-item>
        <el-form-item label="Line">
          <el-input :value="`https://line.me/R/ti/p/zhangsan`"></el-input>
        </el-form-item>
        <el-form-item label="Facebook">
          <el-input :value="`https://www.facebook.com/zhangsan`"></el-input>
        </el-form-item>
      </el-form>
    </el-alert>
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
    />
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
import configEntity from '@/views/component/configEntity.vue'

export default {
  name: 'Customer',
  extends: configEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'customer',
      }
    }
  },
}
</script>
