package com.inventory.controller;

import com.inventory.dto.SyncDtos;
import com.inventory.sync.OfflineSyncService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// This class is a Spring REST controller that handles HTTP requests related to offline synchronization, providing an endpoint for syncing batches of data.
@RestController
@RequestMapping("/api/sync")
public class SyncController {

	private final OfflineSyncService offlineSyncService;

	public SyncController(OfflineSyncService offlineSyncService) {
		this.offlineSyncService = offlineSyncService;
	}

	@PostMapping("/batch")
	public ResponseEntity<SyncDtos.SyncBatchResponse> syncBatch(@Valid @RequestBody SyncDtos.SyncBatchRequest request) {
		return ResponseEntity.ok(offlineSyncService.sync(request));
	}
}
