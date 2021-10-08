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
    @toolbar-button-click="toolbarButtonClickEvent"
    @edit-closed="handleEditClosed"
    @page-change="handlePageChange"
  >
    <template #operate="{ row }">
      <el-button
        size="small"
        type="danger"
        icon="el-icon-delete"
        @click="removeCategory(row)"
        >删除</el-button
      >
    </template>
  </vxe-grid>
</template>

<script>
import categoryAPI from "@/api/category";
export default {
  name: "CategoryList",
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
        buttons: [{ code: "my_insert", name: "新增", status: "default" }],
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
          field: "name",
          title: "分类名称",
          width: 250,
          editRender: {
            name: "$input",
            placeholder: "请输入分类名称",
            props: { clearable: true }
          }
        },
        {
          field: "description",
          title: "分类描述",
          editRender: {
            name: "$input",
            placeholder: "请输入分类描述",
            props: { clearable: true }
          }
        },
        {
          title: "操作",
          width: 160,
          slots: {
            default: "operate"
          }
        }
      ],
      isCreate: false
    };
  },

  methods: {
    handlePageChange({ type, currentPage, pageSize }) {
      this.pager.currentPage = currentPage;
      this.pager.pageSize = pageSize;
      this.getCategoryList();
    },
    handleEditClosed({ row }) {
      if (this.isCreate) {
        this.createCategory({ name: row.name, description: row.description });
      } else {
        this.updateCategory(row);
      }
      this.isCreate = false;
    },
    async getCategoryList() {
      const { currentPage, pageSize } = this.pager;
      const { data } = await categoryAPI.select({ currentPage, pageSize });
      this.list = data.rows;
      this.pager.total = data.count;
      this.pager.pageSizes[this.pager.pageSizes.length - 1].value =
        data.total + 1;
    },
    async createCategory(data) {
      try {
        const res = await categoryAPI.create(data);
      } catch (error) {}
      this.getCategoryList();
    },
    async updateCategory(row) {
      try {
        const res = await categoryAPI.update(row.id, {
          name: row.name,
          description: row.description
        });
        this.getCategoryList();
      } catch (error) {}
    },
    removeCategory(row) {
      this.$XModal.confirm("您确定要删除该分类?").then(async type => {
        if (type === "confirm") {
          try {
            const res = await categoryAPI.remove(row.id);
            this.getCategoryList();
          } catch (error) {
            console.log(error);
          }
        }
      });
    },
    toolbarButtonClickEvent({ code }) {
      const $grid = this.$refs.table;
      switch (code) {
        case "mySave":
          const {
            insertRecords,
            removeRecords,
            updateRecords
          } = $grid.getRecordset();
          if (insertRecords.length) {
            this.createCategory(insertRecords);
          }
          if (removeRecords.length) {
            this.removeCategory();
          }
          if (updateRecords.length) {
            this.updateCategory();
          }
          this.$XModal.message({
            content: `新增 ${insertRecords.length} 条，删除 ${removeRecords.length} 条，更新 ${updateRecords.length} 条`,
            status: "success"
          });
          break;
        case "my_insert":
          $grid.insert().then(({ row }) => {
            $grid.setActiveCell(row, "name");
            this.isCreate = true;
          });
          break;
      }
    }
  },

  created() {
    this.getCategoryList();
  }
};
</script>

<style lang="scss" scoped></style>
