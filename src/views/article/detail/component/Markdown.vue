<template>
  <mavon-editor v-model="content" />
</template>

<script>
export default {
  name: "Markdown",
  data() {
    return {
      content: ""
    };
  }
};
</script>

<style lang="scss" scoped></style>
