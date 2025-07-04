import React from 'react'
import classnames from 'classnames'
import {useCombobox} from 'downshift'


const MAX_HEIGHT = 140;

export type InputAutocompleteProps = {
  value?: string
  options?: any[]
  onChange?(value: string | undefined): unknown
  keepMenuWithinWindowBounds?: boolean
  'aria-label'?: string
};

export default function InputAutocomplete({
  value,
  options = [],
  onChange = () => {},
  keepMenuWithinWindowBounds,
  'aria-label': ariaLabel,
}: InputAutocompleteProps) {
  const [maxHeight, setMaxHeight] = React.useState(MAX_HEIGHT)
  const [input, setInput] = React.useState(value || '')
  const autocompleteMenuEl = React.useRef<HTMLDivElement | null>(null)

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

  const calcMaxHeight = React.useCallback(() => {
    if (keepMenuWithinWindowBounds && autocompleteMenuEl.current) {
      const maxHeightLocal = window.innerHeight -
        autocompleteMenuEl.current.getBoundingClientRect().top
      const limitedMaxHeight = Math.min(maxHeightLocal, MAX_HEIGHT)
      if (limitedMaxHeight !== maxHeight) {
        setMaxHeight(limitedMaxHeight)
      }
    }
  }, [keepMenuWithinWindowBounds, maxHeight])

  React.useEffect(() => {
    calcMaxHeight()
  })

  return (
    <div ref={autocompleteMenuEl} className="maputnik-autocomplete">
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
          style: {
            position: 'fixed',
            overflow: 'auto',
            maxHeight: maxHeight,
            zIndex: '998',
          },
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
