<!--<template>-->
<!--  <div>-->
<!--                <template v-for="(fieldName,index) in fieldNames">-->
<!--                  <template v-if="true !== getFieldConfig(fieldName).hide">-->
<!--                    <div :key="indexGroup+'_'+index" class="areaTableColumnField">-->
<!--                      <div>{{ getFieldConfig(fieldName).simpleLabel }}</div>-->
<!--                      <div>-->
<!--                        <baseField-->
<!--                            :key="`tableColumn_field_${indexGroup}_${fieldName}`"-->
<!--                            v-model="scope.row[fieldName]"-->
<!--                            :area="area"-->
<!--                            :is-edit="isEdit(fieldName)"-->
<!--                            :entity.sync="scope.row"-->
<!--                            :table-config="tableConfig"-->
<!--                            :field-config="getFieldConfig(fieldName)"-->
<!--                            @change="isEdit(fieldName)?saveOrUpdate(scope.row,fieldName):null"-->
<!--                        />-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </template>-->
<!--                </template>-->
<!--              </div>-->
<!--</template>-->
<!--<script>-->
<!--import areaTableUnitExtend from '@/parent-ui/src/main/ui-element/autotable/areaTableUnitExtend.js'-->
<!--import area from "@/parent-ui/src/main/ui-element/autotable/area";-->

<!--/**-->
<!-- * 用户表格组件-->
<!-- */-->
<!--export default {-->
<!--  name: 'UserEntity',-->
<!--  extends: areaTableUnitExtend,-->
<!--  mixins: [area],-->
<!--  props: {-->
<!--    params: {},-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      // formData: {},-->
<!--      // formDataOption: null,-->
<!--      // pageParams: {},-->
<!--      // dialogFormVisible: false,-->
<!--      tableConfigUnit: {-->
<!--        entityName: 'userMoney',-->
<!--        // tableConfigs: {-->
<!--        //   base: {-->
<!--        //     // adminButtons: ['query'],-->
<!--        //     removeAdminButtons: this.params && this.params.userId ? [] : ['add'],-->
<!--        //     removeFieldNames: this.params && this.params.userId ? ['userId', 'username'] : [],-->
<!--        //   },-->
<!--        // },-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  watch: {},-->
<!--  created() {-->
<!--    // this.pageParams = { ...this.pageParams, ...this.params }-->
<!--    // this.formData = { ...this.formData, ...this.params }-->
<!--    // const This = this-->
<!--    this.getTableConfigDb()-->
<!--    this.tableConfigUnit = this.tableConfigUnitInner-->
<!--  },-->
<!--  methods: {-->
<!--    isEdit(fieldName) {-->
<!--        return this.getFieldConfig(fieldName).uiType === 'bool' && !this.getFieldConfig(fieldName).disabled-->
<!--      },-->
<!--  }-->
<!--}-->
<!--</script>-->
