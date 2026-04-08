import { Author } from '@/types'
import { AutoComplete } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'


type Props = {
  //options: AutoCompleteOption[]
  authors?: Author[]
  value?: string
  onChange?: (value: string) => void
}

type AutoCompleteOption = {
  value: string
}

export default function AuthorAutoComplete({
  onChange,
  authors,
  value }: Props
) {

 // const [options, setOptions] = useState<AutoCompleteOption[]>([])
  const [data, setData] = useState<Author[]>(authors || [])

  const [filteredOptions, setFilteredOptions] = useState<AutoCompleteOption[]>([])


  const fetchAuthors = (search: string) => {
    axios.get(`/get-authors-autocomplete?search=${search}`).then(res => {
      setData(res.data)
    }).catch(err => {
      console.log(err);
    })
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchAuthors(value || "")
    }, 300)

    return () => clearTimeout(delay)
  }, [value])


  const handleSearch = (value: string) => {
    if (!value) {
      setFilteredOptions([])
      return
    }

    const filtered = data
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
      options={data}

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
