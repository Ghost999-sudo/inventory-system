import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url) {
  const socketRef = useRef(null);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    if (!url) return undefined;

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onmessage = event => {
      setLastMessage(event.data);
    };

    return () => socket.close();
  }, [url]);

  return { socket: socketRef.current, lastMessage };
}
