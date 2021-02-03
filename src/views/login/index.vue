<template>
  <div class="login-container">
    <el-form
      class="login-form"
      ref="login-form"
      :model="user"
      :rules="formRules"
      size="mini"
    >
      <el-form-item prop="mobile">
        <el-input
          class="login-form-input"
          placeholder="请输入手机号码"
          v-model="user.mobile"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          class="login-form-input"
          placeholder="请输入验证码"
          v-model="user.code"
        ></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree"
          >我已阅读并同意用户协议和隐私条款</el-checkbox
        >
      </el-form-item>
      <el-form-item size="large">
        <el-button
          class="login-form-button"
          type="primary"
          :loading="loginLoading"
          @click="onLogin"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from "@/utils/request";
import { login } from "@/api/admin";
export default {
  name: "LoginIndex",
  data() {
    return {
      user: {
        mobile: "13911111111", // 手机号
        code: "246810", // 验证码
        agree: false, // 协议选中状态
      },
      loginLoading: false, // 登录的 loading 状态
      // 配置表单验证规则
      formRules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "change" },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: "请输入正确的格式",
            trigger: "change",
          },
        ],
        code: [
          { required: true, message: "验证码不能为空", trigger: "change" },
          { pattern: /^\d{6}$/, message: "请输入正确的验证码格式" },
        ],
        agree: [
          {
            // 验证通过：callback()
            // 验证失败：callback(new Error('错误消息'))
            // value 是本次选中的值
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                callback(new Error("请同意用户协议"));
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    onLogin() {
      // 获取表单数据,对表单进行验证,验证成功在调用请求登录
      this.$refs["login-form"].validate((valid) => {
        if (!valid) {
          return;
        }
        this.login();
      });
    },
    async login() {
      // 找到数据接口
      // 封装请求方法
      // 请求调用登录
      //  处理响应结果
      this.loginLoading = true;
      try {
        const res = await login(this.user);
        // console.log(res);
        this.$message({
          message: "登录成功",
          type: "success",
        });
        this.loginLoading = false;
        // 把接口返回的用户相关数据给放到本地存储，方便应用中的数据共享
        // 本地存储只能存字符串
        // 如果要存储对象、数组类型的数据，则把他们转为 JSON 类型的字符串进行存储
        window.localStorage.setItem("user", JSON.stringify(res.data.data));
        // 跳转到首页
        this.$router.push({
          name: "home",
        });
      } catch (err) {
        console.log(err);
        this.$message.error("登录失败，手机号或验证码错误");
        this.loginLoading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("./login-bg.jpg") no-repeat;
  background-size: cover;
  .login-form {
    background-color: #fff;
    padding: 50px;
    min-width: 300px;
    border-radius: 0.5em;
  }
  .login-form-button {
    width: 100%;
    height: 35px;
    line-height: 0;
  }
}
/deep/ .el-input--mini .el-input__inner {
  height: 35px;
}
</style>
