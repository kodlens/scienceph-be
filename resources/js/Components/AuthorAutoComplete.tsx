import { Author } from '@/types'
import { AutoComplete } from 'antd'
import { useState } from 'react'


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
