package com.inventory.dto;

import com.inventory.model.Role;
import com.inventory.model.UserStatus;
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
		Role role,
		UserStatus status
	) {
	}

	public record AuthResponse(
		String token,
		UserResponse user
	) {
	}

	public record PasswordResetRequest(
		@Email @NotBlank String email
	) {
	}

	public record PasswordResetConfirm(
		@NotBlank String token,
		@NotBlank String newPassword
	) {
	}

	public record ChangePasswordRequest(
		@NotBlank String currentPassword,
		@NotBlank String newPassword
	) {
	}

	public record PasswordResetResponse(
		String message
	) {
	}
}
