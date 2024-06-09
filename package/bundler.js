const esbuild = require(`esbuild`)
const yargs = require(`yargs`)
const fs = require('fs')
const stylePlugin = require('esbuild-style-plugin')
const autoprefixer = require('autoprefixer')
const path = require('path')
const { copy } = require('esbuild-plugin-copy')
const dir = require('node-dir')
const { spawn } = require('child_process')

const defaultConfigPath = `./bundler-config.json`
const defaultDefinePath = `./bundler-define.json`

const argv = yargs(process.argv)
  .option(`entry`, {
    type: `string`,
    requiresArg: true
  })
  .option(`lang`, {
    type: `string`,
    default: './lang'
  })
  .option(`type`, {
    type: `string`,
    default: `index`
  })
  .option(`watch`, {
    type: `boolean`,
    default: false
  })
  .option(`sourcemap`, {
    type: `boolean`,
    default: false
  })
  .option(`minify`, {
    type: `boolean`,
    default: false
  })
  .option(`config`, {
    type: `string`,
    default: defaultConfigPath
  })
  .option(`metafile`, {
    type: `boolean`,
    default: false
  })
  .option(`define`, {
    type: `string`,
    default: defaultDefinePath
  })
  .option(`dev`, {
    type: `boolean`,
    default: false
  })
  .parse()

const sourcemap = argv.sourcemap ? `inline` : false

const defaultConfig = {
  loader: {
    '.js': `jsx`,
    '.woff': 'file',
    '.woff2': 'file',
    '.svg': 'file',
    '.ttf': 'file',
    '.eot': 'file',
    '.png': 'file',
    '.jpg': 'file'
  },
  external: []
}

let devServer = {
  process: null,
  command: null,
  args: [],
  useShell: false // true to execute cloudflare npx live reload and avoid kill
}

const runDevServer = () => {
  const { command, args, useShell } = devServer

  if (!command) return
  if (devServer.process) {
    if (useShell) return
    devServer.process.kill() // kill does not work with shell
    devServer.process = null
  }

  devServer.process = spawn(command, args, { shell: useShell })

  devServer.process.stdout.on(`data`, (data) => {
    console.log(`${data}`)
  })

  devServer.process.stderr.on(`data`, (data) => {
    console.error(`${data}`)
  })

  devServer.process.on(`close`, (code) => {
    console.log(`Dev server exited with code ${code}`)
  })

  console.log(`Dev server started with PID: ${devServer.process.pid}`)
}

const rebuildPlugin = ({ isServer = false } = {}) => {
  const name = isServer ? `Build server` : `Build client`

  return {
    name: 'rebuild-plugin',
    setup(build) {
      build.onStart(() => {
        console.time(name)
      }),
        build.onEnd(() => {
          console.timeEnd(name)

          if (isServer) {
            runDevServer()
          }
        })
    }
  }
}

const copyPublicPlugin = (to) => {
  return copy({
    resolveFrom: 'cwd',
    assets: {
      from: ['./public/**/*'],
      to: [to],
    },
    watch: argv.watch,
  })
}

const copyIndexHtml = () => {
  const from = path.join(__dirname, './app/index.html')

  const dir = './dist/index/'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const to = path.join(process.cwd(), './dist/index/index.html')
  fs.copyFileSync(from, to)
}

const loadConfig = () => {
  let config = {}

  if (fs.existsSync(argv.config)) {
    const configDataString = fs.readFileSync(argv.config, { encoding: `utf-8` })
    config = JSON.parse(configDataString)
  } else if (argv.config === defaultConfigPath) {
    config = defaultConfig
  }

  return config
}

const config = loadConfig()

const loadDefine = () => {
  let define = {}

  if (fs.existsSync(argv.define)) {
    const defineDataString = fs.readFileSync(argv.define, { encoding: `utf-8` })
    define = JSON.parse(defineDataString)
    Object.keys(define).forEach((key) => {
      const value = define[key]
      if (typeof value === 'string') define[key] = `"${value}"`
      else define[key] = `${value}`
    })
  }

  console.log(define)
  return define
}

const define = loadDefine()

const resolveRoutesPathPlugin = () => {
  return {
    name: 'routes-path',
    setup(build) {
      build.onResolve({ filter: /ROUTES_PATH/ }, args => {
        const routesPath = path.join(process.cwd(), argv.entry)
        return { path: routesPath }
      })
    },
  }
}

const createLangImportCode = () => {
  let code = ``
  let export_dict = ``

  if (fs.existsSync(argv.lang)) {
    const files = dir.files(argv.lang, { sync: true })
    files.forEach(file => {
      const key = path.basename(file, '.json')
      const file_path = file.split('\\').join('/')
      code += `import ${key} from './${file_path}'\n`
      export_dict += `${key}, `
    })
  }

  code += `\nexport default { ${export_dict.trim()} }`
  return code
}

