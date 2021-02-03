<template>
  <el-container class="layout-container">
    <el-aside class="aside" width="auto">
      <app-aside :is-collapse="isCollapse" class="aside-menu" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <app-header
          :is-collapse="isCollapse"
          @search="isCollapse = !isCollapse"
        />
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from "@/views/layout/components/aside";
import AppHeader from "@/views/layout/components/header";

export default {
  name: "LayoutIndex",
  components: {
    AppAside,
    AppHeader,
  },
  props: {},
  data() {
    return {
      isCollapse: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onTest() {
      console.log(123);
    },
  },
};
</script>

<style scoped lang="less">
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.aside {
  background-color: red;
  overflow: unset;
  .aside-menu {
    height: 100%;
    overflow: hidden;
    // background-color:red !important;
  }
}
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
}

.main {
  width: 100%;
  height: 100%;
  background: url("home-bg.jpg") no-repeat 50%;
  background-size: 100%;
}

/deep/ li.el-menu-item {
  width: 200px;
  // background-color: #fff  !important;
}
</style>
