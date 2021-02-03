<template>
  <div class="setting-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-form ref="user" :rules="fromRules" :model="user" label-width="80px">
          <el-row :gutter="50">
            <el-col :span="10">
              <el-form-item prop="mobile" label="手机号">
                <el-input v-model="user.mobile"></el-input>
              </el-form-item>
              <el-form-item prop="name" label="用户昵称">
                <el-input v-model="user.name"></el-input>
              </el-form-item>
              <el-form-item label="个人介绍">
                <el-input type="textarea" v-model="user.intro"></el-input>
              </el-form-item>
              <el-form-item prop="email" label="用户邮箱">
                <el-input v-model="user.email"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  :loading="updateProfileLoading"
                  @click="onSaveSetting"
                  >保存修改</el-button
                >
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <div class="image_update">
                <el-form-item class="Buddha" label="用户头像">
                  <label
                    for="file"
                    class="avatar-uploader"
                    :show-file-list="false"
                  >
                    <el-avatar
                      shape="square"
                      :size="150"
                      fit="cover"
                      :src="user.photo"
                    >
                    </el-avatar>
                  </label>
                  <input
                    type="file"
                    ref="file"
                    hidden
                    id="file"
                    @change="onUpdatePhoto"
                  />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <!-- 预览的头像 -->
    <el-dialog
      title="修改头像"
      append-to-body
      :visible.sync="dialogVisible"
      center
      @opened="onDialogOpened"
      @closed="onDialogClosed"
    >
      <div class="preview-image-wrap">
        <img class="preview-image" :src="preivewImage" ref="preview-image" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUpdateMyPhoto">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserProfile,
  updateUserProfile,
  updateUserPhoto,
} from "@/api/admin";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import globalBus from "@/utils/global-bus";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      // 用户信息
      user: { email: "", id: null, intro: "", mobile: "", name: "", photo: "" },
      dialogVisible: false,
      preivewImage: "", // 预览图片
      cropper: null, // 裁切器
      updateProfileLoading: false, // 更新基本信息的loading状态
      // 表单验证
      fromRules: {
        email: [
          { required: true, message: "请输入正确的邮箱", trigger: "blur" },
          { min: 5, max: 30, message: "请输入正确的邮箱", trigger: "blur" },
        ],
        mobile: [
          {
            required: true,
            min: 11,
            max: 11,
            message: "请输入正确的11位手机号",
            trigger: "change",
          },
        ],
        name: [
          {
            required: true,
            min: 3,
            max: 5,
            message: "长度在3到5之间",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.userProfile();
  },
  mounted() {},
  methods: {
    // 获取用户信息
    async userProfile() {
      const { data } = await getUserProfile();
      this.user = data.data;
      // console.log(this.user);
    },
    // 更新用户信息
    async onSaveSetting() {
      // 开启 loading 状态
      this.updateProfileLoading = true;
      try {
        // 更新头部当前登录用户的信息
        await updateUserProfile({
          name: this.user.name,
          intro: this.user.intro,
          email: this.user.email,
        });
        // 关闭 loading 状态
        this.updateProfileLoading = false;
        this.$message.success("修改成功");
        // 发布通知，用户信息已修改
        globalBus.$emit("update-user",this.user);
      } catch (err) {
        this.updateProfileLoading = false;
        this.$message.err("修改失败", err);
      }

      // console.log(data);
    },
    // 上传头像
    onUpdatePhoto() {
      // 图片预览
      const file = this.$refs.file;
      const blobData = window.URL.createObjectURL(file.files[0]);
      this.preivewImage = blobData;
      // 展示弹出层，预览用户选择图片
      this.dialogVisible = true;
      this.$refs.file.value = "";
    },
    // 裁切器
    onDialogOpened() {
      // 图片裁切器必须基于 img 进行初始化
      // 注意：img必须是可见状态才能正常完成初始化
      //      这里需要再对话框里使用裁切器 所以务必要再对话框完全打开的状态下去进行初始化
      // 获取图片DOM节点
      const image = this.$refs["preview-image"];
      // 第一次初始化好以后,如果预览裁切的图片发送了变化,裁切器默认不会更新
      // 如果需要预览图片发送变化更新裁切器
      // 方式一:裁切器.replace方法
      // 方式二:销毁这个裁切器,重新初始化
      // 初始化裁切器
      // if (this.cropper) {
      //   this.cropper.replace(this.preivewImage);
      //   return;
      // }
      this.cropper = new Cropper(image, {
        viewMode: 1,
        dragMode: "none",
        aspectRatio: 1,
        cropBoxResizable: false,
        background: false,
        movable: true,
      });
    },
    onDialogClosed() {
      // 对话框关闭,销毁裁切器
      this.cropper.destroy();
    },
    onUpdateMyPhoto() {
      this.cropper.getCroppedCanvas().toBlob((file) => {
        const fd = new FormData();
        fd.append("photo", file);
        // 请求提交 fd
        updateUserPhoto(fd).then((res) => {
          // 关闭对话框
          this.dialogVisible = false;
          // 更新视图展示
          this.user.photo = window.URL.createObjectURL(file);
        });
      });
    },
  },
};
</script>

<style scoped lang="less">
.up_image {
  width: 150px;
  border: 2px solid #a9abaf;
}
.up_image:hover {
  border: 2px dashed #a9abaf;
}
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
