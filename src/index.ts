import { defineComponent, h } from 'vue-demi'
import type { PropType } from 'vue-demi'
import qrcodegen from './qrcodegen'

type Level = 'L' | 'M' | 'Q' | 'H'
const levels: Record<Level, qrcodegen.QrCode.Ecc> = {
  L: qrcodegen.QrCode.Ecc.LOW,
  M: qrcodegen.QrCode.Ecc.MEDIUM,
  Q: qrcodegen.QrCode.Ecc.QUARTILE,
  H: qrcodegen.QrCode.Ecc.HIGH,
}

export const QrCodeComponent = defineComponent({
  name: 'QrCodeComponent',
  props: {
    'content': {
      type: String,
      default: '👀',
    },
    'size': {
      type: Number,
      default: 100,
    },
    'level': {
      type: String as PropType<Level>,
      default: 'H',
    },
    'use-svg': {
      type: Boolean,
      default: true,
    },
  },
  render() {
    const modules = qrcodegen.QrCode.encodeText(this.$props.content, levels[this.$props.level]).getModules()
    return h(
      this.$props.useSvg ? svgRender : canvasRender,
      {
        modules: modules,
        size: this.$props.size,
      },
    )
  }
})

const svgRender = defineComponent({
  name: 'SvgRender',
  props: {
    modules: Array as PropType<boolean[][]>,
    size: Number,
  },
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: this.$props.size,
        height: this.$props.size,
        viewBox: `0 0 ${this.$props.modules[0].length} ${this.$props.modules.length}`,
        // 'shape-rendering': `crispEdges`,
      },
    )
  },
})

const canvasRender = defineComponent({
  name: 'CanvasRender',
  props: {
    modules: Array as PropType<boolean[][]>,
    size: Number,
  },
  render() {
    return h('canvas')
  },
})
