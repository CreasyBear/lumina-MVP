import React from 'react'
import { Button, ButtonProps } from "@/app/_components/ui/button"
import { Loader2 } from 'lucide-react'

export interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({ isLoading, children, ...props }) => (
  <Button {...props} disabled={isLoading || props.disabled}>
    {isLoading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </>
    ) : (
      children
    )}
  </Button>
)