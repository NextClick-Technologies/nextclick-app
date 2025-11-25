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
import { useCreateProject, useClients } from "@/hooks/useApi"
import { Loader2 } from "lucide-react"

interface AddProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddProjectDialog({ open, onOpenChange }: AddProjectDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    startDate: "",
    finishDate: "",
    budget: "",
    paymentTerms: "NET_30D",
    status: "ACTIVE",
    priority: "MEDIUM",
    description: "",
    clientId: "",
  })

  const createProject = useCreateProject()
  const { data: clientsData } = useClients({ pageSize: 100 })
  const clients = clientsData?.data || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createProject.mutateAsync({
        name: formData.name,
        type: formData.type || undefined,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        finishDate: formData.finishDate ? new Date(formData.finishDate).toISOString() : undefined,
        budget: formData.budget || undefined,
        paymentTerms: formData.paymentTerms as "NET_30D" | "NET_60D" | "UPFRONT",
        status: formData.status as "ACTIVE" | "COMPLETED" | "ON_HOLD",
        priority: formData.priority as "HIGH" | "MEDIUM" | "LOW" | undefined,
        description: formData.description || undefined,
        clientId: formData.clientId,
      })
      
      setFormData({
        name: "",
        type: "",
        startDate: "",
        finishDate: "",
        budget: "",
        paymentTerms: "NET_30D",
        status: "ACTIVE",
        priority: "MEDIUM",
        description: "",
        clientId: "",
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create project:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Project Name"
            id="name"
            placeholder="Enter project name"
            value={formData.name}
            onChange={(value) => 
              setFormData({ ...formData, name: value })
            }
            required
          />
          
          <div className="space-y-2">
            <Label htmlFor="clientId">Client</Label>
            <Select
              value={formData.clientId}
              onValueChange={(value) => 
                setFormData({ ...formData, clientId: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} {client.familyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <FormField
            label="Type (Optional)"
            id="type"
            placeholder="e.g., web-development, mobile-app"
            value={formData.type}
            onChange={(value) => 
              setFormData({ ...formData, type: value })
            }
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Start Date (Optional)"
              id="startDate"
              type="date"
              placeholder=""
              value={formData.startDate}
              onChange={(value) => 
                setFormData({ ...formData, startDate: value })
              }
            />
            
            <FormField
              label="Finish Date (Optional)"
              id="finishDate"
              type="date"
              placeholder=""
              value={formData.finishDate}
              onChange={(value) => 
                setFormData({ ...formData, finishDate: value })
              }
            />
          </div>
          
          <FormField
            label="Budget (Optional)"
            id="budget"
            type="number"
            placeholder="0"
            value={formData.budget}
            onChange={(value) => 
              setFormData({ ...formData, budget: value })
            }
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select
                value={formData.paymentTerms}
                onValueChange={(value) => 
                  setFormData({ ...formData, paymentTerms: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NET_30D">Net 30 Days</SelectItem>
                  <SelectItem value="NET_60D">Net 60 Days</SelectItem>
                  <SelectItem value="UPFRONT">Upfront</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => 
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <textarea
              id="description"
              className="flex min-h-20 w-full rounded-md border border-input bg-white dark:bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter project description"
              value={formData.description}
              onChange={(e) => 
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={createProject.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={createProject.isPending}>
              {createProject.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Project
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
