"use client";

import { useState } from "react";
import { ProfileForm } from "@/components/profile-form";
import { ThemeSelector } from "@/components/theme-selector";
import { Button } from "@/components/ui/button";
import { SOCIAL_MEDIA_OPTIONS } from "@/lib/social-media";
import type { SocialMediaType } from "@/lib/social-media";
import type { PokemonTheme } from "@/lib/themes";
import { Edit2, Save, Upload } from "lucide-react";
import Link from "next/link";
import Avatar from "boring-avatars";
import { useThemeStore } from "@/lib/state-management/useTheme";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { formatDistance } from "date-fns";
import { queryClient } from "@/lib/wagmi/WagmiWrapper";


export default function ProfilePage() {
  const { setTheme } = useThemeStore.getState();
  const [isEditing, setIsEditing] = useState(false);
  const { user } = usePrivy();
  const {login} = useLogin();
  const address = user?.wallet?.address as `0x${string}`;

  const { data: profile } = useQuery({
    queryKey: ["userProfile", address],
    queryFn: async () => {
      if (!address) return null;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/trainers/${address}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `${address}`,
          },
          body: JSON.stringify({
            include: {
              socialMedias: true,
              pokemons: true,
              pokemonCardListings: true,
            },
          }),
        });

        const {data} = await response.json();

        return data;
      } catch (error) {
        console.error("Error fetching user profile:", String(error));
        return null;
      }
    },
    enabled: Boolean(address),
  });

  const { mutate: saveProfile } = useMutation({
    mutationFn: async (data: any) => {
      console.log(data);

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/trainers/update/${address}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: address as string,
        },
        body: JSON.stringify({
          walletAddress:address,
          data:{
            nickname:data.nickname,
            email: data.email,
            description: data.description
          }
        }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Profile updated successfully:", data);
    },
    onError: (error) => {
      console.error("Error updating profile:", String(error));
    },
    onSettled: async () => {
      // Invalidate or refetch profile data if needed
      await queryClient.invalidateQueries({queryKey: ["userProfile", address]});
      await queryClient.refetchQueries({queryKey: ["trainers"]});
    }
  });

  const handleSaveProfile = (data: any) => {
    saveProfile(data);
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
        // to be added - upload the image to IPFS or your server and get the URL
        console.log("Avatar uploaded:", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };


  if (!address) {
    return (
      <div className="min-h-screen relative">
        <main className="relative">
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">My Profile</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Connect your wallet to view and customize your profile
              </p>
              <Button
                onClick={login}
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
                  name={profile.nickname as string}
                  variant="pixel"
                  size={128}
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
                <h1 className="text-2xl md:text-4xl font-bold mb-2">{profile.nickname}</h1>
                <p className="text-muted-foreground text-sm font-mono">{address}</p>
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
                  <p className="text-3xl font-bold">{profile.pokemons && profile.pokemons.length}</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Member Since</p>
                  <p className="text-2xl font-bold">{profile.joinedAt && formatDistance(new Date(profile.joinedAt), new Date())}</p>
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
                  <p className="text-muted-foreground">{profile.description ? profile.description : "No description available."}</p>

                  {/* Social Links */}
                  {profile.socialMedias && profile.socialMedias.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border/30">
                      <h3 className="font-semibold mb-4">Social Links</h3>
                      <div className="space-y-2">
                        {profile.socialMedias.map((link: { type: SocialMediaType, link: string, id:string, belongTo:string}) => {
                          const config = SOCIAL_MEDIA_OPTIONS[link.type];
                          if (!config) return null;
                          const Icon = config.icon;
                          return (
                            <div key={link.type} className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                              <span className="text-sm">{config.label}</span>
                              <Link href={link.link} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-muted-foreground ml-auto">
                                {link.type}
                              </Link>
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
