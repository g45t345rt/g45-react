import { useEffect, useState } from 'react'
import prettyMs from 'pretty-ms'

import { useServerData } from '../hooks/useServerData'

function Age(props) {
  const { ssrKey, timestamp, ms = 1000, format = { compact: true }, update = false } = props

  // this is important to use server timestamp and avoid timestamp mismatch with hydration
  const ageTimestamp = useServerData(`component:age:${ssrKey ? ssrKey : timestamp}`, () => {
    return new Date().getTime() - (timestamp || 0)
  }, 0)

  const [age, setAge] = useState(ageTimestamp)

  useEffect(() => {
    let timeoutId = null
    const updateTime = () => {
      const age = new Date().getTime() - (timestamp || 0)
      setAge(age)

      if (update) timeoutId = setTimeout(updateTime, ms)
    }

    updateTime()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [update, timestamp])

  if (!timestamp) return null
  return prettyMs(age, format)
}

export default Age