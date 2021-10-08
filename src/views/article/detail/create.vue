<template>
  <el-row :gutter="20">
    <el-col :xs="24" :sm="18">
      <div class="grid-content">
        <el-form ref="form">
          <el-form-item label="文章标题">
            <el-input v-model="article.title"></el-input>
          </el-form-item>
          <el-form-item label="编辑器">
            <el-select v-model="editor" placeholder="请选择编辑器">
              <el-option label="Markdown编辑器" value="markdown"></el-option>
              <el-option label="富文本编辑器" value="quill"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <markdown ref="markdown" v-if="editor === 'markdown'"> </markdown>
        <quill v-else ref="quill"></quill>
      </div>
    </el-col>
    <el-col :sm="6">
      <div class="grid-content hidden-xs-only">
        <el-form ref="rightform">
          <el-form-item label="摘要">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 10 }"
              v-model="article.summary"
              placeholder="请输入摘要"
              :show-word-limit="true"
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="封面图">
            <br />
            <upload-picture
              :picture-list="article.cover"
              ref="upload"
              @picture-change="handleCoverChange"
              @picture-remove="handleCoverRemove"
            ></upload-picture>
          </el-form-item>
          <el-form-item label="是否置顶">
            <el-switch
              v-model="article.top_flag"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="article.category" placeholder="请选择文章分类">
              <el-option
                v-for="item in cetegoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签">
            <el-tag
              :key="index"
              v-for="(tag, index) in article.tags"
              closable
              :disable-transitions="false"
              @close="removeTag(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-autocomplete
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="addTag"
              :fetch-suggestions="getTags"
              @select="handleSelect"
              @blur="handleBlur"
            >
              <template slot-scope="{ item }">
                <div class="name">{{ item.name }}</div>
              </template>
            </el-autocomplete>
            <el-button
              v-else
              class="button-new-tag"
              size="mini"
              @click="showInput"
              >+</el-button
            >
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker
              type="datetime"
              placeholder="选择发布时间"
              align="right"
              v-model="article.push_date"
              :picker-options="pickerOptions"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>

          <el-form-item size="medium">
            <el-button type="primary" @click="onSubmit">
              {{ "立即添加" }}</el-button
            >
          </el-form-item>
        </el-form>
      </div></el-col
    >
  </el-row>
</template>

<script>
import categoryAPI from "@/api/category";
import tagAPI from "@/api/tag";
import UploadPicture from "./component/UploadPicture";
import Markdown from "./component/Markdown.vue";
import Quill from "./component/Quill.vue";
import articleAPI from "@/api/article";
import { paramsToFormData } from "@/utils/";
export default {
  name: "CreateArticle",
  components: { UploadPicture, Quill, Markdown },
  data() {
    Markdown;
    return {
      inputVisible: false,
      inputValue: "",
      tagString: "",
      editor: "markdown",
      article: {
        title: "",
        sunmary: "",
        content: "",
        push_date: new Date(),
        top_flag: 0,
        category: null,
        user_id: this.$store.getters.id,
        tags: [],
        cover: []
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      cetegoryList: []
    };
  },
  methods: {
    async onSubmit() {
      this.article.content =
        this.editor === "markdown"
          ? this.$refs.markdown.content
          : this.$refs.quill.content;
      // this.article.tags = this.article.tags.join(",");
      const formData = paramsToFormData(this.article);
      try {
        const res = await articleAPI.create(formData);
        this.$router.push({ name: "ArticleList" });
      } catch (error) {}
    },

    async getCategoryList() {
      try {
        const res = await categoryAPI.select();
        this.cetegoryList = res.data.rows;
      } catch (error) {}
    },
    handleBlur() {
      setTimeout(() => {
        if (this.inputValue) {
          this.addTag();
        } else {
          this.inputVisible = false;
        }
      }, 200);
    },
    handleSelect(item) {
      this.inputValue = item.name;
      this.addTag();
    },
    async getTags(queryString, cb) {
      queryString = queryString ? queryString : "";
      const {
        data: { rows }
      } = await tagAPI.select({ like: queryString });
      cb(rows);
    },
    removeTag(tag) {
      this.article.tags.splice(this.article.tags.indexOf(tag), 1);
    },
    addTag() {
      let inputValue = this.inputValue.trim();
      if (this.article.tags.indexOf(inputValue) !== -1) {
        this.inputValue = "";
        return this.$notify.error({
          title: "错误",
          message: "标签重复",
          duration: 2 * 1000
        });
      }
      if (inputValue.length >= 20) {
        return this.$notify.error({
          title: "错误",
          message: "标签长度不能超过 20 ",
          duration: 2 * 1000
        });
      }
      if (inputValue) {
        this.article.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleCoverChange(coverList) {
      this.article.cover = coverList;
    },
    handleCoverRemove(file) {
      this.article.cover = this.article.cover.filter(
        value => value.uid != file.uid
      );
    }
  },
  created() {
    this.getCategoryList();
  },
  resetArticle() {
    return {
      title: "",
      sunmary: "",
      content: "",
      push_date: new Date(),
      top_flag: 0,
      category: null,
      user_id: this.$store.getters.id,
      tags: [],
      cover: []
    };
  }
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.el-tag + .el-tag {
  margin-left: 5px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 150px;
  margin-left: 10px;
  vertical-align: bottom;
}
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .highlighted {
      color: #ddd;
    }
  }
}
</style>
