"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AddClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
  const [formData, setFormData] = useState({
    contactName: "",
    companyName: "",
    email: "",
    phone: "",
    industry: "",
    contractValue: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission (will integrate with backend later)
    console.log("Form submitted:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Contact Name"
            id="contactName"
            placeholder="Enter contact name"
            value={formData.contactName}
            onChange={(value) => 
              setFormData({ ...formData, contactName: value })
            }
          />
          <FormField
            label="Company Name"
            id="companyName"
            placeholder="Enter company name"
            value={formData.companyName}
            onChange={(value) => 
              setFormData({ ...formData, companyName: value })
            }
          />
          <FormField
            label="Email"
            id="email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(value) => 
              setFormData({ ...formData, email: value })
            }
          />
          <FormField
            label="Phone"
            id="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(value) => 
              setFormData({ ...formData, phone: value })
            }
          />
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => 
                setFormData({ ...formData, industry: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FormField
            label="Contract Value ($)"
            id="contractValue"
            type="number"
            placeholder="0"
            value={formData.contractValue}
            onChange={(value) => 
              setFormData({ ...formData, contractValue: value })
            }
          />
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Client
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function FormField({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string
  id: string
  type?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
