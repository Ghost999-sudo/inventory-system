package com.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


// This is the main entry point for the Inventory Management Backend application.
//  It is annotated with @SpringBootApplication, which indicates that it is a Spring Boot application. 
// The main method uses SpringApplication.run to launch the application.
@SpringBootApplication
public class InventoryManagementBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(InventoryManagementBackendApplication.class, args);
	}
}
