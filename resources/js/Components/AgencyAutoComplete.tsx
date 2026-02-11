
import { Agency } from '@/types/agency'
import { AutoComplete } from 'antd'
import { useState } from 'react'




type Props = {
  //options: AutoCompleteOption[]
  agencies: Agency[]
  value?: string
  onChange?: (value: string) => void
}

type AutoCompleteOption = {
  value: string
}
export default function AgencyAutoComplete({
  onChange,
  agencies,
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

    const filtered = agencies
      .filter(item =>
        item.code?.toLowerCase().includes(value.toLowerCase())
      )
      .filter(item => item.code !== undefined)
      .map(item => ({
        value: item.code as string, // ✅ required by AntD
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
