<template>
  <div>
    <div class="upload-wrap" @click="selectFile">
      <slot>
        <div v-if="!src" class="upload-main">+</div>
        <img v-else :src="src" alt="src" class="preview" />
      </slot>
    </div>

    <input
      type="file"
      style="display: none"
      ref="fileDom"
      @change="fileChange"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default defineComponent({
  name: "BdUpload",
  setup(props, ctx) {
    const fileDom = ref(null);
    const src = ref("");
    const selectFile = () => {
      if (fileDom.value !== null) {
        fileDom.value.click();
      }
    };
    const fileChange = e => {
      getBase64(e.target.files[0], res => {
        src.value = res;
      });
      ctx.emit("file-change", e.target.files);
    };
    return { selectFile, src, fileDom, fileChange };
  }
});
</script>

<style lang="scss" scoped>
.upload-main {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  border: 1px solid blue;
}
.preview {
  width: 120px;
  height: 120px;
}
</style>
