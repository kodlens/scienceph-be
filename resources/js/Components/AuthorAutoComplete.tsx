import { Author } from '@/types'
import { AutoComplete } from 'antd'
import axios from 'axios'
import { useRef, useState } from 'react'

type Props = {
  value?: string
  onChange?: (value: string) => void
}

type AutoCompleteOption = {
  value: string
}

export default function AuthorAutoComplete({
  onChange,
  value
}: Props) {

  const [options, setOptions] = useState<AutoCompleteOption[]>([])
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = (search: string) => {
    if (!search) {
      setOptions([])
      return
    }

    // debounce (simple, no library)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(`/get-authors-autocomplete?search=${search}`)

        const mapped = res.data
          .filter((a: Author) => a.author)
          .map((a: Author) => ({
            value: a.author as string,
          }))

        setOptions(mapped)
      } catch (err) {
        console.log(err)
      }
    }, 1000)
  }

  return (
    <AutoComplete
      options={options}
      onSearch={handleSearch}
      value={value}
      onChange={onChange}
      style={{ width: '100%' }}
      placeholder="Author"
      allowClear
    />
  )
}
