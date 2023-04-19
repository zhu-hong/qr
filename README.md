# @zhu-hong/qr

> 小而美，简单易用，同时支持Vue 2 & 3

- 🤏 小（未压缩的情况下37.3kb）
- 🤖 智能提示（提供dts类型支持）
- ⚙️ 同时支持VUE 2 & 3（不挑）
- 🍴 `svg`或`canvas`渲染
- 👀 自定义渲染（提供二维码编码函数）

[example](https://643f508e85825e2b016f44ae--super-stardust-82c84e.netlify.app)

[git](https://github.com/zhu-hong/qr)

## install

```sh
npm install @zhu-hong/qr
```

## useage

```ts
// ⚠️ not import QrCode from '@zhu-hong/qr'
import { QrCode } from '@zhu-hong/qr'
```

## props

```ts
type Level = 'L' | 'M' | 'Q' | 'H'

// 二维码内容
content: {
  type: String as PropType<string>,
  default: '👀',
},
// 二维码尺寸（单位像素）
size: {
  type: Number as PropType<number>,
  default: 100,
  validator: (val) => !isNaN(val as number),
},
// 容错等级
level: {
  type: String as PropType<Level>,
  default: 'H',
},
// 是否使用svg渲染
useSvg: {
  type: Boolean as PropType<boolean>,
  default: true,
},
// 是否带点外框（留白）
margin: {
  type: Boolean as PropType<boolean>,
  default: false,
},
```

## 自定义渲染

```ts
import { encodeText } from '@zhu-hong/qr'

// 返回一个boolean[][]，值为true则为黑块
const modules = encodeText('content')
```
