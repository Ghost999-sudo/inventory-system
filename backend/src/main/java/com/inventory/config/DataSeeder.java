package com.inventory.config;

import com.inventory.model.AppUser;
import com.inventory.model.Customer;
import com.inventory.model.Product;
import com.inventory.model.Role;
import com.inventory.model.Supplier;
import com.inventory.repository.CustomerRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.UserRepository;
import com.inventory.repository.SupplierRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
 
 // This class is responsible for seeding initial data into the database when the application starts. 
 // It implements the CommandLineRunner interface, which allows it to run specific code after the Spring Boot application has started. The class checks if certain tables (users, products, customers, suppliers) are empty and populates them with default data if they are.
@Component
public class DataSeeder implements CommandLineRunner {

	private final UserRepository userRepository;
	private final ProductRepository productRepository;
	private final CustomerRepository customerRepository;
	private final SupplierRepository supplierRepository;
	private final PasswordEncoder passwordEncoder;

	public DataSeeder(UserRepository userRepository, ProductRepository productRepository, CustomerRepository customerRepository, SupplierRepository supplierRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.productRepository = productRepository;
		this.customerRepository = customerRepository;
		this.supplierRepository = supplierRepository;
		this.passwordEncoder = passwordEncoder;
	}

// The run method is overridden from the CommandLineRunner interface. 
// It contains the logic to seed the database with initial data.
//  It checks if each repository (user, product, customer, supplier) is empty and, if so, creates and saves default entities for each type.
	@Override
	public void run(String... args) {
		if (userRepository.count() == 0) {
			AppUser admin = new AppUser();
			admin.setFullName("System Admin");
			admin.setEmail("admin@store.com");
			admin.setPassword(passwordEncoder.encode("admin123"));
			admin.setRole(Role.ADMIN);
			admin.setActive(true);
			userRepository.save(admin);
		}

		if (productRepository.count() == 0) {
			Product product = new Product();
			product.setName("Milk 500ml");
			product.setCategory("Dairy");
			product.setBarcode("123456");
			product.setBuyingPrice(new BigDecimal("55"));
			product.setSellingPrice(new BigDecimal("70"));
			product.setQuantity(50);
			product.setSupplierName("Fresh Farms");
			product.setReorderLevel(20);
			productRepository.save(product);
		}

		if (customerRepository.count() == 0) {
			Customer customer = new Customer();
			customer.setName("John Doe");
			customer.setPhone("+254700000100");
			customer.setEmail("john@example.com");
			customerRepository.save(customer);
		}

		if (supplierRepository.count() == 0) {
			Supplier supplier = new Supplier();
			supplier.setName("Fresh Farms");
			supplier.setPhone("+254700000001");
			supplier.setEmail("orders@freshfarms.co.ke");
			supplier.setAddress("Nairobi");
			supplier.setDeliveryStatus("Active");
			supplierRepository.save(supplier);
		}
	}
}
