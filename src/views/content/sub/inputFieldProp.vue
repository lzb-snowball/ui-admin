<template>
  <zdata v-if="submitFormEntityName" :url="`/commonTable/simpleInfo/${submitFormEntityName}`">
    <template #default="{datas}">
      <zselect v-if="datas" v-model="scope.value" :dict-list="datas.fields" :filter="filter" list-code="fieldName" list-label="label" @selectOption="o=>$emit('selectOption',o)" />
      <zinput v-if="datas" v-model="scope.value" @selectOption="o=>$emit('selectOption',o)" />
    </template>
  </zdata>
</template>
<script>
// 界面元素

import Zdata from '@/parent-ui/src/main/ui-h5/zdata.vue'
import zselect from '@/parent-ui/src/main/ui-element/zselect.vue'
import MixinScope from '@/parent-ui/src/main/js/mixin/MixinScope'
import Zinput from "@/parent-ui/src/main/ui-element/zinput.vue";

export default {
  name: 'InputFieldProp',
  components: {
    Zinput,
    Zdata,
    zselect,
  },
  filters: {},
  mixins: [MixinScope],
  props: {
    showDetail: Boolean,
    submitFormEntityName: String,
    filter: Function,
  },
  data() {
    return {
      tableConfigUnit: {},
    }
  },
  watch: {},
  created() {
    console.log('InputFieldProp created' )
    // this.params.opt
  },
  methods: {}
}
</script>
