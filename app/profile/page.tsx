"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { GradientBackground } from "@/components/gradient-background";
import { ProfileForm } from "@/components/profile-form";
import { ThemeSelector } from "@/components/theme-selector";
import { Button } from "@/components/ui/button";
import { SOCIAL_MEDIA_OPTIONS } from "@/lib/social-media";
import { useThemeColors, useThemeInitializer } from "@/hooks/use-theme-colors";
import type { SocialMediaType } from "@/lib/social-media";
import type { PokemonTheme } from "@/lib/themes";
import { Edit2, Save, Upload } from "lucide-react";
import Link from "next/link";
import Avatar from "boring-avatars";

interface UserProfile {
  username: string;
  description: string;
  socialLinks: Array<{ type: SocialMediaType; handle: string }>;
  theme: PokemonTheme;
}

export default function ProfilePage() {
  const selectedTheme = useThemeColors();
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = (data: UserProfile) => {
    setProfile({
      ...data,
      theme: profile.theme,
    });
    setIsEditing(false);
  };

  const handleThemeChange = (theme: PokemonTheme) => {
    setTheme(theme);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setAvatar(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!walletConnected) {
    return (
      <div className="min-h-screen relative">
        <GradientBackground />
        <Navigation />
        <main className="relative">
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">My Profile</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Connect your wallet to view and customize your profile
              </p>
              <Button
                onClick={connectWallet}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white mx-auto mt-4"
                size="lg"
              >
                Connect Wallet
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
    {profile &&   <main className="relative">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center flex-1">
              {/* Avatar */}
              <div className="relative group">
                <Avatar
                username={profile.username}
                variant="pixel"
                width={128}
                height={128} 
                className="w-32 h-32 rounded-full border-4 border-primary/50 object-cover"
                />


{isEditing && (
                  <label className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <Upload className="h-6 w-6 text-white" />
                  </label>
                )}
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{profile.username}</h1>
                <p className="text-muted-foreground font-mono">{walletAddress}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              size="lg"
            >
              {isEditing ? (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Done Editing
                </>
              ) : (
                <>
                  <Edit2 className="h-5 w-5 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Stats */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Battles Won</p>
                  <p className="text-3xl font-bold">47</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Pokemon Collected</p>
                  <p className="text-3xl font-bold">{ownedCards.length}</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Member Since</p>
                  <p className="text-2xl font-bold">245 days</p>
                </div>
                <Link href="/gallery" className="block">
                  <Button variant="outline" className="w-full">
                    View My Collection
                  </Button>
                </Link>
              </div>
            </div>

            {/* Profile Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio Section */}
              {!isEditing && (
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <h2 className="text-xl font-bold mb-4">About Me</h2>
                  <p className="text-muted-foreground">{profile.description}</p>

                  {/* Social Links */}
                  {profile.socialLinks && profile.socialLinks.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border/30">
                      <h3 className="font-semibold mb-4">Social Links</h3>
                      <div className="space-y-2">
                        {profile.socialLinks.map((link) => {
                          const config = SOCIAL_MEDIA_OPTIONS[link.type];
                          if (!config) return null;
                          const Icon = config.icon;
                          return (
                            <div key={link.type} className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                              <span className="text-sm">{config.label}</span>
                              <span className="text-sm font-mono text-muted-foreground ml-auto">
                                {link.handle}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Edit Mode */}
              {isEditing && (
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
                  <ProfileForm
                    data={profile}
                    onSave={handleSaveProfile}
                    isEditing={true}
                  />
                </div>
              )}

              {/* Theme Selector */}
              <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <ThemeSelector
                  selectedTheme={profile.theme}
                  onThemeChange={handleThemeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </main>}
    </div>
  );
}
