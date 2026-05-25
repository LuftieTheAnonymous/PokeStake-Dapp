"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ALL_SOCIAL_MEDIA, SOCIAL_MEDIA_OPTIONS } from "@/lib/social-media";
import type { SocialMediaType } from "@/lib/social-media";
import { X, Plus } from "lucide-react";

interface SocialLink {
  type: SocialMediaType;
  handle: string;
}

interface ProfileFormData {
  username: string;
  description: string;
  socialLinks: SocialLink[];
}

interface ProfileFormProps {
  data: ProfileFormData;
  onSave: (data: ProfileFormData) => void;
  isEditing?: boolean;
}

export function ProfileForm({ data, onSave, isEditing = false }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>(data);
  const availableSocials = ALL_SOCIAL_MEDIA.filter(
    (type) => !data.socialLinks.some((link) => link.type === type)
  );
  const [newSocialType, setNewSocialType] = useState<SocialMediaType>(availableSocials[0] || 'twitter');

  const handleAddSocial = () => {
    const isDuplicate = formData.socialLinks.some((link) => link.type === newSocialType);
    if (!isDuplicate && availableSocials.includes(newSocialType)) {
      setFormData({
        ...formData,
        socialLinks: [...formData.socialLinks, { type: newSocialType, handle: '' }],
      });
      const updatedAvailable = availableSocials.filter((type) => type !== newSocialType);
      if (updatedAvailable.length > 0) {
        setNewSocialType(updatedAvailable[0]);
      }
    }
  };

  const handleRemoveSocial = (type: SocialMediaType) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.filter((link) => link.type !== type),
    });
  };

  const handleUpdateSocial = (type: SocialMediaType, handle: string) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.map((link) =>
        link.type === type ? { ...link, handle } : link
      ),
    });
  };

  if (!isEditing) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Username */}
      <div>
        <label className="block text-sm font-semibold mb-2">Username</label>
        <Input
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          placeholder="Your username"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold mb-2">Bio</label>
        <textarea
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Tell us about yourself..."
          rows={4}
        />
      </div>

      {/* Social Links */}
      <div>
        <label className="block text-sm font-semibold mb-4">Social Links</label>
        <div className="space-y-3 mb-4">
          {formData.socialLinks.map((link) => {
            const config = SOCIAL_MEDIA_OPTIONS[link.type];
            if (!config) return null;
            const Icon = config.icon;
            return (
              <div key={link.type} className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <Input
                    value={link.handle}
                    onChange={(e) => handleUpdateSocial(link.type, e.target.value)}
                    placeholder={config.placeholder}
                    className="flex-1"
                  />
                </div>
                <Button
                  onClick={() => handleRemoveSocial(link.type)}
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {availableSocials.length > 0 && (
          <div className="flex gap-2">
            <select
              value={newSocialType}
              onChange={(e) => setNewSocialType(e.target.value as SocialMediaType)}
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              {availableSocials.map((type) => {
                const config = SOCIAL_MEDIA_OPTIONS[type];
                return (
                  <option key={type} value={type}>
                    {config?.label || type}
                  </option>
                );
              })}
            </select>
            <Button 
              onClick={handleAddSocial} 
              variant="outline" 
              size="icon"
              type="button"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Button
        onClick={() => onSave(formData)}
        className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
        size="lg"
        type="button"
      >
        Save Changes
      </Button>
    </div>
  );
}
