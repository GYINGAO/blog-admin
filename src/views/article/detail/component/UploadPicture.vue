<template>
  <div>
    <el-upload
      ref="elupload"
      action="#"
      list-type="picture-card"
      :auto-upload="false"
      accept=".jpg,.jpeg,.png"
      :file-list="pictureList"
      :on-change="handleChange"
      :multiple="true"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UploadPicture",
  props: {
    pictureList: {
      required: true
    }
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false
    };
  },
  methods: {
    handleRemove(file) {
      this.$refs.elupload.handleRemove(file);
      this.$emit("picture-remove", file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleChange(file, fileList) {
      this.$emit("picture-change", fileList);
    }
  },
  created() {
    // this.$on("upload", res => {
    //   console.log(this.$refs.elupload.fileList);
    // });
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-upload-list {
  li {
    width: 80px;
    height: 80px;
  }
}
::v-deep .el-upload {
  width: 80px;
  height: 80px;
  line-height: 90px;
  i {
  }
}
</style>
