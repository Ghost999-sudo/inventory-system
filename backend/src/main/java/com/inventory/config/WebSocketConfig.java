package com.inventory.config;

import com.inventory.sync.StockWebSocketHandler; // Import the StockWebSocketHandler class, which handles WebSocket connections for stock updates.
import org.springframework.context.annotation.Configuration; // Import the Configuration annotation, which indicates that this class contains Spring configuration.
import org.springframework.web.socket.config.annotation.EnableWebSocket; // Import the EnableWebSocket annotation, which enables WebSocket support in the Spring application.
import org.springframework.web.socket.config.annotation.WebSocketConfigurer; // Import the WebSocketConfigurer interface, which allows customization of WebSocket configuration.
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;// Import the WebSocketHandlerRegistry class, which is used to register WebSocket handlers.


// This class is a Spring configuration class that sets up WebSocket support for the application.
//  It implements the WebSocketConfigurer interface to register a WebSocket handler for handling stock updates.
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

	private final StockWebSocketHandler stockWebSocketHandler;

	public WebSocketConfig(StockWebSocketHandler stockWebSocketHandler) {
		this.stockWebSocketHandler = stockWebSocketHandler;
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(stockWebSocketHandler, "/ws")
			.setAllowedOrigins("*");
	}
}
