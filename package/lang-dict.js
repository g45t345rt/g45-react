const yargs = require(`yargs`)
const dir = require('node-dir')
const fs = require('fs')
const path = require('path')

const argv = yargs(process.argv)
  .option(`src`, {
    type: `string`,
    requiresArg: true
  })
  .option(`outfile`, {
    type: `string`,
    requiresArg: true
  })
  .parse()

const main = () => {
  // t('') - t("") - t(``) - t('', [])
  lang_translate_func_pattern = /t\(["'`]([^"'`]*)["'`]?.+\)/g
  // p('','',0) - p("","",0) - p(``,``,0)
  lang_plural_func_pattern = /p\(["'`]([^"'`]*)["'`], +["'`]([^"'`]*)["'`]?.+\)/g

  let dictionary = {}

  dir.readFiles(argv.src, (err, content, next) => {
    if (err) throw err

    const t_matches = content.matchAll(lang_translate_func_pattern)
    for (const match of t_matches) {
      const key = match[1]
      dictionary[key] = key
    }

    const p_matches = content.matchAll(lang_plural_func_pattern)
    for (const match of p_matches) {
      const firstKey = match[1]
      dictionary[firstKey] = firstKey
      const secondKey = match[2]
      dictionary[secondKey] = secondKey
    }

    next()
  }, (err) => {
    if (err) throw err

    if (fs.existsSync(argv.outfile)) {
      const dir = path.dirname(argv.outfile)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      const dictionary_string = fs.readFileSync(argv.outfile)
      const current_dictionary = JSON.parse(dictionary_string)

      Object.keys(current_dictionary).forEach((key) => {
        if (!dictionary[key]) {
          delete current_dictionary[key]
          console.log(`Remove key: ${key}`)
        }
      })

      Object.keys(dictionary).forEach((key) => {
        if (!current_dictionary[key]) {
          current_dictionary[key] = key
          console.log(`Add key: ${key}`)
        }
      })

      const new_dictionary_string = JSON.stringify(current_dictionary, null, 2)
      fs.writeFileSync(argv.outfile, new_dictionary_string)
    } else {
      console.log(dictionary)
      const dictionary_string = JSON.stringify(dictionary, null, 2)
      fs.writeFileSync(argv.outfile, dictionary_string)
      console.log(`New lang dictionary created.`)
    }
  })
}

main()