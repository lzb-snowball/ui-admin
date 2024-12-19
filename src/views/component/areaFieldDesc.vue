<template>
  <div>
    参数取值举例:
    <CodeMirrorEditor :value="description" :read-only="true"/>
  </div>
</template>

<script>
import CodeMirrorEditor from "@/parent-ui/src/main/other-framwork/CodeMirrorEditor.vue";

export default {
  name: 'areaFieldDesc',
  components: {CodeMirrorEditor},
  props: {
    getDescription:{}
  },
  data() {
    return {
      description:'',
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.description = this.getDescription()
      }, 500)
    })
  },
  methods: {
  }
}
</script>
