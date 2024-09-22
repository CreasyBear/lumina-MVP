import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/app/_components/ui/alert"

interface ErrorAlertProps {
  error: string
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => (
  <Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)