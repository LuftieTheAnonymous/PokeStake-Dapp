import { useCallback, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import usePokeData from "./usePokeData";



function useSocketIo(socketUrl="http://localhost:2137") {

  const {walletAddress}=usePokeData();
    const socketRef = useRef<Socket>(null);
    const isConnectedRef = useRef(false);

  useEffect(() => {
    // Only create socket once
    if (!socketRef.current) {
      socketRef.current = io(socketUrl, {
        auth:{
          walletAddress
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      });

      socketRef.current.on('connect', () => {
        isConnectedRef.current = true;
        console.log('Socket connected:', (socketRef.current as Socket).id);
      });
      
      socketRef.current.on('disconnect', () => {
        isConnectedRef.current = false;
      });
    }

    return () => {
      // Cleanup on unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [socketUrl, walletAddress]);
   

    const emit = useCallback((event:any, data:any) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Socket not connected');
    }
  }, [socketRef]);

  const once = useCallback((event:any, listener:any)=>{
    if(socketRef.current && socketRef.current.connected){
        socketRef.current.once(event,listener);
    }else{
        console.warn('Socket not connected');
    }
  },[socketRef]);
  

  const on = useCallback((event:any, handler:any) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  }, [socketRef]);

  const off = useCallback((event:any, handler:any) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  }, [socketRef]);

  const joinRoom = useCallback((roomId:string)=>{
     if (socketRef.current) {
        socketRef.current.emit("join-room", roomId);
     }
  },[socketRef]);

  const leaveRoom = useCallback((roomId:string)=>{
    if(socketRef.current) socketRef.current.emit("leave-room",roomId);
  },[socketRef]);

  const sendToRoom = useCallback((roomId:string, message:{msg:string})=>{
    if(socketRef.current){
       socketRef.current.emit('send-to-room', roomId, message); 
    }
  },[socketRef]);
  
  
    return {socket:socketRef.current, emit, joinRoom, leaveRoom, sendToRoom, on,once, off};
}

export default useSocketIo