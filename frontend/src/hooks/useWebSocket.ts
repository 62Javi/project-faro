'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type WebSocketRole = 'kitchen' | 'waiter';

export function useWebSocket(role: WebSocketRole, restaurantId: string = 'rest_faro_demo') {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    const wsHost = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
    const wsUrl = `${wsHost}/ws/${role}/${restaurantId}`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        console.log(`WebSocket connected to ${role} channel`);
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setLastMessage(parsed);
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Reconnect after 3 seconds
        setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (err) => {
        console.warn('WebSocket error, falling back / reconnecting:', err);
        ws.close();
      };

      wsRef.current = ws;
    } catch (e) {
      console.warn('WebSocket connection attempt failed:', e);
    }
  }, [role, restaurantId]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = (msg: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg);
    }
  };

  return { isConnected, lastMessage, sendMessage };
}
