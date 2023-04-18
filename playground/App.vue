<script setup>
import { ref } from 'vue'
import { QrCodeComponent } from '../src/index'

const content = ref('🙏')
const size = ref(500)
const margin = ref(false)
const useSvg = ref(true)
</script>

<template>
  大小：
  <input type="range" v-model="size" min="-100" max="1000">
  <br>
  内容：
  <input type="text" v-model="content">
  <br>
  外边距：
  <input type="checkbox" v-model="margin">
  <br>
  svg渲染：
  <input type="checkbox" v-model="useSvg">
  <br>
  <QrCodeComponent :content="content" :size="size" :margin="margin" :use-svg="useSvg" />
</template>
