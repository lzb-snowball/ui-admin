<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane :label="$t('登录密码')" name="password">
        <el-form ref="dataForm" :model="admin" label-position="left" label-width="150px" style="width: 90%; margin-left:50px;">
          <el-form-item :label="$t('旧密码')"  prop="passwordOld" required >
            <el-input v-model="admin.passwordOld" type="password" :placeholder="$t('请输入') + ' ' + $t('旧密码')" />
          </el-form-item>
          <el-form-item :label="$t('新密码')" prop="password" required >
            <el-input v-model="admin.password" type="password" :placeholder="$t('请输入') + ' ' + $t('新密码')" />
          </el-form-item>
          <el-form-item :label="$t('确认密码')" prop="rePwd" required >
            <el-input v-model="admin.rePwd" type="password" :placeholder="$t('请输入') + ' ' + $t('确认密码')" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="updatePassword">{{$t('确认修改')}}</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Password',
  components: { },
  props: {
  },
  data() {
    return {
      activeTab: 'password',
      admin: {},
      tkInfo: {},
      // rules: {
      //   passwordOld: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
      //   password: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
      //   rePwd: [{ required: true, message: '确认密码不能为空', trigger: 'blur' }]
      // },
      // tk_rules: {
      //   passwordOld: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
      //   password: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
      //   rePwd: [{ required: true, message: '确认密码不能为空', trigger: 'blur' }]
      // }
    }
  },
  computed: {
    // ...mapGetters([
    //   'user'
    // ])
  },
  created() {
    this.admin = { id: this.$store.get('loginInfo').id }
  },
  methods: {
    handleClick() {

    },
    updatePassword() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.admin.rePwd !== this.admin.password) {
            this.$message.warning('两次输入的密码不一致')
            return
          }
          $$post('/common/admin/changePassword', this.admin).then(() => {
            this.$message.success('修改成功')
            this.admin = { id: this.$store.get('loginInfo').id }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
