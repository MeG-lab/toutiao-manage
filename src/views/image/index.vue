<template>
  <div class="image-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="materialList">
        <el-radio-group size="mini" @change="onCollectChange()" v-model="collect">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
          class="add-material"
          size="mini"
          type="success"
          @click="dialogUploadVisible = true"
          >添加素材</el-button
        >
      </div>
      <!-- 素材列表 -->
      <el-row :gutter="20">
        <el-col
          :xs="12"
          :sm="6"
          :md="6"
          :lg="4"
          :span="4"
          :key="index"
          v-for="(img, index) in images"
          class="image-item"
        >
          <el-image
            style="height: 100px;"
            :src="img.url"
            fit="cover"
          ></el-image>
          <div class="image-action">
            <i
              :class="{
                'el-icon-star-on collect_image': img.is_collected,
                'el-icon-star-off': !img.is_collected,
              }"
              @click="onCollectionImage(img)"
            ></i>
            <i @click="onDeleteImage(img)" class="el-icon-delete-solid"></i>
          </div>
        </el-col>
      </el-row>
      <el-pagination
        class="paging"
        background
        :disabled="loading"
        @current-change="onPageChange"
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="totalCount"
        :current-page="page"
      >
      </el-pagination>
    </el-card>
    <!-- Dialog 对话框 -->

    <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body="true"
    >
      <!--
        upload 组件本身就支持请求提交上传操作，说白了你使用它不用自己去发请求，它会自己发。
        请求方法：默认就是 POST
        请求路径：action，必须写完整路径
        请求头：headers
       -->
      <el-upload
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :show-file-list="false"
        :on-success="onUploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, deleteImages, collectImages } from "@/api/article";
export default {
  name: "ImageIndex",
  components: {},
  props: {},
  data() {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return {
      radio1: "全部",
      images: [], // 图片素材列表
      collect: false,
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
      loading: false, // loading 优化
      totalCount: 0, // 总数条数
      page: 1,
      pageSize: 10, // 每页大小
    };
  },
  computed: {},
  watch: {},
  created() {
    this.showImages();
  },
  mounted() {},
  methods: {
    // 分页
    async showImages(page = 1) {
      // this.loading = true;
      const { data } = await getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize,
      });
      this.page = data.data.page;
      this.per_page = data.data.per_page;
      this.totalCount = data.data.total_count;
      this.images = data.data.results;
      // this.loading = false;
    },
    onCollectChange(page, value) {
      this.showImages(page, value);
    },
    // 点击分页
    onPageChange(page) {
      this.onCollectChange(page);
      // console.log(page);
    },
    onUploadSuccess() {
      // 关闭对话框
      (this.dialogUploadVisible = false),
        // 更新列表
        this.showImages(false);
    },
    // 删除图片
    onDeleteImage(img) {
      try {
        deleteImages(img.id).then((res) => {
          this.$message.success("删除成功");
          this.showImages(this.page);
        });
      } catch (err) {
        this.$message.err("删除失败");
      }
    },
    // 收藏图片
    onCollectionImage(img) {
      // 已收藏取消收藏
      collectImages(img.id, !img.is_collected).then((res) => {
        this.showImages(this.page);
      });
      // if (img.is_collected) {
      //   console.log(img);
      //   collectImages(img.id, false);
      // } else {
      //   collectImages(img.id, true);
      // }
      // 未收藏添加收藏
    },
  },
};
</script>

<style scoped lang="less">
.add-material {
  float: right;
}
.materialList {
  padding-bottom: 20px;
}
.el-dialog {
  width: 420px;
}
.image-item {
  position: relative;
}
.image-action {
  font-size: 25px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: #ffffff;
  height: 30px;
  background-color: rgba(204, 204, 204, 0.5);
  position: absolute;
  bottom: 4px;
  left: 10px;
  right: 10px;
}
.collect_image {
  color: orange;
}
.paging {
  padding-top: 20px;
}
</style>
