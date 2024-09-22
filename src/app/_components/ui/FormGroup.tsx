import React from 'react'
import { Label } from "@/app/_components/ui/label"

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
  htmlFor?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({ label, children, htmlFor }) => (
  <div className="space-y-2">
    <Label htmlFor={htmlFor}>{label}</Label>
    {children}
  </div>
)