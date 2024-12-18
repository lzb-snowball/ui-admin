<template>
<!--  <div class="full-width pa-2 d-flex justify-end">-->
    <el-select v-bind="$attrs" :value="country.id" placeholder="请选择" @change="selectLanguage" style="">
      <el-option
        v-for="item in countryList"
        :key="item.id"
        :value="item.id"
        :label="' '"
      >
<!--        :label="item.name"-->
        <img :src="getFileViewUrl(item.icon || `/static/country/${item.langCode}.png`)" style="max-width: 20px;" @error="onImageError($event, item.langCode)"><span class="u-m-l-10">{{ item.name }}</span>
      </el-option>
      <template #prefix>
<!--        <div style="">-->
          <img :src="getFileViewUrl(country.icon || `/static/country/${country.langCode}.png`)" @click="showLanguagePop = true" class="" style="max-height: 18px;" @error="onImageError($event, country.langCode)">
<!--          <div class="" style="line-height: 20px;">{{ country.name }}</div>-->
<!--        </div>-->
      </template>
    </el-select>
    <!--    <img :src="getFileViewUrl(country.icon || `/static/country/${country.langCode}.png`)" style="max-width: 30px;" @click="showLanguagePop = true" />-->
    <!--    <el-dialog :title="$t('选择语言')" :visible.sync="showLanguagePop" width="80%">-->
    <!--      <div class="language-list">-->
    <!--        <div-->
    <!--            v-for="(item,index) in countryList"-->
    <!--            :key="index"-->
    <!--            class="box flex-between u-m-b-10"-->
    <!--            :class="{'text-primary selected': country.langCode === item.langCode}"-->
    <!--            @click="selectLanguage(item)"-->
    <!--        >-->
    <!--          <div class="d-flex-center">-->
    <!--            <img :src="getFileViewUrl(item.icon || `/static/country/${item.langCode}.png`)" style="max-width: 30px;" />-->
    <!--            <span class="u-m-l-10">{{ item.name }}</span>-->
    <!--          </div>-->
    <!--          &lt;!&ndash;      <van-icon&ndash;&gt;-->
    <!--          &lt;!&ndash;          v-if="country.langCode === item.langCode"&ndash;&gt;-->
    <!--          &lt;!&ndash;          class="lang-item-right"&ndash;&gt;-->
    <!--          &lt;!&ndash;          color="#379ad5"&ndash;&gt;-->
    <!--          &lt;!&ndash;          name="success"&ndash;&gt;-->
    <!--          &lt;!&ndash;          size="0.64rem"&ndash;&gt;-->
    <!--          &lt;!&ndash;      />&ndash;&gt;-->
    <!--          <img v-if="country.langCode === item.langCode" src="/static/icons/right.svg" alt="">-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
<!--  </div>-->
</template>

<script>

import CollUtil from '@/parent-ui/src/main/js/utils/CollUtil'

export default {
  name: 'Language',
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      showLanguagePop: false,
      countryMap: {},
    }
  },
  created() {
    this.countryMap = CollUtil.listToMap(this.countryList, 'id')
  },
  methods: {
    async selectLanguage(id) {
      const country = this.countryMap[id]
      await this.$i18n.changeLanguage(country.langKey || country.langCode || 'en-US')
      $$post(`/commonData/update/update`, { lang: country.langCode })
      Cookies.set('country',JSON.stringify(country))
      this.$store.set('country', country)
      location.reload()
    },
    onImageError(event, langCode) {
      // 当图片加载失败时，设置为默认的回退图片
      event.target.src = `/static/country/${langCode}.png`;
    },
  }
}
</script>

<style lang="scss" scoped>
.language-list{
  height: 100%;
  .selected{
    background-color: rgba(14, 157, 87, 0.08);
  }
}
::v-deep .el-input__prefix{
  display: flex;
  align-items: center;
}
</style>
