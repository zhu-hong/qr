import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/util'
  ],
  externals: ['vue-demi'],
  declaration: true,
  clean: true,
  outDir: 'dist',
  rollup: {
    emitCJS: true,
  },
})
