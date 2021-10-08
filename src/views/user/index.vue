<template>
  <div>
    <vxe-toolbar
      ref="user_toolbar"
      custom
      print
      export
      :refresh="{
        query: getUserList
      }"
    >
      <template #buttons>
        <vxe-button icon="fa fa-plus" @click="insertEvent()">新增</vxe-button>
      </template>
    </vxe-toolbar>

    <vxe-table
      id="user_table"
      round
      border
      resizable
      show-overflow
      highlight-hover-row
      align="center"
      ref="user_table"
      :print-config="{}"
      :export-config="{}"
      :data="userList"
      :loading="loading"
      :custom-config="{ storage: true }"
      :query="getUserList"
      @cell-dblclick="cellDBLClickEvent"
    >
      <vxe-column type="seq" width="60"></vxe-column>
      <vxe-column field="id" width="60" title="id"></vxe-column>
      <vxe-column field="avatar" title="头像" width="70">
        <template #default="{ row }">
          <img
            v-if="row.avatar"
            :src="row.avatar"
            style="width:45px;border-radius:20px;"
          />
          <span v-else>无</span>
        </template>
      </vxe-column>
      <vxe-column field="name" title="姓名"></vxe-column>
      <vxe-column field="nickname" title="昵称"></vxe-column>
      <vxe-column
        field="gender"
        title="性别"
        width="60"
        :formatter="formatterGender"
      ></vxe-column>
      <vxe-column
        field="birthday"
        title="出生日期"
        :formatter="formatterBirthday"
        width="120"
      ></vxe-column>
      <vxe-column field="email" title="电子邮箱"></vxe-column>
      <vxe-column field="phone" title="手机号" width="120"></vxe-column>
      <vxe-column
        field="createdAt"
        title="创建日期"
        :formatter="formatterCreate"
      ></vxe-column>
      <vxe-column title="操作" width="150">
        <template #default="{ row }">
          <vxe-button
            type="text"
            icon="el-icon-edit"
            @click="editEvent(row)"
          ></vxe-button>
          <vxe-button
            type="text"
            icon="el-icon-delete"
            @click="removeEvent(row)"
          ></vxe-button>
        </template>
      </vxe-column>
    </vxe-table>

    <vxe-pager
      background
      size="small"
      align="center"
      :loading="loading"
      :current-page="tablePage.currentPage"
      :page-size="tablePage.pageSize"
      :total="tablePage.total"
      :page-sizes="[
        10,
        20,
        50,
        { label: '全部数据', value: tablePage.totalResult + 1 }
      ]"
      :layouts="[
        'PrevPage',
        'JumpNumber',
        'NextPage',
        'FullJump',
        'Sizes',
        'Total'
      ]"
      @page-change="handlePageChange"
    >
    </vxe-pager>

    <vxe-modal
      v-model="showEdit"
      :title="selectRow ? '编辑&保存' : '新增&保存'"
      width="800"
      min-width="600"
      min-height="300"
      :loading="submitLoading"
      resize
      destroy-on-close
    >
      <template #default>
        <vxe-form
          :data="formData"
          :items="formItems"
          :rules="formRules"
          title-align="right"
          title-width="100"
          @submit="submitEvent"
        >
          <template #myid="{data}">
            <vxe-input
              v-model="data.id"
              placeholder="此项不填"
              disabled
            ></vxe-input>
          </template>
          <template #myavatar="{ data }">
            <el-upload
              ref="upload_avatar"
              class="avatar-uploader"
              action="https://127.0.0.1:7001/api/user/avatar"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="uploadAvatar"
              :multiple="false"
              :data="data"
              :auto-upload="false"
              :on-change="handleAvatarChange"
              name="avatar"
              accept=".jpg,.jpeg,.png"
            >
              <img v-if="data.avatar" :src="data.avatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </template>

          <template #mypassword="{ data }">
            <vxe-input
              v-if="!selectRow"
              v-model="data.password"
              placeholder="请输入密码"
            ></vxe-input>

            <vxe-input
              v-else
              type="password"
              v-model="data.password"
              disabled
            ></vxe-input>
          </template>
        </vxe-form>
      </template>
    </vxe-modal>
  </div>
</template>

