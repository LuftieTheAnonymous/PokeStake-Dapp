import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import usePokeData from '@/hooks/usePokeData';
import { Player, PokemonBattler, PokemonCard, RARITY_CONFIG } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';

  const formScheme= z.object({
    roomId: z.string({'message':'Inappropriate type provided'}).length(6, {message:'Inappropriate scheme for roomId provided'}),
    playerNickname: z.string({'message':'Inappropriate type provided'}).max(20, {'message':'Nickname cannot be longer than 20 characters.'}).optional(),
    invitee: z.string({'message':'Inappropriate type provided'}).startsWith("0x", {"message":'Inappropriate scheme of the EVM-address'}).length(42, {'message':'EVM address has to be at least 42 characters long.'}),
  }).required();


   type FormInput = z.infer<typeof formScheme>;

function RoomCreateDialog({isPokemonBattleReady, emit, pokemonBattlersSelected}:{isPokemonBattleReady:boolean, emit:(event:string, ...args:any[])=>void, pokemonBattlersSelected:PokemonCard[]}) {
  const { walletAddress } = usePokeData();
  const {register, setValue, watch, formState, setError, clearErrors, handleSubmit, reset}=useForm<FormInput>({
    resolver:zodResolver(formScheme),
    defaultValues:{
        invitee:undefined,
        playerNickname:undefined,
        roomId:undefined
    }
});
const generateRandomRoomId=()=>{
    setValue('roomId', `${Math.floor(Math.random() * 1e6)}`.padStart(6, '0'));
}

    const createBattleRoom = (roomId:string, invitee:`0x${string}`, playerNickname?:string)=>{
      const convertedSelectedPokemon:PokemonBattler[] = pokemonBattlersSelected.map((card)=> ({
        pokemonId: card.attributes.id,
        pokedexIndex: card.attributes.pokedexIndex,
        rarityLevel: RARITY_CONFIG[card.attributes.rarity].dailyReward,
        hp: card.attributes.hp,
        maxHp: card.attributes.hp,
        attack: card.attributes.attack,
        defense: card.attributes.defense,
        sprites:{front: card.attributes.sprites[0], back: card.attributes.sprites[1]},
        name: card.name,
        cries: card.attributes.cries
      })) as unknown as PokemonBattler[];

      let hostDetails:Player={
        currentPokemon:convertedSelectedPokemon[0],
        pokemonDeck: convertedSelectedPokemon,
        playerNickname
      }

        emit('create-battle-room', roomId, hostDetails, invitee);
    }



  return (
 <Dialog>
        <DialogTrigger asChild className='w-full mt-2'>
          <Button variant="outline">
              <Plus className="w-4 h-4" /> 
            Room Generation
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
<form onSubmit={handleSubmit((data)=>{
  clearErrors();
    if(data.invitee === walletAddress) setError('invitee', {message:'You cannot invite yourself to a battle room.'});
    console.log(data);
    createBattleRoom(data.roomId, data.invitee as `0x${string}`, data.playerNickname);
},(errors)=>{
    console.log(errors);
})}>
          <DialogHeader className='mb-5'>
            <DialogTitle>Room Generation</DialogTitle>
            <DialogDescription>
              Generate Room, share the entry code with your opponnent and fight for great prizes.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
           {watch('roomId') ? <>
            <p>Your code is: <span className='text-primary  font-bold'>{watch('roomId')}</span></p>
             {formState.errors.roomId && formState.errors.roomId.message && <small className='text-red-500'>{formState.errors.roomId.message}</small>}

             <div className="flex flex-col gap-2">
                <Label>Player Nickname (Optional)</Label>
                <Input {...register('playerNickname')} placeholder='Your nickname in the battle room' />
                {formState.errors.playerNickname && formState.errors.playerNickname.message && <small className='text-red-500'>{formState.errors.playerNickname.message}</small>}
             </div>

            <div className="flex flex-col gap-2">
                <Label>Invitee EVM-Address</Label>
                <Input {...register('invitee')} placeholder='E.g. 0xF8Da921d11d4F6D20F7C245615C65316c3cEF6b4' />
                {formState.errors.invitee && formState.errors.invitee.message && <small className='text-red-500'>{formState.errors.invitee.message}</small>}
            </div>

            <small>Share this code with your opponent and start the battle </small>
           </> : <>
           <Button onClick={generateRandomRoomId}>Generate Room Id</Button>
           </>}
          </div>

          <DialogFooter className='mt-5'>
            <DialogClose onClick={()=>reset()} asChild>
              <Button className='cursor-pointer' variant="outline">Cancel</Button>
            </DialogClose>
            <Button className='cursor-pointer' type='submit' disabled={!isPokemonBattleReady}>Join Room</Button>
          </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  )
}

export default RoomCreateDialog