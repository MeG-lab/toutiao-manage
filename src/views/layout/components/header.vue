<template>
  <el-container class="header-container">
    <el-header>
      <div class="header">
        <i
          @click="$emit('search')"
          :class="{
            'el-icon-s-fold icon': isCollapse,
            'el-icon-s-unfold icon': !isCollapse,
          }"
        />
        <span>江苏传智播客科技教育有限公司</span>
      </div>
      <!-- 下拉框 -->
      <div class="header-menu">
        <el-dropdown>
          <div class="avater-wrap">
            <img class="avater" :src="user.photo" />
            <span
              >{{ user.name }}
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
          </div>
          <!-- <span>
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span> -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push('/setting')"
              >设置</el-dropdown-item
            >
            <!-- 组件默认是不识别原生的时间的,除非内部做了处理 -->
            <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
  </el-container>
</template>

<script>
import { getUserProfile } from "@/api/admin";
import globalBus from "@/utils/global-bus";
export default {
  name: "AppHeader",
  components: {},
  props: ["is-collapse"],
  data() {
    return {
      user: {}, // 当前用户信息
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadUserProfile();
    globalBus.$on("update-user", (data) => {
      console.log("up-user", data);
      // 注意细节，不要把整个data赋值过去，对象和对象之间赋值是引用类型，会出现相互影响的问题
      // this.user = data;
      this.user.name = data.name;
      this.user.photo = data.photo;
    });
  },
  mounted() {},
  methods: {
    // 除了登录接口，其它所有的接口都需要授权才能请求使用
    // 除了登录接口，其他接口都需要提供你的身份令牌才能获取数据
    async loadUserProfile() {
      const { data } = await getUserProfile();
      // console.log(data);
      this.user = data.data;
    },
    // 点击退出
    onLogout() {
      this.$confirm("是否退出登录", "退出提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 清除登录状态
          window.localStorage.removeItem("user");
          this.$message({
            type: "success",
            message: "用户退出登录",
          });
          // 跳转到登录页
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>

<style scoped lang="less">
.header {
  height: 59px;
  font-size: 18px;
  display: inline-block;
  line-height: 60px;
  background-color: #ffffff;
}

.header-menu {
  float: right;
  line-height: 60px;
}
.avater-wrap {
  display: flex;
  align-items: center;
  .avater {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    border: #e9eef3 solid 1px;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 255, 0.2);
  }
}

.logo {
  width: 100%;
  height: 60px;
  background: url("../logo_admin.png") no-repeat center/70%;
  padding: 0;
}
</style>
