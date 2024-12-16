import z from './z'
import Pagination from '@/components/Pagination/index'
import base from '@/parent-ui/src/main/ui-element/autotable'

export default {
  install(vue) {
    vue.use(z)
    vue.use(base)
    vue.component('pagination', Pagination)
  }
}
