<script>
import configEntity from '@/parent-ui/src/main/business/admin/configEntity.vue'

export default {
  name: 'agent',
  extends: configEntity,
  data() {
    return {
      tableConfigUnit: {
        entityName: 'agent',
      },
    }
  },
  created() {
    let This = this
    this.tableConfigUnit = {
      entityName: 'agent',
      fieldConfigsMap: {
        codeNumber: {
          form: {
            required:true,
            render(h, entity) {
              return <div>
                <zinput v-model={entity.codeNumber} disabled={!!entity.id}/>
                {entity.id?null:<a class={'el-icon-refresh ml-2 text-primary'} onClick={() => {entity.codeNumber = This.getRandomChars()}}>{This.$t('随机')}</a>}
              </div>
            }
          }
        },
        // pid: {
        //   base: {
        //     defaultFirst:false,
        //   }
        // },
      },
    }
  },
  methods: {
    getRandomChars() {
      const chars = this.authDictMap['REGISTER_CODE_LETTERS_USER'];
      let result = '';
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
      }
      return result;
    }
  }
}
</script>