<script>
import userAPI from "@/api/user";
import { VueCropper } from "vue-cropper";
export default {
  components: { VueCropper },
  data() {
    return {
      baseAPI: process.env.VUE_APP_BASE_API,
      tablePage: { currentPage: 1, pageSize: 10, total: 0 },

      loading: false,
      submitLoading: false,
      userList: [],
      selectRow: null,
      showEdit: false,
      genderList: [
        { label: "女", value: 0 },
        { label: "男", value: 1 }
      ],
      formData: {
        id: null,
        name: null,
        nickname: null,
        gender: null,
        birthday: null,
        email: null,
        phone: null,
        avatar: null,
        password: null
      },
      formRules: {
        name: [
          { required: true, message: "请输入姓名" },
          { min: 2, max: 60, message: "长度在 2 到 60 个字符" }
        ],
        password: [{ required: true, message: "请输入密码" }]
      },
      formItems: [
        {
          field: "id",
          title: "用户id",
          span: 12,
          slots: { default: "myid" }
        },
        {
          field: "name",
          title: "姓名",
          span: 12,
          itemRender: { name: "$input", props: { placeholder: "请输入姓名" } }
        },
        {
          field: "nickname",
          title: "昵称",
          span: 12,
          itemRender: { name: "$input", props: { placeholder: "请输入昵称" } }
        },
        {
          field: "birthday",
          title: "出生日期",
          span: 12,
          itemRender: {
            name: "$input",
            props: { type: "date", placeholder: "请选择生日" }
          }
        },
        {
          field: "gender",
          title: "性别",
          span: 12,
          itemRender: {
            name: "$select",
            options: []
          }
        },
        {
          field: "email",
          title: "邮箱",
          span: 12,
          itemRender: {
            name: "$input",
            props: { type: "text", placeholder: "请输入邮箱" }
          }
        },
        {
          field: "phone",
          title: "手机号",
          span: 12,
          itemRender: {
            name: "$input",
            props: { placeholder: "请输入手机号" }
          }
        },
        {
          field: "password",
          title: "密码",
          span: 12,
          slots: { default: "mypassword" }
        },
        {
          field: "avatar",
          title: "头像",
          span: 24,
          slots: { default: "myavatar" }
        },
        {
          align: "center",
          span: 24,
          titleAlign: "left",
          itemRender: {
            name: "$buttons",
            children: [
              { props: { type: "submit", content: "提交", status: "primary" } },
              { props: { type: "reset", content: "重置" } }
            ]
          }
        }
      ],
      loading: false,
      uploadAvatarLoading: false,
      avatarVisible: false
    };
  },
  created() {
    this.$nextTick(() => {
      // 将表格和工具栏进行关联
      this.$refs.user_table.connect(this.$refs.user_toolbar);
    });
    this.formItems[4].itemRender.options = this.genderList;
    this.getUserList();
  },
  methods: {
    handleAvatarChange(file) {
      this.formData.avatar = URL.createObjectURL(file.raw);
    },
    async uploadAvatar(param) {
      const formData = new FormData();
      formData.append("id", param.data.id);
      formData.append("avatar", param.file);
      try {
        const res = await userAPI.upload(formData);
      } catch (error) {
        // return this.$message({
        //   message: "上传失败",
        //   type: "error"
        // });
      }
    },

    beforeAvatarUpload(file) {
      const typeList = ["image/jpeg", "image/jpg", "image/png"];
      const isType = typeList.indexOf(file.type) !== -1;
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isType) {
        this.$message.error("上传头像图片只能是 JPG、JPEG、PNG 格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isType && isLt5M;
    },

    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      this.getUserList();
    },
    async getUserList() {
      this.loading = true;
      const { data } = await userAPI.select(this.tablePage);
      this.userList = data.rows;
      this.tablePage.total = data.count;
      this.loading = false;
    },
    formatterGender({ cellValue }) {
      let item = this.genderList.find(item => item.value === cellValue);
      return item ? item.label : "";
    },
    formatterBirthday({ cellValue }) {
      return this.$dayjs(cellValue).format("YYYY-MM-DD");
    },
    formatterCreate({ cellValue }) {
      return this.$dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss");
    },
    cellDBLClickEvent({ row }) {
      this.editEvent(row);
    },
    insertEvent() {
      this.formData = {
        id: null,
        name: null,
        nickname: null,
        gender: null,
        birthday: null,
        email: null,
        phone: null,
        avatar: null,
        password: null
      };
      this.selectRow = null;
      this.showEdit = true;
    },
    editEvent(row) {
      this.formData = {
        id: row.id,
        name: row.name,
        nickname: row.nickname,
        gender: row.gender,
        birthday: row.birthday,
        email: row.email,
        phone: row.phone,
        avatar: row.avatar,
        password: row.password
      };
      this.selectRow = row;
      this.showEdit = true;
    },
    removeEvent(row) {
      this.$XModal.confirm("您确定要删除该数据?").then(async type => {
        const $table = this.$refs.user_table;
        if (type === "confirm") {
          try {
            const res = await userAPI.remove(row.id);
            this.getUserList();
          } catch (error) {
            console.log(error);
          }
        }
      });
    },
    async submitEvent() {
      this.submitLoading = true;
      this.$refs.upload_avatar.submit();
      // 修改
      if (this.selectRow) {
        const {
          id,
          name,
          nickname,
          gender,
          birthday,
          email,
          phone
        } = this.formData;
        try {
          const res = await userAPI.update(id, {
            name,
            nickname,
            gender,
            birthday,
            email,
            phone
          });
          console.log(res);
          Object.assign(this.selectRow, this.formData);

          this.showEdit = false;
        } catch (error) {
          console.log(error);
        }
      }
      // 新增
      else {
        const {
          name,
          nickname,
          gender,
          birthday,
          email,
          phone,
          password
        } = this.formData;
        try {
          const res = await userAPI.create({
            name,
            nickname,
            gender,
            birthday,
            email,
            phone,
            password
          });
          this.getUserList();
          this.showEdit = false;
        } catch (error) {}
      }
      this.submitLoading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.tool-btn {
  font-size: 20px;
  cursor: pointer;
}
.tool-btn:hover {
  color: #409eff;
}
.avatar-uploader {
  ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  ::v-deep .el-upload:hover {
    border-color: #409eff;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
