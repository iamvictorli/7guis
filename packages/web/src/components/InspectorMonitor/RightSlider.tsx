import React from 'react'

interface Props {
  shown?: boolean
  children: React.ReactNode
  rotate?: boolean
}

function RightSlider({ shown, children, rotate }: Props) {
  return (
    <div
      style={{
        WebkitFontSmoothing: 'subpixel-antialiased', // http://stackoverflow.com/a/21136111/4218591
        position: 'absolute',
        right: 0,
        transform: 'translateX(150%)',
        transition: 'transform 0.2s ease-in-out',
        ...(shown && {
          position: 'static',
          transform: 'translateX(0)',
        }),
        ...(rotate && {
          transform: 'rotateX(90deg)',
          transition: 'transform 0.2s ease-in-out 0.08s',
          ...(shown && {
            transform: 'rotateX(0)',
            transition: 'transform 0.2s ease-in-out 0.18s',
          }),
        }),
      }}>
      {children}
    </div>
  )
}

export default RightSlider
