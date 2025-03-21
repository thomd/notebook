import { useState } from 'react'
import CreatableSelect from 'react-select/creatable'

export default function CategorySelect({ setDisabled, pages, page }) {
  const [value, setValue] = useState(page.category ? { value: page.category, label: page.category } : '')

  const categories = pages
    .map((page) => page.category)
    .filter((category) => category !== undefined)
    .filter((category, index, self) => index === self.indexOf(category))
    .map((category) => {
      return { value: category, label: category }
    })
    .sort((p, q) => p.label.localeCompare(q.label))

  const creatableSelectTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: '#9ca3af',
      primary25: '#d1d5db',
      neutral30: '#d1d5db',
    },
  })

  const creatableSelectStyles = {
    control: (baseStyles) => ({
      ...baseStyles,
      borderWidth: 2,
      boxShadow: 'none',
      borderColor: '#d1d5db',
      borderRadius: 0,
    }),
    placeholder: (baseStyles) => ({
      ...baseStyles,
      fontSize: '1rem',
      color: '#d1d5db',
    }),
  }

  const handleChange = (newValue) => {
    setValue(newValue ? newValue : '')
    setDisabled(newValue === page.category)
  }

  return (
    <CreatableSelect
      name="category"
      placeholder="Category"
      onChange={handleChange}
      defaultValue={value}
      isClearable
      options={categories}
      styles={creatableSelectStyles}
      theme={creatableSelectTheme}
    />
  )
}
