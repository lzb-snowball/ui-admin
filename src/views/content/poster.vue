<template>
  <div class="app-container">
    <div>
      <!--      cate_list={{cate_list}}-->
      <!--      <br/>-->
      <!--      <br/>-->
      <!--      <br/>-->
      <!--      cate_map={{cate_map}}-->
      <!--      <el-checkbox v-if="listQuery.cid" v-model="listQuery.isAllCate">查看所有</el-checkbox>-->
      <zselect v-model="listQuery.lang" :dict-list="country_list" list-code="langCode" size="small":placeholder="$t('语言')" />
      <zselect
        v-model="listQuery.cid"
        :dict-list="cate_list"
        list-code="id"
        list-label="name"
        size="small"
       :placeholder="$t('所属分类')"
        :default-first="false"
      />
      <zinput v-model="listQuery.code" size="small":placeholder="$t('编号')" @keyup.enter.native="search" />
      <zselect
        v-model="listQuery.code"
        entity-name="posterCode"
        w="140"
        list-label="name"
        size="small"
       :placeholder="$t('固有编号')"
      />
      <zselect
        v-model="listQuery.pid"
        w="140"
        :dict-list="listPid"
        list-code="id"
        list-label="title"
        size="small"
       :placeholder="$t('父文章')"
        clearable
      />
      <zinput v-model.trim="listQuery.title" size="small":placeholder="$t('标题')" clearable @keyup.enter.native="search" />
      <zinput v-model="listQuery.remark" size="small":placeholder="$t('备注')" @keyup.enter.native="search" />
      <zinput v-model.trim="listQuery.content" size="small":placeholder="$t('内容')" clearable @keyup.enter.native="search" />
      <zinput v-model.trim="listQuery.confirmButtonText" w="140" size="small":placeholder="$t('确认按钮名称')" clearable />
      <zdatepicker v-model="listQuery.dateRange" size="small" />
      <el-button type="primary" icon="el-icon-search" size="small" @click="search">{{$t('查询')}}</el-button>
      <el-button v-if="hasPerm('poster','insert')" type="primary" icon="el-icon-plus" size="small" @click="handleAdd">{{$t('添加')}}
      </el-button>
    </div>
    <el-tag>{{$t('文章列表链接')}}: /m/poster?catalogId=<{{$t('所属分类')}}></el-tag><br/>
    <el-tag>{{$t('文章详情链接')}}: /m/poster/detail/<{{$t('编号')}}></el-tag>
    <el-table
      v-loading.body="listLoading"
      row-key="id"
      :indent="20"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :is-edit="false"
      :data="list"
      element-loading-text="拼命加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column :label="$t('标题')" prop="title" />
      <el-table-column :label="$t('所属分类')" prop="name" width="100">
        <template v-slot="scope">
          <zselect v-model="scope.row.cid" :dict-list="cate_list" list-code="id" list-label="name" />
