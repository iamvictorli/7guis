import { useEffect } from 'react'

function SnackEmbed({
  snackId,
}: {
  snackId: string
}) {
  useEffect(() => {
    // Check if script already exists to avoid duplicates
    if (!document.querySelector('script[src="https://snack.expo.dev/embed.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://snack.expo.dev/embed.js'
      script.async = true
      document.body.appendChild(script)

      // Cleanup function to remove script when component unmounts
      return () => {
        const scriptElement = document.querySelector('script[src="https://snack.expo.dev/embed.js"]')
        if (scriptElement) {
          document.body.removeChild(scriptElement)
        }
      }
    }
  }, [])

  return (
    <div
      data-snack-id={snackId}
      data-snack-platform="ios"
      data-snack-preview="true"
      data-snack-supportedplatforms="ios"
      className="overflow-hidden h-[505px] w-full rounded-[var(--radius-4)] [box-shadow:0_0_0_1px_var(--gray-a5)] bg-[var(--accent-2)]"
    />
  )
};

export default SnackEmbed
