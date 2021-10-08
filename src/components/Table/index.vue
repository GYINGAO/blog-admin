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
    :columns="tableColumn"
    :toolbar-config="toolbar"
    :data="tableData"
    :custom-config="{ storage: true }"
    :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
    @toolbar-button-click="toolbarButtonClickEvent"
  >
    <template #operate="{ row }">
      <vxe-button
        icon="fa fa-trash"
        title="删除"
        @click="removeRowEvent(row)"
      ></vxe-button>
    </template>
  </vxe-grid>
</template>

<script>
export default {
  name: "Table",
  props: {
    tableData: { type: Array, require: true },
    tableColumn: { type: Array, require: true },
    total: { type: Number, require: true }
  },
  data() {
    return {
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
        pageSizes: [10, 20, 50, { label: "全部数据", value: this.total + 1 }], // 每页大小选项列表
        align: "center", // 对齐方式
        borfer: false, // 带边框
        background: true, // 带背景颜色
        perfect: false, // 配套的样式
        autoHidden: false, // 当只有一页时自动隐藏
        enabled: true // 是否启用
      },
      toolbar: {
        buttons: [
          { code: "insert_actived", name: "新增", status: "primary" },
          { code: "save", name: "保存", status: "success" }
        ],
        refresh: true,
        export: true,
        print: true,
        zoom: true,
        custom: true
      }
    };
  },
  methods: {
    removeRowEvent(row) {
      this.$XModal.confirm("您确定要删除该数据?").then(type => {
        const $grid = this.$refs.xGrid;
        if (type === "confirm") {
          $grid.remove(row);
        }
      });
    },
    toolbarButtonClickEvent({ code }) {
      // const $grid = this.$refs.table;
      // switch (code) {
      //   case "myInsert":
      //     $grid.insert({
      //       name: "xxx"
      //     });
      //     break;
      //   case "mySave":
      //     setTimeout(() => {
      //       const {
      //         insertRecords,
      //         removeRecords,
      //         updateRecords
      //       } = $grid.getRecordset();
      //       this.$XModal.message({
      //         content: `新增 ${insertRecords.length} 条，删除 ${removeRecords.length} 条，更新 ${updateRecords.length} 条`,
      //         status: "success"
      //       });
      //       this.loadData();
      //     }, 100);
      //     break;
      //   case "myExport":
      //     $grid.exportData({
      //       type: "csv"
      //     });
      //     break;
      // }
    }
  },
  created() {
    this.pager.total = this.total;
  }
};
</script>

<style lang="scss" scoped></style>
