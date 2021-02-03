<template>
  <div class="publish-container">
    <el-card class="filter-card">
      <!-- 面包屑导航 -->
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            $route.query.id ? "修改文章" : "发布文章"
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        :model="article"
        :rules="formRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item class="publishTitle" label="标题：" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item class="publishContent" label="内容：" prop="content">
          <quill-editor v-model="article.content"> </quill-editor>
        </el-form-item>
        <el-form-item size="mini" label="封面：" prop="resource">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 需要把选择的封面的地址传到 article.cover.images 数组中
              
               当你给事件处理函数传递了自定义参数以后，就无法得到原来的哪个数据参数了

               如果想要在事件处理函数自定义以后还想得到原来的哪个事件本身的参数，则手动指定 $event ,它就代表那个事件本身的参数
          -->
          <template v-if="article.cover.type > 0">
            <upload-cover
              :key="cover"
              v-for="(cover, index) in article.cover.type"
              v-model="article.cover.images[index]"
            />
            <!-- <upload-cover
              :key="cover"
              v-for="(cover, index) in article.cover.type"
              :cover-image="article.cover.images[index]"
              @update-cover="onUpdateCover(index, $event)"
            /> -->
          </template>
        </el-form-item>

        <el-form-item label="频道：" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择活动区域">
            <el-option
              :key="index"
              v-for="(channel, index) in channels"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="loadingButton"
            type="primary"
            @click="onReleasePublish(false, 'ruleForm')"
            ref="publish-from"
            >{{ $route.query.id ? "修改" : "发布" }}</el-button
          >
          <el-button :disabled="loadingButton" @click="onReleasePublish(true)"
            >存入草稿</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme
import UploadCover from "./components/upload-cover";
import { quillEditor } from "vue-quill-editor";
import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle,
} from "@/api/article/";
export default {
  name: "PublishIndex",
  components: { quillEditor, UploadCover },
  props: {},
  data() {
    return {
      ruleForm: {},
      // 绑定表单数据
      article: {
        title: "", // 文章标题
        content: "", // 文章内容
        channel_id: "", // 文章列表id
        // 封面
        cover: {
          type: 0, // 封面的类型，-1:自动，0-无图，1-1张，3-3张
          images: [], // 图片的封面
        },
      },
      channels: [], // 文章频道列表
      loadingButton: false, // 文章发表和存入草稿按钮
      imageUrl: "",

      formRules: {
        title: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "长度在 5 到 20 个字符",
            trigger: "blur",
          },
        ],
        content: [
          {
            validator(rule, value, callback) {
              if (value === "<p></p>") {
                callback(new Error("请输入内容"));
              } else {
                callback();
              }
            },
          },
          { required: true, message: "请输入文章内容", trigger: "blur" },
        ],
        channel_id: [{ required: true, message: "请选择频道" }],
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadChannels();
    if (this.$route.query.id) {
      this.loadArticle();
    }
  },
  mounted() {},
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 获取文章频道
    async loadChannels() {
      const { data } = await getArticleChannels();
      this.channels = data.data.channels;
    },
    // 调用发布文章接口
    async onReleasePublish(draft = false, formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }
        const ArticleId = this.$route.query.id;
        this.loadingButton = true;
        if (ArticleId) {
          const data = await updateArticle(ArticleId, this.article, draft);
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success",
          });
        } else {
          const date = await addArticle(this.article, draft);
          this.$message({
            showClose: true,
            message: "发布成功",
            type: "success",
          });
        }

        this.loadingButton = false;
      });
    },
    // 修改文章,加载文章内容
    async loadArticle() {
      // 找到数据接口
      // 封装请求方法
      // 请求获取数据
      const { data } = await getArticle(this.$route.query.id);
      console.log(data);
      // 模块绑定展示
      this.article = data.data;
    },

    onUpdateCover(index, url) {
      console.log(index, url);
      this.article.cover.images[index] = url;
    },
  },
};
</script>

<style scoped lang="less">
.publishTitle {
  max-width: 500px;
}
/deep/ .ql-container.ql-snow {
  height: 300px;
}
/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
/deep/ .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
/deep/ .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
