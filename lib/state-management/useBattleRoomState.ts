'use client';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import { BattleRoom} from '../types';



type Actions = {
    updateRoomState:(roomState:BattleRoom)=>void,
    clearRoomState:()=>void,
}

export const MAX_BATTLE_DURATION_TIME= 1_800_000; // 30 minutes 

export const MAX_TURN_DURATION = 30_000; // 30 seconds

export const useBattleRoomState = create<BattleRoom & Actions>()(
     persist((set)=>({
    host:null,
    creationTime:0,
    'moveHistory':[],
    isBattleStarted:false,
    isBattleFinished:false,
    startTime:null,
    finishTime:null,
    participantsAllowed:[],
    currentTurn:null,
    turnChangedAt:null,
    turnNumber:0,
    hostPlayer:null,
    roomId:null,
    inviteePlayer:null,
    pokemonBattlersSelected:[],
    updateRoomState(roomState) {
        set(()=> ({...roomState}))
    },
    clearRoomState() {
        set(() => ({
            host:null,
            creationTime:0,
            'moveHistory':[],
            isBattleStarted:false,
            isBattleFinished:false,
            startTime:null,
            finishTime:null,
            participantsAllowed:[],
            currentTurn:null,
            turnChangedAt:null,
            turnNumber:0,
            hostPlayer:null,
            roomId:null,
            inviteePlayer:null,
            pokemonBattlersSelected:[],
        }));
    }

}),{
    name:'pokemon-battle-state',
}
));