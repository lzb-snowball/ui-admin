/**
 * div 共性属性和方法
 * @type {string[]}
 */

// 默认在父子间继承的属性
const extendsProps = ['disable', 'isEdit', 'hidden']
export default {
  props: {
    w: { type: [String, Number], default: 220 }, // 宽度width
    h: [String, Number], // 高度height
    // placeholder: null,
    disabled: null, // 是否置灰(灰不可编辑)
    isEdit: null, // 编辑模式 或 展示模式(不灰不可编辑)
    hidden: null,
    value: null,
    size: null
    // style: null,
  },
  data() {
    return {}
  },
  created() {
  },
  mounted() {
    // 若未定义的属性，直接继承父组件的属性（便于，父组件隐藏统一隐藏子组件）
    for (const key in extendsProps) {
      const value = this[key]
      if (value == null) {
        if (this.$parent) {
          this[key] = this.$parent[key]
        }
      }
    }
  },
  computed: {
    getStyle() {
      let style = ''
      if (this.w) {
        switch (this.w) {
          case 'auto':
          case '100%':
            style += 'width:' + this.w + ';'
            break
          default:
            style += 'width:' + this.w + 'px;'
            break
        }
      }
      if (this.h) {
        style += 'height:' + this.h + 'px;'
      }
      return style === '' ? null : style
    },
    computedIsEdit() {
      return this.computedProps(['is-edit', 'isEdit'], 'boolean', true)
    },
    computedSize() {
      return this.computedProp('size', 'string', null)
    }
  },
  methods: {
    computedProp(prop, propFieldType, defaultValue) {
      return this.computedProps([prop], propFieldType, defaultValue)
    },
    computedProps(props, propFieldType, defaultValue) {
      let value
      let parent = this
      for (let i = 0; i < 10; i++) {
        if (!parent) {
          return defaultValue
        }
        value = this.getProp(parent._props, props)
        if (this.isNull(value)) {
          value = this.getProp(parent.$attrs, props)
        }
        if (!this.isNull(value)) {
          return value
        }
        parent = parent.$parent
      }
      return defaultValue
    },
    getProp(obj, props) {
      if (obj) {
        for (const prop of props) {
          const val = obj[prop]
          if (!this.isNull(val)) {
            return val
          }
        }
      }
      return null
    }
  }
}
