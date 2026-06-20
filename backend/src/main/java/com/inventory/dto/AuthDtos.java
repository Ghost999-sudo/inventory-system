package com.inventory.dto;

import com.inventory.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AuthDtos {

	public record RegisterRequest(
		@NotBlank String fullName,
		@Email @NotBlank String email,
		@NotBlank String password,
		@NotNull Role role
	) {
	}

	public record LoginRequest(
		@Email @NotBlank String email,
		@NotBlank String password
	) {
	}

	public record UserResponse(
		Long id,
		String fullName,
		String email,
		Role role
	) {
	}

	public record AuthResponse(
		String token,
		UserResponse user
	) {
	}
}
