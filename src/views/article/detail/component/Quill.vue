<template>
  <quill-editor
    ref="myQuillEditor"
    v-model="content"
    :options="quillEditorOption"
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @ready="onEditorReady($event)"
    style="height:300px"
  />
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  name: "Quill",
  components: { quillEditor },
  data() {
    return {
      content: "",
      quillEditorOption: {
        //主题
        theme: "snow",
        placeholder: "开始编辑..."
      }
    };
  },
  methods: {
    //失去焦点事件
    onEditorBlur(quill) {
      console.log("editor blur!", quill);
    },
    //获得焦点事件
    onEditorFocus(quill) {
      console.log("editor focus!", quill);
    },
    // 准备富文本编辑器
    onEditorReady(quill) {
      console.log("editor ready!", quill);
    }
  }
};
</script>

<style lang="scss" scoped></style>
