package com.inventory.sync;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;


// This class is a WebSocket handler that manages WebSocket connections for stock updates. 
//It maintains a set of active WebSocket sessions and provides methods to handle connection establishment, connection closure, and broadcasting messages to all connected clients.

@Component
public class StockWebSocketHandler extends TextWebSocketHandler {

	private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();
	private final ObjectMapper objectMapper = new ObjectMapper();

	@Override
	public void afterConnectionEstablished(WebSocketSession session) {
		sessions.add(session);
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) {
		sessions.remove(session);
	}

	public void broadcast(Object payload) {
		try {
			String message = objectMapper.writeValueAsString(payload);
			TextMessage textMessage = new TextMessage(message);
			sessions.removeIf(session -> !session.isOpen());
			for (WebSocketSession session : sessions) {
				session.sendMessage(textMessage);
			}
		} catch (IOException ignored) {
		}
	}
}
