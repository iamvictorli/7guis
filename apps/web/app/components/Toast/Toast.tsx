// from shadcn ui, https://ui.shadcn.com/docs/components/toast
import { Cross2Icon } from '@radix-ui/react-icons'
import * as ToastPrimitives from '@radix-ui/react-toast'
import * as React from 'react'

import { cn } from '~/lib/utils'

const ToastProvider = ToastPrimitives.Provider

interface ToastViewportProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> {
  className?: string
}

function ToastViewport({ ref, className, ...props }: ToastViewportProps & { ref?: React.RefObject<React.ComponentRef<typeof ToastPrimitives.Viewport> | null> }) {
  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse space-y-1 space-y-reverse p-4 focus:outline-[var(--focus-8)] sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col sm:space-y-1 md:max-w-[420px]',
        className,
      )}
      {...props}
    />
  )
}
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> {
  className?: string
}

function Toast({ ref, className, ...props }: ToastProps & { ref?: React.RefObject<React.ComponentRef<typeof ToastPrimitives.Root> | null> }) {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-[var(--radius-3)] border border-[#e5e7eb] bg-[var(--color-background)] p-6 pr-8 text-[var(--gray-12)] shadow-lg transition-all focus:outline-2 focus:-outline-offset-1 focus:outline-[var(--focus-8)] focus:transition-none data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
        className,
      )}
      {...props}
    />
  )
}
Toast.displayName = ToastPrimitives.Root.displayName

interface ToastActionProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> {
  className?: string
}

function ToastAction({ ref, className, ...props }: ToastActionProps & { ref?: React.RefObject<React.ComponentRef<typeof ToastPrimitives.Action> | null> }) {
  return (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-[var(--radius-3)] border bg-transparent px-3 text-sm font-medium ring-offset-[var(--color-background)] transition-colors hover:bg-[var(--gray-a4)] focus:outline-hidden focus:ring-2 focus:ring-[var(--focus-8)] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
ToastAction.displayName = ToastPrimitives.Action.displayName

interface ToastCloseProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close> {
  className?: string
}
function ToastClose({ ref, className, ...props }: ToastCloseProps & { ref?: React.RefObject<React.ComponentRef<typeof ToastPrimitives.Close> | null> }) {
  return (
    <ToastPrimitives.Close
      ref={ref}
      className={cn(
        'absolute right-2 top-2 rounded-[var(--radius-3)] p-1 text-[var(--gray-12)] opacity-0 transition-opacity hover:text-[var(--gray-12)] focus:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-[var(--focus-8)] group-hover:opacity-100',
        className,
      )}
      toast-close=""
      {...props}
    >
      <Cross2Icon className="size-4" />
    </ToastPrimitives.Close>
  )
}
ToastClose.displayName = ToastPrimitives.Close.displayName

interface ToastTitleProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> {
  className?: string
}

function ToastTitle({ ref, className, ...props }: ToastTitleProps & { ref?: React.RefObject<React.ComponentRef<typeof ToastPrimitives.Title> | null> }) {
  return (
    <ToastPrimitives.Title
      ref={ref}
      className={cn('text-sm font-semibold', className)}
      {...props}
    />
  )
}
ToastTitle.displayName = ToastPrimitives.Title.displayName

interface ToastDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description> {
  className?: string
}
function ToastDescription({ ref, className, ...props }: ToastDescriptionProps & { ref?: React.RefObject<React.ComponentRef<typeof ToastPrimitives.Description> | null> }) {
  return (
    <ToastPrimitives.Description
      ref={ref}
      className={cn('text-sm opacity-90', className)}
      {...props}
    />
  )
}
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  Toast,
  type ToastActionElement,
  ToastClose,
  ToastDescription,
  type ToastProps,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  // ToastAction,
}
