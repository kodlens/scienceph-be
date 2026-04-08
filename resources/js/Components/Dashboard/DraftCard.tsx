import React from 'react'
import StatCard from '../StatCard'
import axios from 'axios'

const DraftCard = () => {

  const [draftCount, setDraftCount] = React.useState<number | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/dashboard/draft-count")
      setDraftCount(res.data.count)
    } catch (error) {
      console.error("Failed to fetch draft count:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <StatCard title="Draft" value={draftCount ?? 0} loading={loading} />
  )
}

export default DraftCard
