<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <div>
        <el-form size="mini" ref="form" label-width="80px">
          <el-form-item label="状态:">
            <el-radio-group v-model="status">
              <el-radio :label="null">全部</el-radio>
              <el-radio :label="0">草稿</el-radio>
              <el-radio :label="1">待审核</el-radio>
              <el-radio :label="2">审核通过</el-radio>
              <el-radio :label="3">审核失败</el-radio>
              <el-radio :label="4">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道:">
            <el-select v-model="channelId" placeholder="请选择">
              <el-option label="全部" :value="null" />
              <el-option
                :key="index"
                v-for="(channel, index) in channels"
                :label="channel.name"
                :value="channel.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="list-table" label="日期:" size="mini">
            <el-date-picker
              v-model="rangeTime"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="loadArticles(1)"
              >筛选</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- 筛选结果 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到 {{ totalCount }} 条结果：</span>
      </div>
      <div class="text item">
        <!-- 表格组件 -->
        <!-- 1把需要展示的数据绑定给 table 组件的 data 属性,不用去遍历,它自己会遍历 -->
        <el-table
          v-loading="loading"
          :data="articles"
          stripe
          style="width: 100%"
        >
          <el-table-column label="封面">
            <template slot-scope="scope">
              <!-- scopw.row 相当于当前数据对象 -->
              <el-image
                lazy
                style="width: 100px; height: 100px"
                :src="scope.row.cover.images[0]"
                fit="cover"
              >
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题"> </el-table-column>
          <el-table-column label="状态">
            <!-- 如果要在自定义列模板中获取当前遍历项数据,那么就在 template 上声明
                  slot-scope="scope"
             -->
            <template slot-scope="scope">
              <el-tag :type="articleStatus[scope.row.status].type">{{
                articleStatus[scope.row.status].text
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click="$router.push('/publish?id=' + scope.row.id.toString())"
                circle
                icon="el-icon-edit"
                type="primary"
              ></el-button>
              <el-button
                @click="onDeleteArticle(scope.row.id)"
                circle
                icon="el-icon-delete"
                type="danger"
              />
            </template>
          </el-table-column>
        </el-table>
        <!-- 列表分页 -->
        <el-pagination
          :disabled="loading"
          @current-change="onCurrentChange"
          :page-size="pageSize"
          layout="prev, pager, next"
          background
          :total="totalCount"
          :current-page="page"
        />
        <!-- /列表分页 -->
      </div>
    </el-card>
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from "@/api/article/";
export default {
  name: "ArticleIndex",
  components: {},
  props: {},
  data() {
    return {
      articles: [], // 文章数据列表
      // 文章状态
      articleStatus: [
        { status: 0, text: "草稿", type: "info" }, // 0
        { status: 1, text: "待审核", type: "" }, // 1
        { status: 2, text: "审核通过", type: "success" }, // 2
        { status: 3, text: "审核失败", type: "warning" }, // 3
        { status: 4, text: "已删除", type: "danger" }, // 4
      ],
      page: Number,
      per_page: Number,
      totalCount: 0, // 总数据条数
      pageSize: 20, // 每页大小
      status: null, // 文章状态,不传就是全部
      channels: [], // 频道列表
      channelId: null, // 频道列表id
      rangeTime: null, // 时间筛选
      loading: false, // loading 优化
      page: 1,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticles(1);
    this.loadChannels();
  },
  mounted() {},
  methods: {
    // 文章列表
    async loadArticles(page = 1) {
      this.loading = true;
      const { data } = await getArticles({
        page,
        per_page: this.pageSize,
        status: this.status, // 文章状态,不传就是全部
        channel_id: this.channelId, // 频道列表id
        begin_pubdate: this.rangeTime ? this.rangeTime[0] : null, // 起始时间
        end_pubdate: this.rangeTime ? this.rangeTime[1] : null, //结束时间
      });
      this.articles = data.data.results;
      this.page = data.data.page;
      this.per_page = data.data.per_page;
      this.totalCount = data.data.total_count;
      this.loading = false;
    },
    // 点击分页
    onCurrentChange(page) {
      this.loadArticles(page);
    },
    // 文章频道
    async loadChannels() {
      const { data } = await getArticleChannels();
      this.channels = data.data.channels;
    },
    // 删除文章
    onDeleteArticle(ArticleId) {
      // console.log(ArticleId);
      // console.log(ArticleId.toString());
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteArticle(ArticleId.toString()).then((res) => {
            this.loadArticles(this.page);
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      // this.loadArticles();
    },
  },
};
</script>

<style scoped lang="less">
.filter-card {
  margin-bottom: 30px;
}

.list-table {
  margin-bottom: 20px;
}
.article-cover {
  width: 100px;
  background-size: cover;
}
</style>
