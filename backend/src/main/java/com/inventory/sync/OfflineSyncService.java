package com.inventory.sync;

import com.inventory.dto.CustomerDtos;
import com.inventory.dto.ProductDtos;
import com.inventory.dto.SaleDtos;
import com.inventory.dto.SyncDtos;
import com.inventory.service.CustomerService;
import com.inventory.service.ProductService;
import com.inventory.service.SaleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// This service class handles the synchronization of offline data for products, customers, and sales.
// It provides a method to process a batch of synchronization requests and save the corresponding entities in the database. 
// The sync method is annotated with @Transactional to ensure that all operations are executed within a single transaction.
@Service
public class OfflineSyncService {

	private final ProductService productService;
	private final CustomerService customerService;
	private final SaleService saleService;

	public OfflineSyncService(ProductService productService, CustomerService customerService, SaleService saleService) {
		this.productService = productService;
		this.customerService = customerService;
		this.saleService = saleService;
	}

// The sync method takes a SyncBatchRequest object containing lists of products, customers, and sales to be synchronized. It iterates through each list, upserting products and customers and creating sales as needed. The method keeps track of the number of entities saved and returns a SyncBatchResponse with the counts of saved products, customers, and sales.
	@Transactional
	public SyncDtos.SyncBatchResponse sync(SyncDtos.SyncBatchRequest request) {
		int productsSaved = 0;
		int customersSaved = 0;
		int salesSaved = 0;

		if (request.products() != null) {
			for (ProductDtos.ProductRequest productRequest : request.products()) {
				productService.upsertProduct(productRequest);
				productsSaved++;
			}
		}

		if (request.customers() != null) {
			for (CustomerDtos.CustomerRequest customerRequest : request.customers()) {
				customerService.upsert(customerRequest);
				customersSaved++;
			}
		}

		if (request.sales() != null) {
			for (SaleDtos.SaleRequest saleRequest : request.sales()) {
				saleService.createSale(saleRequest);
				salesSaved++;
			}
		}

		return new SyncDtos.SyncBatchResponse(productsSaved, customersSaved, salesSaved);
	}
}
