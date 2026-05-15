<template>
  <div class="form-box">
    <div class="title">账号密码登录</div>
    <div class="form">
      <a-form ref="formRef" :model="form" :rules="rules">
        <a-form-item name="name">
          <a-input v-model:value="form.name" allowClear placeholder="请输入账号">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password v-model:value="form.password" allowClear placeholder="请输入密码">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item name="identifyCode" validateFirst>
          <a-input v-model:value="form.identifyCode" allowClear placeholder="请输入验证码">
            <template #prefix>
              <FundOutlined />
            </template>
            <template #suffix>
              <ImgCode @changeCode="changeCode" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" block size="large" :loading="loading" @click="onLogin">登录</a-button>
        </a-form-item>
      </a-form>

    </div>
  </div>
</template>

<script lang="ts" setup>

import { useRouter } from 'vue-router'
import { message, type FormInstance } from 'ant-design-vue'
import md5 from 'js-md5'
import { loginApi, getUserInfoApi } from '@/api/user'
import useKeyUp from '@/hooks/useKeyUp'
import ImgCode from './ImgCode.vue'

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
  name: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
  identifyCode: [
    { required: true, message: '请输入验证码' },
    { validator: (rule: any, value: string ) => {
      if (value !== rightCode.value) {
        return Promise.reject('验证码错误')
      } else {
        return Promise.resolve()
      }
    }, trigger: 'blur'}
  ],
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
      message.info('暂无任何页面的权限')
    }

    router.push('/index')
  }
}

</script>

<style lang="less" scoped>
.form-box {
  .title {
    margin-top: 60px;
    margin-bottom: 40px;
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    color: #000000;
  }
  .form {
    padding: 0 50px;

    .ant-form-item-control-input-content {
      // .ant-btn,
      // >.ant-input {
      //   height: 40px;
      //   border-radius: 2px;
      // }
      >.ant-input-password {
        height: 40px;
      }
      >.ant-input-affix-wrapper {
        height: 40px;
        :deep(.ant-input-prefix) {
          margin-right: 10px;
        }
      }
    }
    .ant-btn {
      margin-top: 16px;
    }
    // :deep(.ant-input-suffix) {
    //   right: 0;
    // }
    .code-img {
      margin-right: 2px;
      border-radius: 2px;
      cursor: pointer;
    }
  }
}
</style>