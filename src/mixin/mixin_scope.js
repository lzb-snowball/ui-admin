export default {
  props: {
    value: {},
    defaultValue: {},
    outsideToInside: {// 外部转内部
      type: Function,
      default: (value) => value
    },
    insideToOutside: {// 内部转外部
      type: Function,
      default: (value) => value
    }
  },
  data() {
    return {
      scope: {
        value: null
      }
    }
  },
  watch: {
    'scope.value': {
      handler(newVal, oldVal) {
        const outVal = this.insideToOutside(newVal)
        if (!this.deepEqual(this.value, outVal)) {
          this.$emit('input', outVal)
        }
      },
      deep: true
    },
    value: {
      handler(newVal, oldVal) {
        const innerVal = this.outsideToInside(newVal || this.defaultValue)
        if (!this.deepEqual(this.scope.value, innerVal)) {
          this.scope.value = newVal
        }
      },
      deep: true
    }
  },
  created() {
    this.scope.value = this.outsideToInside(this.value || this.defaultValue)
  },
  methods: {

  }
}
