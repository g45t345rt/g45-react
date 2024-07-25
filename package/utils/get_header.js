function getHeader(headers, key) {
  let value = ``

  if (headers) {
    if (typeof headers.get === `function`) {
      // using cloudflare worker 
      // https://developers.cloudflare.com/workers/examples/extract-cookie-value
      value = headers.get(key) || `''`
    } else {
      // using nodejs
      value = headers[key] || ``
    }
  }

  return value
}

export default getHeader
