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
  const autocompleteMenuEl = React.useRef<HTMLDivElement | null>(null)

  const items = options

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    inputValue,
  } = useCombobox({
    items,
    inputValue: value,
    itemToString: (item) => (item ? item[0] : ''),
    onSelectedItemChange: ({selectedItem}) => {
      onChange(selectedItem ? selectedItem[0] : undefined)
    },
    onInputValueChange: ({inputValue: v}) => {
      if (v !== undefined && v !== inputValue) {
        onChange(v === '' ? undefined : v)
      }
    },
  })

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
          items.map((item, index) => (
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
