package com.inventory.service;

import com.inventory.model.Product;
import com.inventory.sync.StockWebSocketHandler;
import org.springframework.stereotype.Service;
import java.util.Map;

// This class is a Spring service that handles stock notification operations, such as broadcasting stock updates and sale creation events to connected WebSocket clients.
@Service
public class StockNotificationService {

	private final StockWebSocketHandler stockWebSocketHandler;

	public StockNotificationService(StockWebSocketHandler stockWebSocketHandler) {
		this.stockWebSocketHandler = stockWebSocketHandler;
	}

	public void broadcastStockUpdate(Product product) {
		stockWebSocketHandler.broadcast(Map.of(
			"type", "stock-update",
			"productId", product.getId(),
			"name", product.getName(),
			"quantity", product.getQuantity(),
			"status", product.getStatus()
		));
	}

	public void broadcastSaleCreated(Object salePayload) {
		stockWebSocketHandler.broadcast(Map.of(
			"type", "sale-created",
			"payload", salePayload
		));
	}
}
