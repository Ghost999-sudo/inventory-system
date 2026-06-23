package com.inventory.controller; // This class is a REST controller that handles authentication-related endpoints for the inventory management system. It provides endpoints for user registration and login, and it uses the AuthService to perform the actual authentication logic.

import com.inventory.dto.AuthDtos;
import com.inventory.model.Role;
import com.inventory.model.UserStatus;
import com.inventory.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/register")
	public ResponseEntity<AuthDtos.UserResponse> register(@Valid @RequestBody AuthDtos.RegisterRequest request) {
		return ResponseEntity.ok(authService.register(request));
	}

	@PostMapping("/login")
	public ResponseEntity<AuthDtos.AuthResponse> login(@Valid @RequestBody AuthDtos.LoginRequest request) {
		return ResponseEntity.ok(authService.login(request));
	}

	@GetMapping("/users")
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
	public ResponseEntity<List<AuthDtos.UserResponse>> users(@RequestParam(required = false) UserStatus status) {
		return ResponseEntity.ok(authService.getUsers(status));
	}

	@PatchMapping("/users/{id}/approve")
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
	public ResponseEntity<AuthDtos.UserResponse> approve(@PathVariable Long id, @RequestParam(required = false) Role role) {
		return ResponseEntity.ok(authService.approveUser(id, role));
	}

	@PatchMapping("/users/{id}/reject")
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
	public ResponseEntity<AuthDtos.UserResponse> reject(@PathVariable Long id) {
		return ResponseEntity.ok(authService.rejectUser(id));
	}

	@PatchMapping("/users/{id}/disable")
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
	public ResponseEntity<AuthDtos.UserResponse> disable(@PathVariable Long id) {
		return ResponseEntity.ok(authService.disableUser(id));
	}

	@PostMapping("/password-reset/request")
	public ResponseEntity<AuthDtos.PasswordResetResponse> requestPasswordReset(@Valid @RequestBody AuthDtos.PasswordResetRequest request) {
		return ResponseEntity.ok(authService.requestPasswordReset(request));
	}

	@PostMapping("/password-reset/confirm")
	public ResponseEntity<AuthDtos.PasswordResetResponse> resetPassword(@Valid @RequestBody AuthDtos.PasswordResetConfirm request) {
		return ResponseEntity.ok(authService.resetPassword(request));
	}

	@PostMapping("/change-password")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<AuthDtos.PasswordResetResponse> changePassword(@Valid @RequestBody AuthDtos.ChangePasswordRequest request) {
		return ResponseEntity.ok(authService.changePassword(request));
	}
}
