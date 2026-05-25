"use client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SOCIAL_MEDIA_OPTIONS } from "@/lib/social-media";
import { useThemeInitializer } from "@/hooks/use-theme-colors";
import { MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Avatar from "boring-avatars"

export default function OtherProfilePage() {
  useThemeInitializer();
  const params = useParams();
  const playerId = params.profileId as string;

  const  { data:profile, error, isLoading, } = useQuery({
    queryKey: ['profile', playerId],
    queryFn: async () => {
  try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/trainers/${playerId}`);
    
      if (!response.ok) {
      throw new Error('Failed to fetch profile data');
    }
    
    const jsonData = await response.json();

    return jsonData;
}
catch (error) {
    console.error('Error fetching profile data:', error);
    return null;
}
}
  });



  return (
    <div className="min-h-screen relative">

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
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{profile.username}</h1>
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
                  <p className="text-3xl font-bold">{profile.stats.battles}</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Pokemon Collected</p>
                  <p className="text-3xl font-bold">{profile.stats.pokemon}</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Member Since</p>
                  <p className="text-2xl font-bold">{profile.stats.memberDays} days</p>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio Section */}
              <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <h2 className="text-xl font-bold mb-4">About</h2>
                <p className="text-muted-foreground">{profile.description}</p>

                {/* Social Links */}
                {profile.socialLinks && profile.socialLinks.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border/30">
                    <h3 className="font-semibold mb-4">Social Links</h3>
                    <div className="space-y-2">
                      {profile.socialLinks.map((link, idx) => {
                        const config = SOCIAL_MEDIA_OPTIONS[link.type];
                        if (!config) return null;
                        const Icon = config.icon;
                        return (
                          <div key={idx} className="flex items-center gap-3">
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

              {/* Trade History */}
              <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="text-sm font-semibold">Completed Trade</p>
                      <p className="text-xs text-muted-foreground">Traded 5 Pokemon</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="text-sm font-semibold">Won Battle</p>
                      <p className="text-xs text-muted-foreground">Against PokeFan123</p>
                    </div>
                    <span className="text-xs text-muted-foreground">5 days ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="text-sm font-semibold">Joined Collection</p>
                      <p className="text-xs text-muted-foreground">Member of Elite Four</p>
                    </div>
                    <span className="text-xs text-muted-foreground">1 week ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
