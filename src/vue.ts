import { defineComponent, h, isVue2, type PropType } from 'vue-demi'
import { encodeText, type Level } from './util'

function hi(el: any, props?: { attrs?: Record<string, any>, props?: Record<string, any> }, children?: any[]) {
  return h(el, isVue2 ? { props: props?.props, attrs: props?.attrs } : { ...props?.attrs, ...props?.props }, children)
}

function generateSvgPath(modules: boolean[][], margin: number = 0): string {
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
    padding: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    thickness(): number {
      return this.padding ? 1 : 0
    },
    cells(): number {
      return this.modules.length + this.thickness * 2
    },
    fPath(): string {
      return generateSvgPath(this.modules, this.thickness)
    },
  },
  render() {
    return hi(
      'svg',
      {
        attrs: {
          xmlns: 'http://www.w3.org/2000/svg',
          width: this.size,
          height: this.size,
          viewBox: `0 0 ${this.cells} ${this.cells}`,
          'shape-rendering': `crispEdges`,
        },
      },
      [
        hi('path', {
          attrs: {
            fill: '#FFFFFF',
            d: `M0,0 h${this.cells}v${this.cells}H0z`,
          },
        }),
        hi('path', {
          attrs: {
            fill: '#000000',
            d: this.fPath,
          },
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
    padding: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    thickness(): number {
      return this.padding ? this.size / (this.modules.length + 2) : 0
    },
    cellWidth(): number {
      return this.size / (this.modules.length + (this.padding ? 2 : 0))
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
            this.ctx!.moveTo(x*this.cellWidth+this.thickness,y*this.cellWidth+this.thickness)
            this.ctx!.lineTo((x+1)*this.cellWidth+this.thickness,y*this.cellWidth+this.thickness)
            this.ctx!.lineTo((x+1)*this.cellWidth+this.thickness,(y+1)*this.cellWidth+this.thickness)
            this.ctx!.lineTo(x*this.cellWidth+this.thickness,(y+1)*this.cellWidth+this.thickness)
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
    return hi('canvas', {
      attrs: {
        width: this.size,
        height: this.size,
        style: { width: `${this.size}px`, height: `${this.size}px`},
      },
    })
  },
})

export const QrCode = defineComponent({
  name: 'QrCode',
  props: {
    content: {
      type: String as PropType<string>,
      default: '👀',
    },
    size: {
      type: Number as PropType<number>,
      default: 100,
      validator: (val) => !isNaN(val as number),
    },
    level: {
      type: String as PropType<Level>,
      default: 'H',
    },
    svg: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    padding: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  computed: {
    modules(): boolean[][] {
      return encodeText(this.content, this.level)
    },
  },
  render() {
    return hi(
      this.svg ? svgRender : canvasRender,
      {
        props: {
          modules: this.modules,
          size: Math.abs(Number(this.size)),
          padding: this.padding,
        },
      },
    )
  }
})
