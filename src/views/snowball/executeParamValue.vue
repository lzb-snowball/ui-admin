<template>
  <value-format-str-to-obj
      v-if="executeParamModel.multipleField"
      v-model="scope.value"
      :defaultValue="'[]'"
  >
    <template v-slot="scope2">
      <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="()=>scope2.scope.value.push({})">
        {{ $t('添加值') }}
      </el-button>
      <el-table size="mini" :data="scope2.scope.value" style="line-height:initial;">
        <template v-for="executeParamField in executeParamFields">
          <el-table-column
              :label="$t(executeParamField.name)"
              :prop="executeParamField.code"
              align="center"
              :width="190"
          >
            <template slot-scope="scope">
              <zinput
                  size="mini"
                  v-model="scope.row[executeParamField.code]"
                  w="170"
              />
            </template>
          </el-table-column>
        </template>
        <el-table-column
            :label="$t('操作')"
            align="center"
            :width="100"
        >
          <template slot-scope="scope3">
            <el-icon name="delete" @click.native="()=>scope2.scope.value.splice(scope3.$index, 1)"></el-icon>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </value-format-str-to-obj>
  <el-input
      v-else
      v-model="scope.value"
      type="textarea"
      :placeholder="executeParamModel.multipleValue?$t('多个值换行符分隔'):''"
      :autosize="{ minRows: 3 }"
  >
  </el-input>
</template>

<script>
import CollUtil from '@/parent-ui/src/main/js/utils/CollUtil'
import mixinScope from "@/parent-ui/src/main/js/mixin/MixinScope";
import ValueFormatStrToObj from "@/parent-ui/src/main/ui-h5/valueFormatStrToObj.vue";
import zselect from "@/parent-ui/src/main/ui-element/zselect.vue";
import Zinput from "@/parent-ui/src/main/ui-element/zinput.vue";

export default {
  name: 'executeParamValue',
  components: {
    Zinput,
    zselect,
    ValueFormatStrToObj,
  },
  props: {
    modelCode: {},
  },
  mixins: [mixinScope],
  data() {
    return {
      executeParamModel: {},
      executeParamFields: [],
    }
  },
  watch: {
    async modelCode(newVal) {
     await this.load()
      // if (this.executeParamModel.multipleField) {
      //   this.scope.value = []
      // } else {
      //   this.scope.value = ''
      // }
    }
  },
  created() {
    this.load()
  },
  methods: {
    async load(){
      this.executeParamModel = await $$get('/commonData/selectOne/executeParamModel', {
        enabled: true,
        code: this.modelCode
      }) || {}
      this.executeParamFields = await $$get('/commonData/selectList/executeParamField', {
        enabled: true,
        modelCode: this.modelCode
      })
      if (this.executeParamModel.multipleField) {
        if (this.executeParamFields.filter(o => o.code === 'code').length === 0) {
          this.executeParamFields.unshift({code:'code',name: this.$t('编号')})
        }
      } else {
        if (this.scope.value === '[]' || this.scope.value === '[{}]') {
          this.scope.value = ''
        }
      }
    }
  }
}
</script>
<style scoped>
.requiredPerm {
  color: #ff0e13;
}
</style>