<template>
  <div class="d-flex border mr-1">
    <el-tag class="ft-14 mr-1">{{ entity.label }}</el-tag>
    <input-field-prop v-model="prop" class="ml-1" :filter="field=>!field.fieldName.includes('id')&&!field.fieldName.includes('Id')&&!field.fieldName.includes('updateTime')&&!field.fieldName.includes('enabled')" :submit-form-entity-name="entity.entityClass" :select-option="o=>selectOption=o" />
    <span v-if="doubleParantheses" class="ft-14">  <span v-pre>{{</span>{{ entity.dataKey }}.{{ prop }}<span v-pre>}}</span></span>
    <span v-else class="ft-14">  <span v-pre>{</span>{{ entity.dataKey }}.{{ prop }}<span v-pre>}</span></span>
  </div>
</template>
<script>
import MixinScope from '@/parent-ui/src/main/js/mixin/MixinScope'
import InputFieldProp from '@/views/content/sub/inputFieldProp.vue'
export default {
  name: 'PosterEntityView',
  components: { InputFieldProp },
  filters: {},
  mixins: [MixinScope],
  props: {
    doubleParantheses: Boolean,
    entity: Object,
  },
  data() {
    return {
      selectOption: {},
      prop: null,
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
  }
}
</script>
<style scoped>
</style>
