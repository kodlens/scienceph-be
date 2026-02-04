import { Author } from '@/types'
import { AutoComplete, FormInstance } from 'antd'
import { useEffect, useState } from 'react'




type Props = {
  //options: AutoCompleteOption[]
  authors: Author[]
  value?: string
  onChange?: (value: string) => void
}

type AutoCompleteOption = {
  value: string
}
export default function AuthorAutoComplete({
  onChange,
  authors,
  value }:
  Props
) {

 // const [options, setOptions] = useState<AutoCompleteOption[]>([])
  const [filteredOptions, setFilteredOptions] = useState<AutoCompleteOption[]>([])
  // const fetchAuthors = async () => {
  //   const response = await fetch('/get-authors-autocomplete')
  //   const data: AuthorApi[] = await response.json()

  //   // 🔥 map API data → AntD AutoComplete format
  //   const mapped = data.map(item => ({
  //     value: item.author
  //   }))

  //   setOptions(mapped)
  // }

  // useEffect(() => {
  //   fetchAuthors()
  // }, [])

  const handleSearch = (value: string) => {
    if (!value) {
      setFilteredOptions([])
      return
    }

    const filtered = authors
      .filter(author =>
        author.author?.toLowerCase().includes(value.toLowerCase())
      )
      .filter(author => author.author !== undefined)
      .map(author => ({
        value: author.author as string, // ✅ required by AntD
      }))

    setFilteredOptions(filtered)
  }


  // const handleSelect = (value: string) => {
  //   form.setFieldsValue({
  //     author: value
  //   })
  // }


  return (
    <AutoComplete
      options={filteredOptions}
      onSearch={handleSearch}
      value={value}
      onChange={onChange}

      style={{ width: '100%' }}
      placeholder="Author"

      allowClear
    >
    </AutoComplete>
  )
}
