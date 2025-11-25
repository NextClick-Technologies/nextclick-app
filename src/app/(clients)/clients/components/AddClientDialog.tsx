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
import { useCreateClient } from "@/hooks/useApi"
import { Loader2 } from "lucide-react"

interface AddClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
  const [formData, setFormData] = useState({
    title: "MR",
    name: "",
    familyName: "",
    gender: "MALE",
    phoneNumber: "",
    email: "",
  })

  const createClient = useCreateClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createClient.mutateAsync({
        title: formData.title as "MR" | "MRS" | "MS" | "DR" | "PROF",
        name: formData.name,
        familyName: formData.familyName,
        gender: formData.gender as "MALE" | "FEMALE" | "OTHER",
        phoneNumber: formData.phoneNumber,
        email: formData.email || undefined,
      })
      
      // Reset form
      setFormData({
        title: "MR",
        name: "",
        familyName: "",
        gender: "MALE",
        phoneNumber: "",
        email: "",
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create client:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Select
              value={formData.title}
              onValueChange={(value) => 
                setFormData({ ...formData, title: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MR">Mr</SelectItem>
                <SelectItem value="MRS">Mrs</SelectItem>
                <SelectItem value="MS">Ms</SelectItem>
                <SelectItem value="DR">Dr</SelectItem>
                <SelectItem value="PROF">Prof</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <FormField
            label="First Name"
            id="name"
            placeholder="Enter first name"
            value={formData.name}
            onChange={(value) => 
              setFormData({ ...formData, name: value })
            }
            required
          />
          
          <FormField
            label="Family Name"
            id="familyName"
            placeholder="Enter family name"
            value={formData.familyName}
            onChange={(value) => 
              setFormData({ ...formData, familyName: value })
            }
            required
          />
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => 
                setFormData({ ...formData, gender: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <FormField
            label="Phone Number"
            id="phoneNumber"
            placeholder="+1234567890"
            value={formData.phoneNumber}
            onChange={(value) => 
              setFormData({ ...formData, phoneNumber: value })
            }
            required
          />
          
          <FormField
            label="Email (Optional)"
            id="email"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(value) => 
              setFormData({ ...formData, email: value })
            }
          />
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={createClient.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={createClient.isPending}>
              {createClient.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
  required = false,
}: {
  label: string
  id: string
  type?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  required?: boolean
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
        required={required}
      />
    </div>
  )
}
