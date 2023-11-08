import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { css } from 'goober'
import { useLang } from 'g45-react/hooks/useLang'

const test = DEFINE_TEST

const style = css`
  color: red;
`

css`.what {
  background-color: yellow;
}`

function Home() {
  const { t, p } = useLang()

  useEffect(() => {
    const test = import('react') // this should not be parsed by lang
    console.log(test)
    t('asdf');t('nythrty'); // this should be picked
  }, [])

  const [count, setCount] = useState(0)
  return <div>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <h1>Home</h1>
    <div className={style}>This is home.</div>
    <div>{t('Hello this is the first translation.')}</div>
    <div>{t("Here is another translation test.")}</div>
    <div>{t(`More translation, testing translate function.`)}</div>
    <div>{t('This is a bracket test. 1 = {} and 2 = {}', [1, 2])}</div>
    <div>{p(`{} item`, `{} items`, count)}</div>
    <button onClick={() => setCount(count === 0 ? 1 : 0)}>toggle count</button>
    <div>{test}</div>
    <img src="public/image.png" width={250} />
    <object data="public/image.svg" width="300" height="300"> </object>
  </div>
}

export default Home
