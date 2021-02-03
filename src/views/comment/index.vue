<template>
  <div class="comment-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="text item">
        <el-table :data="article" style="width: 100%">
          <el-table-column prop="title" label="标题" width="180">
          </el-table-column>
          <el-table-column
            prop="total_comment_count"
            label="评论总数"
            width="180"
          >
          </el-table-column>
          <el-table-column prop="fans_comment_count" label="粉丝评论数">
          </el-table-column>
          <el-table-column prop="comment_status" label="状态">
            <template slot-scope="scope">
              {{ scope.row.comment_status ? "正常" : "关闭" }}
            </template>
          </el-table-column>
          <el-table-column prop="comment_status" label="操作">
            <template slot-scope="scope">
              <!-- <el-button
                @click="onChangeComments()"
                v-if="!scope.row.comment_status"
                size="mini"
                type="primary"
                >打开评论</el-button
              >
              <el-button
                @click="onChangeComments()"
                v-else
                size="mini"
                type="danger"
                >关闭评论</el-button
              > -->
              <!-- 开关组件绑定的数据是一个布尔值，它会根据布尔值的真假来决定开关状态 -->
              <el-switch
                :disabled="loading"
                v-model="scope.row.comment_status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="onChangeComments(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        :disabled="loading"
        @current-change="onCommentsChange"
        class="comments_paging"
        background
        layout="prev, pager, next"
        :total="totalCount"
        :current-page="page"
        :page-size="pageSize"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from "@/api/article";
export default {
  name: "CommentIndex",
  components: {},
  props: {},
  data() {
    return {
      article: [], // 总文章数据列表
      Open: false,
      allow_comment: false,
      page: 1,
      pageSize: 20,
      totalCount: 0, // 总条数
      loading: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticles();
  },
  mounted() {},
  methods: {
    async loadArticles(page = 1) {
      this.loading = true;
      const { data } = await getArticles({
        response_type: "comment",
        page, // 当前页
        per_page: this.pageSize, // 每页页数
      });
      // console.log(data);
      this.page = data.data.page;
      this.pageSize = data.data.per_page;
      this.totalCount = data.data.total_count;
      this.article = data.data.results;
      this.loading = false;
    },
    // 改变评论状态
    async onChangeComments(article) {
      this.loading = true;
      await updateCommentStatus(article.id.toString(), article.comment_status);
      this.loading = false;
    },
    // 点击分页
    onCommentsChange(page) {
      this.loadArticles(page);
    },
  },
};
</script>

<style scoped lang="less">
.comments_paging {
  padding-top: 20px;
}
</style>
