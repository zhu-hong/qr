import { defineComponent, h, type PropType } from 'vue-demi'
import qrcodegen from './qrcodegen'

type Level = 'L' | 'M' | 'Q' | 'H'
const levels: Record<Level, qrcodegen.QrCode.Ecc> = {
  L: qrcodegen.QrCode.Ecc.LOW,
  M: qrcodegen.QrCode.Ecc.MEDIUM,
  Q: qrcodegen.QrCode.Ecc.QUARTILE,
  H: qrcodegen.QrCode.Ecc.HIGH,
}

function generatePath(modules: boolean[][], margin: number = 0): string {
  const ops: string[] = []
  modules.forEach((row, y) => {
    let start: number | null = null
    row.forEach((cell, x) => {
      if (!cell && start !== null) {
        // M0 0h7v1H0z injects the space with the move and drops the comma,
        // saving a char per operation
        ops.push(
          `M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`
        )
        start = null
        return
      }

      // end of row, clean up or skip
      if (x === row.length - 1) {
        if (!cell) {
          // We would have closed the op above already so this can only mean
          // 2+ light modules in a row.
          return
        }
        if (start === null) {
          // Just a single dark module.
          ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`)
        } else {
          // Otherwise finish the current line.
          ops.push(
            `M${start + margin},${y + margin} h${x + 1 - start}v1H${
              start + margin
            }z`
          )
        }
        return
      }

      if (cell && start === null) {
        start = x
      }
    })
  })
  return ops.join('')
}

export const QrCodeComponent = defineComponent({
  name: 'QrCodeComponent',
  props: {
    content: {
      type: String,
      default: '👀',
    },
    size: {
      type: [Number,String],
      default: 100,
    },
    level: {
      type: String as PropType<Level>,
      default: 'H',
    },
    useSvg: {
      type: Boolean as PropType<true | false>,
      default: true,
    },
    margin: {
      type: Boolean as PropType<true | false>,
      default: false,
    },
  },
  computed: {
    modules() {
      return qrcodegen.QrCode.encodeText(this.content, levels[this.level]).getModules()
    },
  },
  render() {
    return h(
      this.useSvg ? svgRender : canvasRender,
      {
        modules: this.modules,
        size: Math.abs(Number(this.size)),
        margin: this.margin,
      },
    )
  }
})

const svgRender = defineComponent({
  name: 'SvgRender',
  props: {
    modules: {
      type: Array as PropType<boolean[][]>,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    margin: {
      type: Number,
      required: true,
    },
  },
  computed: {
    marginWidth() {
      return this.margin ? 1 : 0
    },
    cells() {
      return this.modules.length + this.marginWidth * 2
    },
    fPath() {
      return generatePath(this.modules, this.marginWidth)
    },
  },
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: this.size,
        height: this.size,
        viewBox: `0 0 ${this.cells} ${this.cells}`,
        'shape-rendering': `crispEdges`,
      },
      [
        h('path', {
          fill: '#FFFFFF',
          d: `M0,0 h${this.cells}v${this.cells}H0z`,
        }),
        h('path', {
          fill: '#000000',
          d: this.fPath,
        }),
      ],
    )
  },
})

const canvasRender = defineComponent({
  name: 'CanvasRender',
  props: {
    modules: {
      type: Array as PropType<boolean[][]>,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    margin: {
      type: Number,
      required: true,
    },
  },
  computed: {
    marginWidth(): number {
      return this.margin ? this.size / (this.modules.length + 2) : 0
    },
    cellWidth(): number {
      return this.size / (this.modules.length + (this.margin ? 2 : 0))
    },
  },
  data(): {
    ctx: CanvasRenderingContext2D | null,
  } {
    return {
      ctx: Object.freeze(null)
    }
  },
  methods: {
    draw() {
      if(this.ctx === null) {
        this.ctx = this.$el.getContext('2d')
      }

      this.ctx!.clearRect(0,0,this.size,this.size)

      this.ctx!.fillStyle = '#FFFFFF'
      this.ctx!.fillRect(0,0,this.size,this.size)

      this.ctx!.fillStyle = '#000000'
      this.modules.forEach((row: boolean[], y: number) => {
        row.forEach((cell, x) => {
          if(x===0 && y===0) {
            this.ctx!.beginPath()
          }
          if(cell) {
            this.ctx!.moveTo(x*this.cellWidth+this.marginWidth,y*this.cellWidth+this.marginWidth)
            this.ctx!.lineTo((x+1)*this.cellWidth+this.marginWidth,y*this.cellWidth+this.marginWidth)
            this.ctx!.lineTo((x+1)*this.cellWidth+this.marginWidth,(y+1)*this.cellWidth+this.marginWidth)
            this.ctx!.lineTo(x*this.cellWidth+this.marginWidth,(y+1)*this.cellWidth+this.marginWidth)
            this.ctx!.fill()
          }
          if(x === this.modules.length - 1 && y === this.modules.length - 1) {
            this.ctx!.closePath()
          }
        })
      })
    },
  },
  mounted() {
    this.draw()
  },
  updated() {
    this.draw()
  },
  render() {
    return h('canvas', {
      width: this.size,
      height: this.size,
      style: { width: `${this.size}px`, height: `${this.size}px`},
    })
  },
})
