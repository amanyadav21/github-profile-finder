import * as React from "react"

export const useToast = () => {
  return {
    toast: (props: { title?: string; description?: string; variant?: string }) => {
      // Simple toast implementation - just log for now since we have a black background theme
      console.log('Toast:', props);
    },
    toasts: [] // Return empty array since we're not implementing full toast functionality
  }
}

export const toast = (props: { title?: string; description?: string; variant?: string }) => {
  console.log('Toast:', props);
}
