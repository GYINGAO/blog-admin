<template>
  <vxe-grid
    border
    resizable
    keep-source
    ref="table"
    align="center"
    id="table"
    :print-config="{}"
    :export-config="{}"
    :pager-config="pager"
    :columns="columns"
    :toolbar-config="toolbar"
    :data="list"
    :custom-config="{ storage: true }"
    :edit-config="{
      trigger: 'dblclick',
      mode: 'row',
      showStatus: false,
      showIcon: false
    }"
    @edit-closed="handleEditClosed"
    @page-change="handlePageChange"
  >
    <template #operate="{ row }">
      <el-button
        circle
        size="small"
        type="primary"
        icon="el-icon-edit"
        @click="editArticle(row)"
      ></el-button>
      <el-button
        circle
        size="small"
        type="danger"
        icon="el-icon-delete"
        @click="removeArticle(row)"
      ></el-button>
    </template>
  </vxe-grid>
</template>

<script>
import articleAPI from "@/api/article";
export default {
  name: "ArticleyList",
  data() {
    return {
      total: 0,
      pager: {
        currentPage: 1, // 当前页
        pageSize: 10, // 每页大小
        total: 0, // 总条数
        layouts: [
          "PrevPage",
          "JumpNumber",
          "NextPage",
          "FullJump",
          "Sizes",
          "Total"
        ], // 自定义布局
        pagerCount: 10, // 每页大小选项列表
        pageSizes: [10, 20, 50, { label: "全部数据", value: 0 }], // 每页大小选项列表
        align: "center", // 对齐方式
        borfer: false, // 带边框
        background: true, // 带背景颜色
        perfect: false, // 配套的样式
        autoHidden: false, // 当只有一页时自动隐藏
        size: "small",
        enabled: true // 是否启用
      },
      toolbar: {
        refresh: true,
        export: true,
        print: true,
        zoom: true,
        custom: true
      },
      list: [],
      columns: [
        { type: "checkbox", width: 60 },
        { type: "seq", width: 60 },
        {
          field: "id",
          title: "id",
          width: 80
        },
        {
          field: "title",
          title: "标题",
          showOverflow: "tooltip",
          editRender: {
            name: "$input",
            placeholder: "请输入标题",
            props: {}
          }
        },
        {
          field: "summary",
          title: "摘要",
          showOverflow: "tooltip",
          editRender: {
            name: "$input",
            placeholder: "请输入摘要",
            props: {}
          }
        },
        {
          field: "top_flag",
          title: "是否置顶",
          width: 130,
          cellRender: {
            name: "$switch",
            props: {
              openValue: 1,
              closeValue: 0
            },
            events: {
              async change({ row }) {
                await articleAPI.update(row.id, {
                  top_flag: row.top_flag
                });
              }
            }
          }
        },
        {
          field: "push_date",
          title: "发布时间",
          width: 200,
          editRender: {
            name: "$input",
            props: {
              type: "datetime"
            },
            placeholder: "请选择发布时间"
          }
        },
        {
          title: "操作",
          width: 160,
          slots: {
            default: "operate"
          }
        }
      ]
    };
  },

  methods: {
    handlePageChange({ type, currentPage, pageSize }) {
      this.pager.currentPage = currentPage;
      this.pager.pageSize = pageSize;
      this.getArticleList();
    },
    handleEditClosed({ row }) {
      this.updateArticle(row);
    },
    async getArticleList() {
      const { currentPage, pageSize } = this.pager;
      const { data } = await articleAPI.select({ currentPage, pageSize });
      this.list = data.rows;
      this.pager.total = data.count;
      this.pager.pageSizes[this.pager.pageSizes.length - 1].value =
        data.total + 1;
    },
    async updateArticle(row) {
      try {
        const res = await articleAPI.update(row.id, {
          title: row.title,
          summary: row.summary,
          push_date: row.push_date
        });
        this.getArticleList();
      } catch (error) {}
    },
    removeArticle(row) {
      this.$XModal.confirm("您确定要删除该篇文章?").then(async type => {
        if (type === "confirm") {
          try {
            const res = await articleAPI.remove(row.id);
            this.getArticleList();
          } catch (error) {
            console.log(error);
          }
        }
      });
    },
    editArticle(row) {
      this.$router.push("/article/" + row.id);
    }
  },

  created() {
    this.getArticleList();
  }
};
</script>

<style lang="scss" scoped></style>
