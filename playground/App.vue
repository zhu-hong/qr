<script setup>
import { ref, computed } from 'vue'
import { QrCode } from '../src/index'
import { encodeText } from '../src/util'

const content = ref('🙏')
const size = ref(500)
const level = ref('H')
const padding = ref(false)
const svg = ref(true)

const modules = computed(() => encodeText(content.value, level.value))
</script>

<template>
  大小：
  <input type="range" v-model="size" min="-100" max="1000">
  <br>
  <br>
  容错等级：
  L：<input type="radio" v-model="level" name="level" value="L">
  M：<input type="radio" v-model="level" name="level" value="M">
  Q：<input type="radio" v-model="level" name="level" value="Q">
  H：<input type="radio" v-model="level" name="level" value="H">
  <br>
  <br>
  内容：
  <input type="text" v-model="content">
  <br>
  <br>
  外边距：
  <input type="checkbox" v-model="padding">
  <br>
  <br>
  <div style="display: flex; justify-content: space-between;">
    <div>
      使用svg渲染？：
      <input type="checkbox" v-model="svg">
      （否则为canvas）
      <br>
      <QrCode :content="content" :size="+size" :padding="padding" :svg="svg" :level="level" />
    </div>
    <div>
      自定义渲染（如div）
      <div>
        <div v-for="row of modules" style="display: flex;">
          <div v-for="cell of row" :style="{ 'width': `${size/modules.length}px`, height: `${size/modules.length}px`, 'background-color': cell ? '#000000' : '#FFFFFF' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>
