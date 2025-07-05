import React from 'react'
import classnames from 'classnames'
import {useCombobox} from 'downshift'

export type InputAutocompleteProps = {
  value?: string
  options?: any[]
  onChange?(value: string | undefined): unknown
  'aria-label'?: string
};

export default function InputAutocomplete({
  value,
  options = [],
  onChange = () => {},
  'aria-label': ariaLabel,
}: InputAutocompleteProps) {
  const [input, setInput] = React.useState(value || '')

  const filteredItems = React.useMemo(() => {
    const lv = input.toLowerCase()
    return options.filter((item) => item[0].toLowerCase().includes(lv))
  }, [options, input])

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    openMenu,
  } = useCombobox({
    items: filteredItems,
    inputValue: input,
    itemToString: (item) => (item ? item[0] : ''),
    stateReducer: (_state, action) => {
      if (action.type === useCombobox.stateChangeTypes.InputClick) {
        return {...action.changes, isOpen: true}
      }
      return action.changes
    },
    onSelectedItemChange: ({selectedItem}) => {
      const v = selectedItem ? selectedItem[0] : ''
      setInput(v)
      onChange(selectedItem ? selectedItem[0] : undefined)
    },
    onInputValueChange: ({inputValue: v}) => {
      if (typeof v === 'string') {
        setInput(v)
        onChange(v === '' ? undefined : v)
      }
    },
  })

  React.useEffect(() => {
    setInput(value || '')
  }, [value])

  return (
    <div className="maputnik-autocomplete">
      <input
        {...getInputProps({
          'aria-label': ariaLabel,
          className: 'maputnik-string',
          spellCheck: false,
          onFocus: () => openMenu(),
        })}
      />
      <div
        {...getMenuProps({
          className: 'maputnik-autocomplete-menu',
        })}
      >
        {isOpen &&
          filteredItems.map((item, index) => (
            <div
              key={item[0]}
              {...getItemProps({
                item,
                index,
                className: classnames('maputnik-autocomplete-menu-item', {
                  'maputnik-autocomplete-menu-item-selected': highlightedIndex === index,
                }),
              })}
            >
              {item[1]}
            </div>
          ))}
      </div>
    </div>
  )
}
