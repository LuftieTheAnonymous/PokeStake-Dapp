"use client";

import { useMemo, useState } from "react";
import { Navigation } from "@/components/navigation";
import { GradientBackground } from "@/components/gradient-background";
import { Button } from "@/components/ui/button";
import { useThemeInitializer } from "@/hooks/use-theme-colors";
import { Search, MessageCircle, UserPlus, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import Avatar from "boring-avatars";
import usePokeData from "@/hooks/usePokeData";
import { formatDistanceToNow } from "date-fns";

export default function TrainersPage() {
  useThemeInitializer();
  const {login} = useLogin();
  const {user} = usePrivy();
  const {walletAddress} = usePokeData();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'level' | 'cards'>('level');

  const {data:trainers} = useQuery({
    queryKey:['trainers'],
    queryFn: async ()=>{
  try{
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/trainers/get-all`);
  const {data, error}= await response.json();
  if(error){
    throw new Error(error);
  }
  return data;
  }catch(e){
    console.error("Error fetching trainers:", e);
  }
    },
    enabled: !!walletAddress
  });

  const filteredTrainers = useMemo(()=>{
    return (trainers ? trainers : []).filter((trainer:any) =>
      trainer.nickname.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a:any, b:any) => {
      if (sortBy === 'level') return b.level - a.level;
      return b.pokemons.length - a.pokemons.length;
    });
  },[trainers, searchQuery, sortBy]);

  if (!user) {
    return (
      <div className="min-h-screen relative">
        <main className="relative">
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">Find Trainers</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Connect your wallet to discover and connect with other trainers
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
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="space-y-2 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold">Find Trainers</h1>
            <p className="text-muted-foreground text-lg">
              Discover and connect with other players in the community
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search trainers by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Sort */}
              <div className="flex gap-2">
                {(['level', 'battles', 'cards'] as const).map((option) => (
                  <Button
                    key={option}
                    variant={sortBy === option ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy(option)}
                    className={sortBy === option ? 'bg-primary text-white' : ''}
                  >
                    {option === 'level' && 'By Level'}
                    {option === 'battles' && 'By Battles'}
                    {option === 'cards' && 'By Cards'}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Trainers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrainers.map((trainer:any) => (
              <div
                key={trainer.id}
                className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 transition-colors"
              >
                {/* Avatar & Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                  <Avatar
                  variant="beam"
                  size={48}
                  name={trainer.nickname}
                  />
                    <div
                      className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background ${
                        trainer.status === 'online'
                          ? 'bg-green-500 shadow-lg shadow-green-500/50'
                          : 'bg-gray-500'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{trainer.nickname}</h3>
                    <p className="text-sm text-muted-foreground">Level {trainer.level}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {trainer.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6 py-4 border-y border-border/30">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="h-4 w-4 text-orange-500" />
                      <p className="text-xs text-muted-foreground">Battles</p>
                    </div>
                    <p className="text-lg font-bold">{trainer.battleRecords.length}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <p className="text-xs text-muted-foreground">Cards</p>
                    </div>
                    <p className="text-lg font-bold">{trainer.pokemons.length}</p>
                  </div>
                </div>

                {/* Last Seen */}
                <p className="text-xs text-muted-foreground mb-4">
                Joined {formatDistanceToNow(new Date(trainer.joinedAt), { addSuffix: true })}
                </p>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/profile/${trainer.walletAddress}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Profile
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredTrainers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No trainers found matching your search
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
