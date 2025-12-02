"use client";

import { Card } from "@/shared/components/ui/card";
import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Title, Gender } from "@/shared/types";
import Image from "next/image";

interface PersonalInformationProps {
  title: Title | null;
  name: string;
  familyName: string;
  preferredName: string | null;
  gender: Gender;
  photo: string | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function PersonalInformation({
  title,
  name,
  familyName,
  preferredName,
  gender,
  photo,
  onEdit,
  onDelete,
}: PersonalInformationProps) {
  const getTitleDisplay = (title: Title | null) => {
    if (!title) return "N/A";
    const titles: Record<Title, string> = {
      mr: "Mr.",
      mrs: "Mrs.",
      ms: "Ms.",
      dr: "Dr.",
      prof: "Prof.",
      sr: "Sr.",
    };
    return titles[title] || title;
  };

  const getGenderDisplay = (gender: Gender) => {
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  return (
    <Card className="p-6">
      {/* Header with Employee Name and Action Buttons */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4 sm:mb-0">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
              <span className="text-xs">👤</span>
            </div>
            <h2 className="text-lg font-semibold">
              {name} {familyName}
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
        <div className="flex sm:hidden items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Photo:</p>
            <Avatar className="h-16 w-16 mt-2 bg-primary/10 flex items-center justify-center overflow-hidden">
              {photo ? (
                <Image
                  src={photo}
                  alt={`${name} ${familyName}`}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-medium">
                  {name[0]}
                  {familyName[0]}
                </span>
              )}
            </Avatar>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Title:</p>
            <p className="text-sm">{getTitleDisplay(title)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Full Name:
            </p>
            <p className="text-sm">
              {name} {familyName}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Preferred Name:
            </p>
            <p className="text-sm">{preferredName || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Gender:</p>
            <p className="text-sm">{getGenderDisplay(gender)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
