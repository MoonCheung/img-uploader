<template>
  <HelloWorld msg="自定义组件插件" />
  <ImgUploader />
</template>

<script setup lang="ts">
import { ImgUploader } from '../../../packages/vue/src/index';
import HelloWorld from './components/HelloWorld.vue';
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
