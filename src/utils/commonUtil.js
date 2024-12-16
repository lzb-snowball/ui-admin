const util = {
  // data() {
  //   return {
  //   }
  // },
  // created() {
  // },
  methods: {
    empty: function(objOrList) {
      if (typeof objOrList === 'number') {
        return false
      }
      return objOrList == null || objOrList.length === 0 || typeof objOrList === 'undefined'
    },
    noEmpty: function(objOrList) {
      return !empty(objOrList)
    },
    // js默认用||即可   多个入参取第一个不为空的    let userType = or(user.userType,'Default')
    /*  or: function() {
        for (const argu of arguments) {
          if (!empty(argu)) {
            return argu
          }
        }
      }*/
    objEqual: function(a, b) {
      if (!a && !b) {
        return true
      }
      if (a && b) {
        const aProps = Object.getOwnPropertyNames(a)
        const bProps = Object.getOwnPropertyNames(b)
        aProps.remove('__ob__')// 可能是vue生成的属性
        bProps.remove('__ob__')// 可能是vue生成的属性
        if (aProps.length !== bProps.length) {
          return false
        }
        for (let i = 0; i < aProps.length; i++) {
          const propName = aProps[i]
          if (a[propName] !== b[propName]) {
            return false
          }
        }
        return true
      }
      return false
    },
    noNullAppend(appendBefore, param, appendAfter) {
      return param ? appendBefore + param + appendAfter : ''
    },
    playAudio() {
      const myAudio = document.getElementById('myAudio')
      if (myAudio) {
        if (myAudio.paused) {
          try {
            const play = myAudio.play()
            play && play.catch((e) => {
              console.log('播放音频失败,谷歌不允许自动播放,请随意点一下网站任意位置.', arguments)
            })
          } catch (e) {
            console.error(e)
          }
        }
      }
    }
  }
}
/**
 * 超级常用的工具类
 */
export default util
export const empty = util.methods.empty
export const noEmpty = util.methods.noEmpty
export const objEqual = util.methods.objEqual
export const playAudio = util.methods.playAudio

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
