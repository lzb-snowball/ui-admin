import store from '@/store'
import ObjectUtil from '@/parent-ui/src/main/js/utils/ObjectUtil'
import router from "@/router";

// eslint-disable-next-line no-unused-vars
let fileServer = ''

export function setFileServer(fileServer_new) {
    fileServer = fileServer_new
}

export function getFileServer() {
    return fileServer
}

let default_pic = ''

export function setDefaultPic(pic) {
    default_pic = pic
}

const isProd = process.env.NODE_ENV === 'production'

const mixin = {
    computed: {
        ...Vuex.mapGetters([
            // 'account',
            // 'serviceTime',
            // 'levelMap',
            // 'currency',
            // 'coinList',
            // 'coinMap',
            // 'paramMap'
        ])
    },
    data() {
        return {
            mixin: {
                appName: process.env.VUE_APP_APPLICATION,
                hideProps: {},
                isProd,
                urlHead: '/', // mixin_defaultForm.js和mixin_defaultPage.js中需要用到的
                model: null
            }
        }
    },
    filters: {
        getDateYMD(dateTime) {
            const date = new Date(dateTime)
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const day = date.getDate().toString().padStart(2, '0')
            return `${date.getFullYear()}-${month}-${day}`
        },
        getDateMD(dateTime) {
            const date = new Date(dateTime)
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const day = date.getDate().toString().padStart(2, '0')
            return `${month}-${day}`
        },
        getTimeHM(dateTime) {
            const date = new Date(dateTime)
            const hour = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')
            // 时间格式HH:MM:SS
            return `${hour}:${minutes}`
        },
        getTimeHMS(dateTime) {
            const date = new Date(dateTime)
            const hour = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')
            const seconds = date.getSeconds().toString().padStart(2, '0')
            // 时间格式HH:MM:SS
            return `${hour}:${minutes}:${seconds}`
        },
        getDateTime(dateTime) {
            return dateTime && dateTime.replace(/T/g, ' ')
        },
        getDiffDays(dateTime) {
            const now = new Date()
            const date = new Date(dateTime)
            return parseInt((date - now) / (1000 * 3600 * 24))
        }
    },
    created() {
    },
    methods: {
        async getUserInfo(username) {
            window.open(`/user/list?username=${username}`, '_blank')
        },
        jump(url, newPage = false) {
            if (newPage) {
                window.open(url, '_blank')
                return
            }
            url && (url.indexOf('http') > -1 && (location.href = url) || (this.$router.push({path: url})))
        },
        // 如果取不到多语言,就默认当前词组
        FormatDateTime(date) {
            return this.Format(date, 'yyyy-MM-dd HH:mm:ss')
        },
        addDay(date, days) {
            return new Date(date.getTime() + 24 * 3600 * 1000 * days)
        },
        // Format: function(date, fmt = 'yyyy-MM-dd') {
        //   const o = {
        //     'M+': date.getMonth() + 1,
        //     'd+': date.getDate(),
        //     'h+': date.getHours(),
        //     'm+': date.getMinutes(),
        //     's+': date.getSeconds(),
        //     'q+': Math.floor((date.getMonth() + 3) / 3),
        //     'S': date.getMilliseconds()
        //   }
        //   if (/(y+)/.test(fmt)) {
        //     fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        //   }
        //   for (var k in o) {
        //     if (new RegExp('(' + k + ')').test(fmt)) {
        //       fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        //     }
        //   }
        //   return fmt
        // },
        Format: function (datetime, fmt = 'yyyy-MM-dd') {
            const o = {
                'M+': datetime.getMonth() + 1, // 月份
                'd+': datetime.getDate(), // 日
                'H+': datetime.getHours(), // 小时
                'm+': datetime.getMinutes(), // 分
                's+': datetime.getSeconds(), // 秒
                'q+': Math.floor((datetime.getMonth() + 3) / 3), // 季度
                'S': datetime.getMilliseconds() // 毫秒
            }
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + '').substr(4 - RegExp.$1.length))
            }
            for (const k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
                }
            }
            return fmt
        },
        // 如果取不到多语言,就默认取英语 TODO
        $t(messageCode) {
            return messageCode
        },
        // $t(messageCode, params, defaultStr) {
        //     let searchResult = this.$t(messageCode, params);
        //     if (messageCode.indexOf('') === 0) {
        //         //没找到返回原key
        //         if (searchResult === messageCode) {
        //             return defaultStr || ''
        //         }
        //         //找到了
        //         else {
        //             return searchResult
        //         }
        //     }
        //     return searchResult
        // },
        // isEmpty(o) {
        //   return o == null || typeof o === 'undefined' || o === 'undefined' || o.length <= 0
        // },
        isNull(o) {
            return o == null || typeof o === 'undefined' || o === 'undefined'
        },
        isTrue(o) {
            return o === true
        },
        async getParamValue(code) {
            // return await this.$store.dispatch('common/getParam', code)
            const This = this
            let times = 0 // 执行次数
            const everyDelay = 100 // 延期时间
            const timeout = 5000 // 超时时间
            return new Promise((resolve, reject) => {
                if (!This.paramMap) {
                    setTimeout(async () => {
                        times++
                        if (times * everyDelay > timeout) {
                            reject('超时', timeout)
                        }
                        resolve(await This.getParamValue(code))
                    }, 200)
                } else {
                    resolve(This.paramMap[code])
                }
            })
        },
        // yyyy-MM-dd HH:mm:ss
        readDate: function (date) {
            try {
                // 解决ios手机时间格式化NAN问题
                if (typeof (date) === 'string' && date.indexOf('-') !== -1) {
                    date = date.replace(/-/g, '/')
                }
                date = new Date(date)
            } catch (e) {
                console.error('date error', e)
            }
            return date
        },
        async getParamsByPcode(pcode) {
            return await this.$store.dispatch('common/getParamsByPcode', pcode)
        },

        loadingConfig() {
            return {lock: true, text: 'Loading', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'}
        },
        hasPerm(value) {
            return store.permsAll.some(perm => {
                return perm.includes(value)
            })
        },
        getUploadPath(module) {
            return '/api/upload/'
        },
        getQiniuUploadPath(module) {
            return '/api/common/uploadQiniu/' + module
        },
        getFileViewUrl(file) {
            if (file && file.indexOf('/static') === 0) {
                let server = fileServer
                server = this.subStringEnd(server, '/api/')
                server = this.subStringEnd(server, '/api')
                return server + file
            }
            return file && file.replace(/{host}/g, fileServer)
        },
        // 若末尾匹配,去掉末尾
        subStringEnd(s, end) {
            let rs = s
            if (s.lastIndexOf(end) === s.length - end.length) {
                rs = s.substring(0, s.length - end.length)
            }
            return rs
        },
        getFileViewContent(richTextContent) {
            if (!richTextContent) {
                return richTextContent
            }
            return richTextContent.replace(/src="file/g, 'src="' + fileServer + 'file')
        },
        getDefaultPic() {
            return default_pic
        },
        // 获取时间中的小时的值(24小时),通过判断时间段返回对应的文本
        getTimeState() {
            // 获取当前时间
            const timeNow = new Date()
            // 获取当前小时
            const hours = timeNow.getHours()
            // 设置默认文字
            let text = ``
            // 判断当前时间段
            if (hours >= 0 && hours <= 10) {
                text = `早上好`
            } else if (hours > 10 && hours <= 14) {
                text = `中午好`
            } else if (hours > 14 && hours <= 18) {
                text = `下午好`
            } else if (hours > 18 && hours <= 24) {
                text = `晚上好`
            }
            // 返回当前时间段对应的状态
            return text
        },
        getNowTime() {
            const date = new Date()
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const day = date.getDate().toString().padStart(2, '0')
            const hour = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')
            const seconds = date.getSeconds().toString().padStart(2, '0')
            return `${date.getFullYear()}-${month}-${day} ${hour}:${minutes}:${seconds}`
        },
        playAudio(id) {
            const myAudio = document.getElementById(id || 'myAudio')
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
        },
        getTextarea(value) {
            // 格式化文字展示文本域格式文字
            if (value) {
                let newString = value.replace(/\n/g, '_@').replace(/\r/g, '_#')
                newString = newString.replace(/_#_@/g, '<br/>') // IE7-8
                newString = newString.replace(/_@/g, '<br/>') // IE9、FF、chrome
                newString = newString.replace(/\s/g, '&nbsp;') // 空格处理
                return newString
            }
            return ''
        },
        // 复制成功
        onCopy(e) {
            this.$toast.success('复制成功')
        },
        showProp(propKey) {
            // 不在隐藏列表中
            return Object.keys(this.mixin.hideProps).indexOf(propKey) < 0
        },
        getHideProps(vue) {
            this.mixin.hideProps = this.hidePropsMap && this.hidePropsMap[vue] || {}
            console.log('this.mixin.hideProps', this.mixin.hideProps)
            return this.mixin.hideProps
        },
        formatMoney(money, currency = this.currency || '') {
            if (money == null) money = 0
            money = parseFloat(money)
            if (currency === 'VND' || currency === '₫') {
                money = money.toFixed(0).toString().replace(/\d(?=(?:\d{3})+\b)/g, '$&.')
                return money + ' ' + currency
            }
            money = money.toFixed(2).toString().replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
            if (currency.toUpperCase() === 'USDT' || currency.toUpperCase() === 'TRX') {
                return money + ' ' + currency
            }
            return currency + ' ' + money
        },
        formatNumber(value, digitNumber = 2) {
            if (value == null) {
                value = 0
            }
            return value.toFixed(digitNumber).toString().replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
        },
        // toLink(url) {
        //   url.indexOf('http') > -1 ? window.location.href = url : router.push({ path: url })
        // },
        underlineToCamel(inputString) {
            return inputString.replace(/_([a-z])/g, function (match, group1) {
                return group1.toUpperCase()
            })
        },
        /**
         * 取多个参数中,第一个不为空(但可能为false)的参数
         */
        orNotNull(...objects) {
            const objectNotNulls = Array.from(objects).filter(o => ObjectUtil.isNull(o))
            if (objectNotNulls.length) {
                return objectNotNulls[0]
            }
            return null
        },
        addFrom(oriObj) {
            return {
                ...oriObj,
                id: null,
                createTime: null,
                updateTime: null
            }
        },
        deepEqual(obj1, obj2) {
            if (obj1 === obj2) {
                return true
            }

            if (typeof obj1 !== typeof obj2) {
                return false
            }

            if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) {
                return obj1 === obj2
            }

            if (Array.isArray(obj1) && Array.isArray(obj2)) {
                if (obj1.length !== obj2.length) {
                    return false
                }

                for (let i = 0; i < obj1.length; i++) {
                    if (!this.deepEqual(obj1[i], obj2[i])) {
                        return false
                    }
                }

                return true
            }

            if (Object.keys(obj1).length !== Object.keys(obj2).length) {
                return false
            }

            for (const key of Object.keys(obj1)) {
                if (!this.deepEqual(obj1[key], obj2[key])) {
                    return false
                }
            }

            return true
        }
    }
}
/**
 * 字典
 */
export default mixin
