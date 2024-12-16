const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  // isLogin: state => state.user.isLogin,
  // account: state => state.user.userInfo,
  // todoNumber: state => state.user.todoNumber,
  // rechargeAmount: state => state.user.rechargeAmount || 0,
  //
  // serviceTime: state => state.common.serviceTime,
  // paramMap: state => state.common.paramMap,
  // siteTitle: state => state.common.siteTitle,
  // currency: state => state.common.currency,
  // noticeList: state => state.common.noticeList || [],
  // coinList: state => state.common.coinList || [],
  // coinMap: state => state.common.coinMap || [],
  //
  // // 菜单(有权访问的)
  // menuRouter: state => state.user.menuRouter,
  // menuTree: state => state.user.menuTree,
  // // Map<菜单code,是否有权访问>
  // menuCodeMap: state => state.user.authInfo.menuCodeMap,
  // permsAll: state => state.user.permsAll,
  //
  // levelList: state => state.user.levelList,
  // levelMap: state => state.user.levelMap
  paramMap: () => {}
}
export default getters
