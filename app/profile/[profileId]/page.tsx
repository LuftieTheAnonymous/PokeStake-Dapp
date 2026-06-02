"use client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SOCIAL_MEDIA_OPTIONS, SocialMediaType } from "@/lib/social-media";
import { useThemeInitializer } from "@/hooks/use-theme-colors";
import { MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Avatar from "boring-avatars"
import usePokeData from "@/hooks/usePokeData";
import { formatDistanceToNow } from "date-fns";

export default function OtherProfilePage() {
  useThemeInitializer();
  const params = useParams();
  const {walletAddress}=usePokeData();
  const playerId = params.profileId as string;

  const { data: profile } = useQuery({
    queryKey: ["userProfile", playerId],
    queryFn: async () => {
      if (!playerId) return null;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/trainers/${playerId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `${walletAddress}`,
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
    enabled: Boolean(playerId),
  });

  return (
    <div className="min-h-screen relative">
{
  profile &&
  <main className="relative">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center flex-1">
              {/* Avatar */}
              <Avatar
            variant="pixel"
            width={128}
            height={128} 
            className="w-32 h-32 rounded-full border-4 border-primary/50 object-cover" 
            name={profile.walletAddress} />

              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{profile.nickname}</h1>
                <p className="text-muted-foreground font-mono">{profile.walletAddress}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
                size="lg"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Message
              </Button>
              <Link href="/trades">
                <Button
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                  size="lg"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Trade
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Stats */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Battles Won</p>
                  <p className="text-3xl font-bold">34</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Pokemon Collected</p>
                  <p className="text-3xl font-bold">{profile.pokemons.length}</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Member Since</p>
                  <p className="text-2xl font-bold">{formatDistanceToNow(profile.joinedAt)}</p>
                </div>
              </div>
            </div>

             {/* Profile Content */}
            <div className="lg:col-span-2 space-y-8">
             
        

    

   
            </div>
         
          </div>
        </div>
      </main>
}
    
    </div>
  );
}
