import '@testing-library/jest-dom/vitest'

import ResizeObserver from 'resize-observer-polyfill'

// @ts-expect-error https://stackoverflow.com/a/67006794
global.ResizeObserver = ResizeObserver
