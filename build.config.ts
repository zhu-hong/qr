import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  externals: ['vue-demi'],
  declaration: true,
  clean: true,
  outDir: 'dist',
})
