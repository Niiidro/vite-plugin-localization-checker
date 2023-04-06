import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'

const outputPluginStats = () => ({
    name: 'output-plugin-stats',
    configResolved(config) {
      const plugins = config.plugins.map((plugin) => plugin.name)
      console.log(`Your project has ${plugins.length} Vite plugins.`)
      console.table(plugins)
    }
  })

export default defineConfig({
    plugins: [Inspect(), outputPluginStats()]
})
