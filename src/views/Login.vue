<template>
  <div class="container">
    <div class="top">
      <a-avatar :src="`${baseUrl}/favicon.ico`" :size="60" />
      <span class="title">Novice Boot</span>
    </div>
    <div class="desc">Novice Boot 简单易用的低代码开发平台</div>
    <div class="main">
      <a-form
        :model="formState"
        :label-col="{ span: 0 }"
        :wrapper-col="{ span: 24 }"
        @submit="handleSubmit"
        @submit.prevent
      >
        <a-form-item>
          <a-input
            v-model:value="formState.username"
            @blur="checkShouldShowCaptcha"
            size="large"
            placeholder="用户名"
          >
            <template #prefix>
              <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="密码"
          >
            <template #prefix>
              <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item style="text-align: left" v-if="showCaptch">
          <a-input
            v-model:value="formState.code"
            style="width: 60%"
            size="large"
            placeholder="验证码"
          >
            <template #prefix>
              <TagOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
          <a style="float: right; line-height: 37px" @click="refreshCaptcha">
            <a-image :preview="false" :src="captchaSrc" />
          </a>
        </a-form-item>
        <a-form-item style="text-align: left">
          <a-checkbox v-model:checked="formState.remember">自动登录</a-checkbox>
          <a style="float: right; line-height: 22px">忘记密码</a>
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="loggingIn"
            class="login-button"
            type="primary"
            html-type="submit"
            size="large"
            >登录</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
interface FormState {
  username: string;
  password: string;
  code: string;
  remember: boolean;
}
import Login from "../api/login";
import { defineComponent, reactive } from "vue";
import { message } from "ant-design-vue";
import { UserOutlined, LockOutlined, TagOutlined } from "@ant-design/icons-vue";
const CAPTCHA_SRC =
  process.env.VUE_APP_BACKEND_URL + "/core.System/captcha?height=38&width=120";
const api = new Login();
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    TagOutlined,
  },
  data() {
    const formState = reactive<FormState>({
      username: "",
      password: "",
      code: "",
      remember: true,
    });
    return {
      baseUrl: process.env.BASE_URL,
      showCaptch: false,
      captchaSrc: CAPTCHA_SRC,
      loggingIn: false,
      formState,
    };
  },
  methods: {
    checkShouldShowCaptcha() {
      if (!this.formState.username) {
        return;
      }
      api.shouldShowCaptcha(this.formState.username);
       api.shouldShowCaptcha(this.formState.username).then(res => {
          if (res.data && !this.showCaptch) {
            this.refreshCaptcha();
            this.showCaptch = true;
          } else if (!res.data) {
            this.showCaptch = false;
          }
        });
    },
    refreshCaptcha() {
      this.captchaSrc = CAPTCHA_SRC + "&v=" + new Date().getTime();
    },
    handleSubmit() {
      this.loggingIn = true;
      api.login({ ...this.formState }).then(res => {
        this.loggingIn = false;
        if (res.data.code === 1) {
          let user = res.data.result;
          console.log(user);
          if (user.roles.indexOf("8b674539e0994d22b9353ee93e9f54fd") !== -1) {
            location.hash = "#/admin";
          } else {
            location.hash = "#/";
          }
        } else {
          message.error(res.data.description);
        }
        if (res.data.verificationCode) {
          this.refreshCaptcha();
          this.showCaptch = true;
        }
      });
    },
  },
});
</script>
<style scoped>
.container {
  width: 100%;
  min-height: 100%;
  background: #f0f2f5 url(../assets/background.svg) no-repeat 50%;
  background-size: 100%;
  position: relative;
  padding: 150px 0;
}
.top {
  line-height: 50px;
}
.title {
  font-size: 33px;
  color: rgba(0, 0, 0, 0.85);
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  font-weight: 600;
  position: relative;
  top: 8px;
  margin-left: 10px;
}
.desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 12px;
  margin-bottom: 40px;
}
.main {
  min-width: 260px;
  width: 368px;
  margin: 0 auto;
}
.copyright {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
.ant-form-item {
  margin-bottom: 18px !important;
}
.login-button {
  width: 100%;
}
</style>