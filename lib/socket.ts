'use client'

import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001'

export function useSocket() {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!session?.user?.id) {
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/socket.ts:16',message:'No session user ID - skipping Socket.IO connection',data:{hasSession:!!session,hasUserId:!!session?.user?.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      return
    }

    // Получаем токен из сессии
    // Для Socket.IO используем user.id как токен
    // Socket.IO сервер будет проверять через Prisma
    const token = session.user.id

    // #region agent log
    fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/socket.ts:25',message:'Creating Socket.IO connection',data:{userId:session.user.id,serverUrl:SOCKET_SERVER_URL},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    // Создаем подключение к Socket.IO серверу
    const newSocket = io(SOCKET_SERVER_URL, {
      auth: {
        token: token,
      },
      transports: ['polling', 'websocket'], // Начинаем с polling для лучшей совместимости
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    })

    newSocket.on('connect', () => {
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/socket.ts:42',message:'Socket.IO connected',data:{socketId:newSocket.id,userId:session.user.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      // Socket.IO connected - using logger would require client-side logger
      setIsConnected(true)

      // Присоединяемся к комнате пользователя
      const userRoom = `user_${session.user.id}`
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/socket.ts:50',message:'Joining user room',data:{userRoom},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      newSocket.emit('join_room', { room_id: userRoom })
    })

    newSocket.on('disconnect', () => {
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/socket.ts:56',message:'Socket.IO disconnected',data:{socketId:newSocket.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      // Socket.IO disconnected - using logger would require client-side logger
      setIsConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/socket.ts:63',message:'Socket.IO connection error',data:{error:error.message,type:error.type},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      // Socket.IO connection error - using logger would require client-side logger
      // Error is already logged via agent log above
    })

    setSocket(newSocket)

    return () => {
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/socket.ts:71',message:'Cleaning up Socket.IO connection',data:{socketId:newSocket.id,reason:'useEffect cleanup or session changed'},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      newSocket.close()
      setSocket(null)
      setIsConnected(false)
    }
  }, [session])

  return { socket, isConnected }
}
