import Layout from '@/layout/index'
import { load } from '@/utils/otherUtil'
import { noEmpty } from '@/utils/commonUtil'

/**
 * 根据菜单获取路由信息
 * @param menuTree
 */
export default async function createBigRouteByMenus(menuTree) {
  const list = []
  for (const subMenuTree of menuTree) {
    await recursionTree_addRoutes(subMenuTree, list)
  }
  return {
    path: '/',
    component: Layout,
    children: list
  }
}

// 递归树
async function recursionTree_addRoutes(menu, list) {
  // 中间父节点
  if (noEmpty(menu.children)) {
    await menuCreateRouter(menu, list)
    for (const child of menu.children) {
      await recursionTree_addRoutes(child, list)
    }
  } else {
    // 叶子节点 菜单信息转路由信息
    await menuCreateRouter(menu, list)
  }
}

async function menuCreateRouter(menu, list) {
  if (menu) {
    let componentPath = menu.componentPath || menu.url || menu.path
    if (componentPath) {
      componentPath = componentPath.replace('\\', '/') // \转成/
      componentPath = componentPath.startsWith('/') ? componentPath : '/' + componentPath // 开头拼接/
      const viewPath = menu.viewPath || componentPath
      const componentFun = await load(viewPath)
      if (!componentFun) {
        return // 组件异常,该路由暂不加载
      }
      // const vueName = (await componentFun()).default.name
      list.push({
        // menu.code必须和vue的组件名一致
        name: componentPath,
        path: componentPath,
        component: componentFun,
        hidden: !menu.enabled,
        meta: {
          // vueName: componentPath,
          title: menu.name,
          parentIds: menu.parentId
        }
      })
    }
  }
}
