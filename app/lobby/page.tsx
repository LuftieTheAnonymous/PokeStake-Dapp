import LobbyPanel from "@/components/gameplay/lobby/LobbyPanel";




export default function Lobby() {
 
  return (
    <div className=" min-h-screen text-foreground">

      {/* Floating blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 animate-blob" />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-accent/5 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-pokemon-yellow/5 animate-blob animation-delay-4000" />
      </div>

      <LobbyPanel/>
    
    </div>
  );
}