<!--          <div v-if="cate_map[scope.row.cid]">{{ cate_map[scope.row.cid].name }}</div>-->
        </template>
      </el-table-column>
      <el-table-column :label="$t('编号')" prop="code">
        <template v-slot="scope">
          <zinput v-model="scope.row.code" />
          <br/>
          <zselect
              v-model="scope.row.code"
              entity-name="posterCode"
              w="140"
              list-label="name"
              size="small"
              :placeholder="$t('固有编号')"
          />
          <!--          <zinput v-model="scope.row.content" />-->
        </template>
      </el-table-column>

      <!--      <el-table-column :label="$t('编号')" prop="code" width="120">-->
      <!--        <template v-slot="scope">-->
      <!--          <zselect v-model="scope.row.code" entity-name="/commonData/selectPages/posterCode" list-code="code" list-label="cname" :not-exist-return-value="true" />-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <!--      <el-table-column :label="$t('图片')" prop="pic" width="100">-->
      <!--        <template v-slot="scope">-->
      <!--          <img :src="getFileViewUrl(scope.row.pic)" height="50">-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column :label="$t('副标题')" prop="subtitle" />-->
      <el-table-column :label="$t('备注')" prop="remark" />
      <!--      <el-table-column :label="$t('简介')" prop="intro" />-->
      <!--      <el-table-column :label="$t('链接地址')" prop="url" />-->
      <el-table-column :label="$t('排序')" prop="sort" width="60" />
      <el-table-column :label="$t('开启')" prop="enabled" width="68">
        <template v-slot="scope">
          <zswitch
            v-model="scope.row.enabled"
            :is-edit="hasPerm('poster','update')"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('语言')" width="80">
        <template v-slot="scope">
          <span v-if="country_map[scope.row.lang]">{{ country_map[scope.row.lang].name }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column :label="$t('确认按钮')" prop="confirmButtonText" align="center" width="80"/>-->
      <!--      <el-table-column :label="$t('上架时间')" prop="publishTime" width="90" />-->
      <el-table-column :label="$t('创建时间')" prop="createTime" width="92">
        <template v-slot="scope">
          {{ DateUtil.format(scope.row.createTime, 'MM-dd hh:mm') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="190">
        <template v-slot="scope">
          <el-button-group>
            <el-button
              v-if="hasPerm('poster','update')"
              type="primary"
              icon="edit"
              size="mini"
              @click="handleUpdate(scope.row)"
            >{{$t('编辑')}}
            </el-button>
            <el-button
              v-if="hasPerm('poster','insert')"
              type="primary"
              plain
              icon="edit"
              size="mini"
              @click="handleAdd(scope.row)"
            >{{$t('复制')}}
            </el-button>
            <el-button
              v-if="hasPerm('poster','delete') && scope.row.id > 10"
              plain
              type="danger"
              icon="delete"
              size="mini"
              @click="handleDelete(scope.row.id)"
            >{{$t('删除')}}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--    <pagination :background="false" :total="total" :page.sync="listQuery.curPage" :limit.sync="listQuery.pageSize" @pagination="getList" />-->

    <el-dialog v-if="dialogFormVisible" :title="$t('文章信息')" :visible.sync="dialogFormVisible" width="80%">
      <el-tabs v-model="selectLang" type="card" @tab-click="clickLangTab">
        <template v-for="(item,index) in country_list">
          <el-tab-pane :key="index" :label="item.name" :name="item.langCode" />
        </template>
      </el-tabs>

      <el-form ref="dataForm" :rules="rules" :model="formObj" label-position="left" label-width="160px">
        <el-form-item :label="$t('语言代码')" prop="lang" required>
          <zselect
            v-model="formObj.lang"
            entity-name="country"
            list-code="langCode"
            list-label="name"
            size="small"
           :placeholder="$t('语言')"
          />
          <!--          <el-select v-model="formObj.lang" class="full-width":placeholder="$t('语言')" style="max-width: 200px;" clearable>-->
          <!--            <template v-for="(item,index) in country_list">-->
          <!--              <el-option :key="index" :value="item.langCode" :label="`(${item.langCode}) `+item.name" />-->
          <!--            </template>-->
          <!--          </el-select>-->
        </el-form-item>
        <el-form-item :label="$t('所属分类')" prop="cid">
          <zselect v-model="formObj.cid" :dict-list="cate_list" list-code="id" list-label="name" />
        </el-form-item>
        <el-form-item :label="$t('父文章')" prop="pid">
          <zselect
            v-model="formObj.pid"
            :w="200"
            :dict-list="listPid"
            list-code="id"
            list-label="title"
            size="small"
           :placeholder="$t('父文章')"
            clearable
          />
          <el-tag>{{ $t('决定了它在多层级文章树内的位置') }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('编号')" prop="code" required>
          <zinput v-model="formObj.code":placeholder="$t('可以随意指定')" />
          <zselect
            v-model="formObj.code"
            entity-name="posterCode"
            list-code="code"
            list-label="name"
            :not-exist-return-value="true"
          />
          <!--          <a class="el-icon-edit ml-4 text-primary"  @click="changeCodeInput()">{{formObj.codeInput?'去选择':'去输入'}}</a>-->
          <a class="el-icon-refresh ml-2 text-primary" @click="formObj.code = new Date().getTime()">{{ $t('随机') }}</a>
          <!--          <zselect v-model="formObj.code" entity-name="/commonData/selectPages/posterCode" list-code="code" list-label="cname" :not-exist-return-value="true" />-->
          <!--          <zselect v-model="scope.row.number" entityName="posterCode" listCode="code" listLabel="cname"/>-->
        </el-form-item>
        <el-form-item :label="$t('标题')" prop="title">
          <el-input v-model="formObj.title" />
        </el-form-item>
        <el-form-item :label="$t('副标题')" prop="subtitle">
          <el-input v-model="formObj.subtitle" />
        </el-form-item>
        <el-form-item :label="$t('简介')" prop="intro">
          <el-input v-model="formObj.intro" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('图片')" prop="pic">
          <zupload v-model="formObj.pic" module="cfg" />
        </el-form-item>
        <el-form-item :label="$t('视频_文档地址')" prop="video">
          <zupload v-model="formObj.video" module="cfg" accept="video/*,*.ogg,*.mp4" />
          <el-tag>{{$t('可以上传文档文件_副标题为_最终文件名称')}}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('链接地址')" prop="url">
          <el-input v-model="formObj.url" />
        </el-form-item>
        <el-form-item :label="$t('上架时间')" prop="publishTime">
          <zdatetime v-model="formObj.publishTime" w="250" />
        </el-form-item>
        <el-form-item :label="$t('详情内容类型')" prop="contentType">
          <zselect v-model="formObj.contentType" classname="EnumPosterContentType" :default-first="true" />
        </el-form-item>
        <el-form-item v-if="formObj.paramEntitys" :label="$t('详情可用参数')" prop="content">
          <div v-if="formObj.paramEntitys.indexOf('[')===0">
            <template v-for="(entity,index) in JSON.parse(formObj.paramEntitys)">
              <poster-entity-view :key="index" :double-parantheses="true" :entity="entity" />
            </template>
          </div>
          <div v-else-if="formObj.paramEntitys.includes(',')">
            <template v-for="(entityName,index) in formObj.paramEntitys.split(',')">
              <poster-entity-view :key="index" :double-parantheses="true" :entity="{label:entityName,dataKey:entityName,entityClass:entityName}" />
            </template>
          </div>
        </el-form-item>
        <el-form-item v-else-if="!mixin.isProd" :label="$t('详情可用参数')" prop="content">
          <valueFormatStrToObj v-model="formObj.paramEntitys" :default-value="'[]'">
            <template #default="innerScope">
              {{ innerScope }}
              <!--              <posterEntity :list.sync="innerScope.scope.value" />-->
            </template>
          </valueFormatStrToObj>
        </el-form-item>
        <el-form-item v-if="formObj.contentType==='richText'" :label="$t('详情_富文本')" prop="content">
          <Tinymce
            :id="'content-tinymce' + formObj.id"
            ref="editor"
            v-model="formObj.content"
            module="poster"
            :max_height="400"
          />
        </el-form-item>
        <el-form-item v-if="formObj.contentType==='original'" :label="$t('详情_原文')" prop="content">
          <div>支持svg</div>
          <zinput v-model="formObj.content" type="textarea" :autosize="{ minRows: 10 }" w="100%;" />
        </el-form-item>
        <el-form-item :label="$t('排序')" prop="sort">
          <el-input v-model="formObj.sort" type="number":placeholder="$t('越小越靠前')" />
        </el-form-item>
        <el-form-item :label="$t('备注')" prop="remark">
          <el-input v-model="formObj.remark" type="textarea":placeholder="$t('备注')" />
        </el-form-item>
        <el-form-item :label="$t('地点')" prop="position">
          <el-input v-model="formObj.position" type="textarea":placeholder="$t('地点')" />
        </el-form-item>
        <el-form-item :label="$t('输入时间')" prop="inputTime">
          <el-input v-model="formObj.inputTime" type="textarea":placeholder="$t('输入时间')" />
        </el-form-item>
        <el-form-item :label="$t('开启状态')" prop="enabled">
          <el-switch v-model="formObj.enabled" :active-text="formObj.enabled ? $t('开启') : $t('关闭') " />
        </el-form-item>
        <!--        <el-form-item :label="$t('是否在列表中显示')" prop="sort">-->
        <!--          <zbool v-model="formObj.showInList" type="number" />-->
        <!--        </el-form-item>-->
        <el-form-item :label="$t('多功能')" prop="future">
          <zswitch v-model="formObj.future" />
        </el-form-item>
        <div v-show="formObj.future">
          <el-form-item :label="$t('确认按钮名称')" prop="confirmButtonText">
            <el-input v-model="formObj.confirmButtonText" />
          </el-form-item>
          <el-form-item :label="$t('确认按钮任务完成名称')" prop="confirmButtonFinishText">
            <el-input v-model="formObj.confirmButtonFinishText" />
          </el-form-item>
          <el-form-item :label="$t('确认按钮关联帐变名称')" prop="confirmButtonFinishText">
            <el-input v-model="formObj.confirmButtonTradeNameText" />
          </el-form-item>

          <el-form-item :label="$t('确认按钮路径')" prop="confirmButtonUrl">
            <el-input v-model="formObj.confirmButtonUrl" />
          </el-form-item>
          <el-form-item :label="$t('取消按钮名称')" prop="cancelButtonText">
            <el-input v-model="formObj.cancelButtonText" />
          </el-form-item>
          <el-form-item :label="$t('取消按钮路径')" prop="cancelButtonUrl">
            <el-input v-model="formObj.cancelButtonUrl" />
          </el-form-item>
          <el-form-item :label="$t('取消内容')" prop="cancelButtonContent">
            <Tinymce
              :id="'content-tinymce_cancel' + formObj.id"
              ref="editor"
              v-model="formObj.cancelButtonContent"
              module="activity"
              :max_height="400"
            />
          </el-form-item>
          <el-form-item :label="$t('特定页面植入插件')" prop="cmds">
            <!--            <zjson v-model="formObj.cmds"/>-->
            <!--            formObj.cmds={{formObj.cmds}}-->
            <poster-cmd v-model="formObj.cmds" />
            <!--            <el-tag>例如 显示手机号_验证码功能(验证码类型为指定类型) cmd:appendPhoneSmsCode:connectToBank1</el-tag>-->
          </el-form-item>
          <el-form-item :label="$t('不再提示开关')" prop="noReminder">
            <zbool v-model="formObj.noReminder" />
            <el-tag>打开后显示"不在提示"按钮,客户若点击了以后就不重复弹出了</el-tag>
          </el-form-item>
          <el-form-item :label="$t('父元素样式')" prop="parentStyle">
            <el-input v-model="formObj.parentStyle" />
            <el-tag>例如 background: none; color:white; 背景去掉(透明)</el-tag>
          </el-form-item>
          <el-form-item :label="$t('最小转圈延迟展示时间')" prop="delaySecondStart">
            <el-input v-model="formObj.delaySecondStart" type="number" style="width: 150px">
              <template slot="append">秒</template>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('最大转圈延迟展示时间')" prop="delaySecondEnd">
            <el-input v-model="formObj.delaySecondEnd" type="number" style="width: 150px">
              <template slot="append">秒</template>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('是否溢出弹窗')" prop="overflowFlag">
            <zbool v-model="formObj.overflowFlag" />
          </el-form-item>
          <el-form-item :label="$t('是否溢出弹窗')" prop="overflowFlag">
            <zbool v-model="formObj.overflowFlag" />
          </el-form-item>
          <el-form-item :label="$t('选项数值')" prop="optionValue">
            <zinput v-model="formObj.optionValue" />
          </el-form-item>
          <el-form-item :label="$t('选项内容')" prop="optionContent">
            <Tinymce
              :id="'Tinymce_optionContent_' + formObj.id"
              ref="editor"
              v-model="formObj.optionContent"
              module="activity"
              :max_height="400"
            />
          </el-form-item>
          <el-form-item :label="$t('选项内容2')" prop="optionContent2">
            <Tinymce
              :id="'Tinymce_optionContent2_' + formObj.id"
              ref="editor"
              v-model="formObj.optionContent2"
              module="activity"
              :max_height="400"
            />
          </el-form-item>
          <el-form-item :label="$t('选项是否可选')" prop="optionValidFlag">
            <zbool v-model="formObj.optionValidFlag" />
          </el-form-item>
          <el-form-item :label="$t('文章容器样式类型')" prop="containerType">
            <zselect
              v-model="formObj.containerType"
              classname="EnumPosterContainerType"
             :placeholder="$t('文章容器样式类型')"
            />
          </el-form-item>
          <el-form-item :label="$t('开放关闭窗口静置秒数')" prop="closeDelaySecond">
            <zinput v-model="formObj.closeDelaySecond" type="number">
              <template #append>秒</template>
            </zinput>
<!--            <el-tag>等于 1000000 秒,表示不可关闭/要一直转</el-tag>-->
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('取消')}}</el-button>
        <el-button v-if="hasPerm('poster',['insert','update'])" type="primary" @click="save">{{$t('保存')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { delOne, getList, save, getDetail, getLangDetail, getCountryList, getAllList } from './posterApi.js'
// import Zselect from '@/components/z/zselect.vue'
// import PosterCmd from '@/views/poster/posterCmd.vue'
import DateUtil from '@/parent-ui/src/main/js/utils/DateUtil'
import valueFormatStrToObj from '@/parent-ui/src/main/ui-h5/valueFormatStrToObj.vue'
import PosterEntityView from '@/views/content/sub/posterEntityView.vue'
import PosterEntity from '@/views/content/sub/posterEntity.vue'
import PosterCmd from '@/views/content/sub/posterCmd.vue'
import Zselect from '@/parent-ui/src/main/ui-element/zselect.vue'
import Tinymce from '@/parent-ui/src/main/ui-element/Tinymce/index.vue'
import Zinput from '@/parent-ui/src/main/ui-element/zinput.vue'
import Zdatepicker from '@/parent-ui/src/main/ui-element/zdatepicker.vue'
import CollUtil from '@/parent-ui/src/main/js/utils/CollUtil'
import Zswitch from '@/parent-ui/src/main/ui-element/zswitch.vue'
import mixinRouteVIew from '@/parent-ui/src/main/js/mixin/MixinRouteView'
import Zupload from '@/parent-ui/src/main/ui-element/zupload.vue'
import Zbool from '@/parent-ui/src/main/ui-element/zbool.vue'
import Zdatetime from '@/parent-ui/src/main/ui-element/zdatetime.vue'

export default {
  name: 'PosterList',
  components: {
    Zdatetime,
    Zbool,
    Zupload,
    Zswitch,
    Zdatepicker, Zinput, PosterEntityView, valueFormatStrToObj, PosterEntity, PosterCmd, Zselect, Tinymce },
  filters: {},
  mixins: [mixinRouteVIew],
  $dataEnums: ['EnumPosterContainerType', 'EnumPosterContentType'], // 例如 EnumSex
  $dataEntitys: ['posterCode', 'country'], // 例如 UserLevelConfig
  data() {
    return {
      DateUtil,
      list: [],
      listPid: null,
      total: 0,
      listLoading: false,
      listQuery: {
        curPage: 1,
        pageSize: 20
      },
      formObj: { code: 'random', enabled: true },
      dialogFormVisible: false,
      rules: {
        lang: [{ required: true, message: '请选择语言', trigger: 'blur' }],
        // cid: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        // title: [{ required: true, message: '标题不能为空', trigger: 'blur' }]
      },
      country_list: [],
      country_map: {},
      cate_list: [],
      cate_map: {},

      selectLang: null
    }
  },
  computed: {},
  created() {
    this.getCateAllList()
    this.getList()
    this.getListPid()
    // this.getCateList()
    this.getCountryList()
  },
  methods: {
    async clickLangTab() {
      this.$nextTick(async() => {
        // 加载同标题指定语言的文章
        const param = {
          code: this.formObj.code,
          lang: this.selectLang
        }
        const data = (await getLangDetail(param)).data
        if (data == null) {
          param.cid = this.formObj.cid
          param.publishTime = this.formObj.publishTime
          this.formObj = { ...param }
          this.formObj.contentType = this.formObj.contentType || 'richText'
        } else {
          this.formObj = data
        }
      })
    },

    // getCateList() {
    //   getCateList({}).then(res => {
    //     this.cate_list = res.data
    //   })
    // },
    getCateAllList() {
      getAllList({}).then(res => {
        this.cate_list = res.data
        this.cate_map = CollUtil.listToMap(res.data, 'id')
      })
    },
    getCountryList() {
      getCountryList({}).then(res => {
        this.country_list = res.data
        this.country_map = CollUtil.listToMap(this.country_list, 'langCode')
      })
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(res => {
        this.list = res.data
        // this.listPid = [].concat(this.list)
        // this.listPid.unshift({id: "0", title: '根节点'})
        // this.total = parseInt(res.data.totalCount)
        this.listLoading = false
      })
    },
    getListPid() {
      getList({}).then(res => {
        const listPid = res.data
        listPid.unshift({ id: '0', title: this.$t('根节点') })
        this.listPid = listPid
      })
    },
    search() {
      this.listQuery.curPage = 1
      this.getList()
    },

    async handleAdd(params) {
      const content = params.id && (await getDetail(params.id)).data.content
      this.selectLang = this.country_list[0].langCode
      this.formObj = { code: '', enabled: true, lang: this.formObj.lang, pid: '0', contentType: 'richText', ...params, content, id: null, createTime: null, updateTime: null }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'] && this.$refs['dataForm'].clearValidate()
      })
    },
    async handleUpdate(row, extemd = {}) {
      this.formObj = (await getDetail(row.id)).data
      const formObj = this.formObj
      // noinspection PointlessBooleanExpressionJS
      formObj.future = !!(false ||
          (formObj.confirmButtonText && formObj.confirmButtonText !== '确认') ||
          formObj.confirmButtonUrl ||
          formObj.cancelButtonText ||
          formObj.optionValue ||
          formObj.optionContent ||
          formObj.optionContent2 ||
          (formObj.cmds && formObj.cmds !== '[]') ||
          formObj.parentStyle)
      this.formObj = { ...formObj, ...extemd }
      this.selectLang = this.formObj.lang
      this.$nextTick(() => {
        this.$refs['dataForm'] && this.$refs['dataForm'].clearValidate()
      })
      this.dialogFormVisible = true
    },
    save() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.formObj.code === 'random') {
            this.formObj.code = new Date().getTime()
          }
          const temp = Object.assign({}, this.formObj)
          // if (temp.content) {
          //   temp.content = encodeURIComponent(temp.content)
          // }
          save(temp).then((res) => {
            // this.dialogFormVisible = false
            this.formObj.id = res.data.id
            this.$message.success('保存成功')
            this.getList()
          })
        }
      })
    },
    handleDelete(code) {
      this.$confirm('确认删除该文章?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delOne(code).then(() => {
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    changeState(row) {
      save(row).then(() => {
        this.dialogFormVisible = false
        this.$message.success('保存成功')
      })
    },
    changeCodeInput() {
      const formObj = this.formObj
      const inputFlag = formObj.codeInput
      formObj.codeOld = formObj.codeOld || formObj.code
      if (inputFlag) {
        formObj.code = formObj.codeOld || ''
      } else {
        formObj.code = formObj.codeOld || ''
        // formObj.code = 'random'
      }
      this.$set(formObj, 'codeInput', !inputFlag)
    },
  }
}
</script>
<style scoped>
/deep/ .el-dialog {
  width: 80%;
}
</style>
