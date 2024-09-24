import type { Base16Theme, StylingConfig } from 'react-base16-styling'

export default function getJsonTreeTheme(
  base16Theme: Base16Theme,
): StylingConfig {
  return {
    extend: base16Theme,
    nestedNode: ({ style }, _keyPath, _nodeType, expanded) => ({
      style: {
        ...style,
        whiteSpace: expanded ? 'inherit' : 'nowrap',
      },
    }),
    nestedNodeItemString: ({ style }, _keyPath, _nodeType, expanded) => ({
      style: {
        ...style,
        display: expanded ? 'none' : 'inline',
      },
    }),
  }
}
