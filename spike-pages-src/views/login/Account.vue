<template>
  <div class="form-box">
    <div class="title">{{ t('登录您的账户') }}</div>
    <a-form class="form" ref="formRef" :model="form" :rules="rules">
      <a-form-item name="name">
        <a-input v-model:value="form.name" allowClear :placeholder="t('请输入账号')">
          <!-- <template #prefix>
              <UserOutlined />
            </template> -->
        </a-input>
      </a-form-item>
      <a-form-item name="password">
        <a-input-password v-model:value="form.password" allowClear :placeholder="t('请输入密码')">
          <!-- <template #prefix>
              <LockOutlined />
            </template> -->
        </a-input-password>
      </a-form-item>

      <!-- <a-form-item name="identifyCode" validateFirst>
        <a-input v-model:value="form.identifyCode" allowClear placeholder="请输入验证码">
          <template #suffix>
            <ImgCode @changeCode="changeCode" />
          </template>
        </a-input>
      </a-form-item> -->

      <a-form-item class="text-center">
        <a-button class="button" type="primary" block size="large" :loading="loading" @click="onLogin">
          {{ t('登 录') }}
          <IconArrowRight />
        </a-button>
      </a-form-item>
    </a-form>

  </div>
</template>

<script lang="ts" setup>

import { useRouter } from 'vue-router'
import { message, type FormInstance } from 'ant-design-vue'
import md5 from 'js-md5'
import { loginApi, getUserInfoApi } from '@/api/user'
import useKeyUp from '@/hooks/useKeyUp'

const { t } = useI18n()
// import ImgCode from './ImgCode.vue'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref<boolean>(false)

interface IForm {
  name: string
  password: string
  identifyCode: string
}
// 表单
const form = reactive<IForm>({
  name: null,
  password: null,
  identifyCode: null,
})
// 正确的验证码
const rightCode = ref('')

const rules = {
  name: [{ required: true, message: t('请输入账号') }],
  password: [{ required: true, message: t('请输入密码') }],
  // identifyCode: [
  //   { required: true, message: t('请输入验证码') },
  //   {
  //     validator: (rule: any, value: string) => {
  //       if (value !== rightCode.value) {
  //         return Promise.reject('验证码错误')
  //       } else {
  //         return Promise.resolve()
  //       }
  //     }, trigger: 'blur'
  //   }
  // ],
}

// 验证码切换图片
function changeCode(res: string) {
  rightCode.value = res
  form.identifyCode = null
}

useKeyUp('Enter', onLogin)

// 登录
async function onLogin() {
  formRef.value.validate().then(async values => {
    const params = {
      account: values.name,
      password: md5(values.password),
    }
    loading.value = true
    const { code, data, msg, token } = await loginApi(params)
    loading.value = false
    if (code === 200) {
      message.success(msg)
      localStorage.setItem('access_token', token)
      getUserInfo(data)
    }
  })
}

// 获取用户信息
async function getUserInfo(userId: string) {
  const params = { userId }
  const { code, data } = await getUserInfoApi(params)
  if (code === 200) {
    // const userInfo: IUserInfo = data
    localStorage.setItem('permissList', JSON.stringify(data.permissionCodes?.split(',') || []))
    localStorage.setItem('userInfo', JSON.stringify({
      id: data.id,
      name: data.name,
      account: data.account,
      permissionCodes: data.permissionCodes,
      roleId: data.roleId,
      roleName: data.roleName,
      gender: data.gender
    }))

    if (!data.permissionCodes) {
      message.info(t('暂无任何页面的权限'))
    }

    router.push('/index')
  }
}

</script>

<style lang="less" scoped>
.form-box {

  .title {
    margin-left: 20px;
    margin-bottom: 40px;
    font-size: 28px;
    font-weight: 500;
    color: #fff;
  }

  // 在页面里别忘了加deep
  :deep(.form) {
    padding: 0 20px;

    .ant-form-item {
      margin-bottom: 32px;
    }

    .ant-input-affix-wrapper {
      height: 46px;
      background-color: transparent;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: none;

      &:hover {
        border-bottom: 1px solid var(--color-primary);
      }

      .ant-input {
        font-size: 18px;
        color: rgba(255, 255, 255, 0.87);
        background: transparent;

        &::placeholder {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.5);
        }

      }
    }

    .ant-input-affix-wrapper .ant-input-clear-icon,
    .ant-input-affix-wrapper .anticon.ant-input-password-icon {
      color: rgba(255, 255, 255, 0.5);
    }


    .button {
      width: 132px;
      height: 54px;
      margin-top: 32px;
      font-size: 20px;
      border-radius: 3px;
      background: #2372E1;
      box-shadow: 0px 15px 40px -10px rgba(49, 128, 200, 0.20);
    }

  }
}
</style>