'use client';

import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import { Socket } from 'socket.io-client';

type BattleState = {
    socket: Socket | null
    isConnected: boolean
}

type Actions = {
    connectSocket:(socket:Socket)=>void,
    disconnectSocket:()=>void,
}

export const useSocketConnection = create<BattleState & Actions>()(
     persist((set)=>({
    socket:null,
    isConnected: false,
    connectSocket(socket){
        set({socket, isConnected:true})
    },
    disconnectSocket(){
        set({socket:null, isConnected: false})
    }
}),{
    name:'socket-connection',
}
));