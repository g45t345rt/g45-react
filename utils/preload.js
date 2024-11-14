export const preloadSVG = (url) => {
  return <link rel="preload" as="image" href={url} type="image/svg+xml" />
}

export const preloadWOFF = (url) => {
  return <link rel="preload" href={url} as="font" type="font/woff" crossorigin />
}

export const preloadIMG = (url) => {
  return <link rel="preload" as="image" href={url} />
}
