import { AutoComplete, FormInstance, Input } from 'antd'
import { useEffect, useState } from 'react'

interface AuthorApi {
  author: string
}

interface AutoCompleteOption {
  value: string
}

export default function AuthorAutoComplete({ form }: { form: FormInstance }) {
  
  const [options, setOptions] = useState<AutoCompleteOption[]>([])
  const [filteredOptions, setFilteredOptions] = useState<AutoCompleteOption[]>([])

  const fetchAuthors = async () => {
    const response = await fetch('/get-authors-autocomplete')
    const data: AuthorApi[] = await response.json()

    // 🔥 map API data → AntD AutoComplete format
    const mapped = data.map(item => ({
      value: item.author
    }))

    setOptions(mapped)
  }

  useEffect(() => {
    fetchAuthors()
    console.log('mount it first');
    
  }, [])

  useEffect(() => {
    console.log('done loading authors', options);
    
  }, [options])

  const handleSearch = (value: string) => {
    if (!value) {
      setFilteredOptions([])
      return
    }

    setFilteredOptions(
      options.filter(option =>
        option.value.toLowerCase().includes(value.toLowerCase())
      )
    )
  }

  const handleSelect = (value: string) => {
    form.setFieldsValue({
      author: value
    })
  }

  return (
    <AutoComplete
     
      options={filteredOptions}
      onSearch={handleSearch}
      onSelect={handleSelect}
      style={{ width: '100%' }}
      placeholder="Author"
      allowClear
    >
    </AutoComplete>
  )
}
