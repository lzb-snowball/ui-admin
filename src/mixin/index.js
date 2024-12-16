import mixin_common from './mixin_common'
import mixin_request from './mixin_request'
export default {
  install(vue) {
    vue.mixin(mixin_common)
    vue.mixin(mixin_request)
  }
}