const resolveDictionariesPlugin = () => {
  return {
    name: 'dictionaries-path',
    setup(build) {
      build.onResolve({ filter: /DICTIONARIES/ }, args => {
        return { path: args.path, namespace: 'dict-lang' }
      }),
        build.onLoad({ filter: /DICTIONARIES/, namespace: 'dict-lang' }, args => {
          const code = createLangImportCode()
          return { contents: code, resolveDir: process.cwd() }
        })
    },
  }
}

const build = async (options) => {
  if (argv.watch) {
    const ctx = await esbuild.context(options)
    await ctx.watch()
  } else {
    const result = await esbuild.build({
      ...options,
      metafile: argv.metafile
    })

    if (argv.metafile) {
      // save bundle to analyze here https://esbuild.github.io/analyze/
      let dir = options.outdir
      if (!dir) {
        dir = path.dirname(options.outfile)
      }

      fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(result.metafile))
    }
  }
}

const buildCloudflare = async () => {
  const options = {
    bundle: true,
    jsx: `automatic`,
    minify: argv.minify,
    sourcemap,
    define,
    ...config
  }

  // _worker
  const entryServer = path.join(__dirname, './ssr/cloudflare_worker.js')
  await build({
    ...options,
    format: 'esm',
    entryPoints: [entryServer],
    outfile: `./dist/cf/_worker.js`,
    plugins: [
      resolveRoutesPathPlugin(),
      resolveDictionariesPlugin(),
      stylePlugin({
        extract: false,
        postcss: {
          plugins: [autoprefixer()]
        }
      }),
      rebuildPlugin({ isServer: true })
    ]
  })

  // client
  const entryClient = path.join(__dirname, './ssr/client.js')
  await build({
    ...options,
    outdir: `./dist/cf/public`,
    entryPoints: [entryClient],
    plugins: [
      resolveRoutesPathPlugin(),
      resolveDictionariesPlugin(),
      stylePlugin({
        postcss: {
          plugins: [autoprefixer()]
        }
      }),
      rebuildPlugin(),
      copyPublicPlugin(`./dist/cf/public`)
    ]
  })
}

const buildNodeServer = async () => {
  const options = {
    bundle: true,
    jsx: `automatic`,
    minify: argv.minify,
    sourcemap,
    define,
    ...config
  }

  // node_server
  const entryServer = path.join(__dirname, './ssr/node_server.js')
  await build({
    ...options,
    platform: 'node',
    outfile: `./dist/node_server/server.js`,
    entryPoints: [entryServer],
    plugins: [
      resolveRoutesPathPlugin(),
      resolveDictionariesPlugin(),
      stylePlugin({
        extract: false,
        postcss: {
          plugins: [autoprefixer()]
        }
      }),
      rebuildPlugin({ isServer: true })
    ]
  })

  // client
  const entryClient = path.join(__dirname, './ssr/client.js')
  await build({
    ...options,
    outdir: `./dist/node_server/public`,
    entryPoints: [entryClient],
    plugins: [
      resolveRoutesPathPlugin(),
      resolveDictionariesPlugin(),
      stylePlugin({
        postcss: {
          plugins: [autoprefixer()]
        }
      }),
      rebuildPlugin(),
      copyPublicPlugin(`./dist/node_server/public`)
    ]
  })
}

// No ssr
const buildIndex = async () => {
  const entry = path.join(__dirname, './app/client.js')

  const options = {
    bundle: true,
    jsx: `automatic`,
    minify: argv.minify,
    sourcemap,
    define,
    ...config
  }

  // client only
  await build({
    ...options,
    outdir: `./dist/index/public`,
    entryPoints: [entry],
    plugins: [
      resolveRoutesPathPlugin(),
      resolveDictionariesPlugin(),
      stylePlugin({
        postcss: {
          plugins: [autoprefixer()]
        }
      }),
      rebuildPlugin(),
      copyPublicPlugin('./dist/index/public'),
    ]
  })
  copyIndexHtml()
}

const main = async () => {
  switch (argv.type) {
    case `index`:
      buildIndex()
      break
    case `cf_worker`:
      if (argv.dev) {
        devServer.command = `npx wrangler pages dev`
        devServer.args = [`./dist/cf --port=3000 --live-reload`]
        devServer.useShell = true
      }

      buildCloudflare()
      break
    case `node_server`:
      if (argv.dev) {
        devServer.command = `node`
        devServer.args = [`./dist/node_server/server.js`]
      }

      buildNodeServer()
      break
    default:
      throw new Error(`Invalid build type.`)
  }
}

main()
