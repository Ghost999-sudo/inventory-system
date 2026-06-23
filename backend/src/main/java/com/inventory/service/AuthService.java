package com.inventory.service;

import com.inventory.dto.AuthDtos;
import com.inventory.exception.BadRequestException;
import com.inventory.model.AppUser;
import com.inventory.model.PasswordResetToken;
import com.inventory.model.Role;
import com.inventory.model.UserStatus;
import com.inventory.repository.PasswordResetTokenRepository;
import com.inventory.repository.UserRepository;
import com.inventory.security.JwtService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
 
 // This class is a Spring service that handles authentication-related operations, such as user registration and login.
@Service
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordResetTokenRepository passwordResetTokenRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public AuthService(UserRepository userRepository, PasswordResetTokenRepository passwordResetTokenRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
		this.userRepository = userRepository;
		this.passwordResetTokenRepository = passwordResetTokenRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}

	public AuthDtos.UserResponse register(AuthDtos.RegisterRequest request) {
		if (userRepository.existsByEmail(request.email())) {
			throw new BadRequestException("Email already exists");
		}

		boolean adminCreated = isAdminAuthenticated();

		AppUser user = new AppUser();
		user.setFullName(request.fullName());
		user.setEmail(request.email());
		user.setPassword(passwordEncoder.encode(request.password()));
		user.setRole(normalizeInternalRole(request.role()));
		user.setStatus(adminCreated ? UserStatus.ACTIVE : UserStatus.PENDING);

		AppUser saved = userRepository.save(user);
		return toUserResponse(saved);
	}

	public List<AuthDtos.UserResponse> getUsers(UserStatus status) {
		List<AppUser> users = status == null ? userRepository.findAll() : userRepository.findByStatus(status);
		return users.stream().map(this::toUserResponse).toList();
	}

	public AuthDtos.UserResponse approveUser(Long id, Role role) {
		AppUser user = getUser(id);
		user.setRole(normalizeInternalRole(role == null ? user.getRole() : role));
		user.setStatus(UserStatus.ACTIVE);
		return toUserResponse(userRepository.save(user));
	}

	public AuthDtos.UserResponse rejectUser(Long id) {
		AppUser user = getUser(id);
		user.setStatus(UserStatus.REJECTED);
		return toUserResponse(userRepository.save(user));
	}

	public AuthDtos.UserResponse disableUser(Long id) {
		AppUser user = getUser(id);
		user.setStatus(UserStatus.DISABLED);
		return toUserResponse(userRepository.save(user));
	}

	public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
		AppUser user = userRepository.findByEmail(request.email())
			.orElseThrow(() -> new BadRequestException("Invalid credentials"));
		if (!passwordEncoder.matches(request.password(), user.getPassword())) {
			throw new BadRequestException("Invalid credentials");
		}
		if (user.getStatus() == UserStatus.PENDING) {
			throw new BadRequestException("User account is pending admin approval");
		}
		if (user.getStatus() == UserStatus.REJECTED) {
			throw new BadRequestException("User account request was rejected");
		}
		if (user.getStatus() == UserStatus.DISABLED) {
			throw new BadRequestException("User account is disabled");
		}
		return new AuthDtos.AuthResponse(jwtService.generateToken(user), toUserResponse(user));
	}

	public AuthDtos.PasswordResetResponse requestPasswordReset(AuthDtos.PasswordResetRequest request) {
		AppUser user = userRepository.findByEmail(request.email())
			.orElseThrow(() -> new BadRequestException("Email not found"));

		PasswordResetToken token = new PasswordResetToken();
		token.setUser(user);
		token.setExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS));
		passwordResetTokenRepository.save(token);

		// TODO: Send email with reset-link
		// For now, return success message
		return new AuthDtos.PasswordResetResponse("Password reset link sent to your email");
	}

	public AuthDtos.PasswordResetResponse resetPassword(AuthDtos.PasswordResetConfirm request) {
		PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.token())
			.orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

		if (resetToken.isExpired()) {
			throw new BadRequestException("Reset token has expired");
		}

		if (resetToken.isUsed()) {
			throw new BadRequestException("Reset token has already been used");
		}

		AppUser user = resetToken.getUser();
		user.setPassword(passwordEncoder.encode(request.newPassword()));
		userRepository.save(user);

		resetToken.setUsed(true);
		passwordResetTokenRepository.save(resetToken);

		return new AuthDtos.PasswordResetResponse("Password reset successfully");
	}

	public AuthDtos.PasswordResetResponse changePassword(AuthDtos.ChangePasswordRequest request) {
		AppUser user = getCurrentUser();

		if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
			throw new BadRequestException("Current password is incorrect");
		}

		user.setPassword(passwordEncoder.encode(request.newPassword()));
		userRepository.save(user);

		return new AuthDtos.PasswordResetResponse("Password changed successfully");
	}

	private AppUser getCurrentUser() {
		String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return userRepository.findByEmail(email)
			.orElseThrow(() -> new BadRequestException("User not found"));
	}

	private boolean isAdminAuthenticated() {
		var authentication = SecurityContextHolder.getContext().getAuthentication();
		return authentication != null
			&& authentication.isAuthenticated()
			&& authentication.getAuthorities().stream()
				.anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
	}

	private AppUser getUser(Long id) {
		return userRepository.findById(id)
			.orElseThrow(() -> new BadRequestException("User not found"));
	}

	private Role normalizeInternalRole(Role role) {
		if (role == null) {
			return Role.CASHIER;
		}
		return role == Role.WAREHOUSE ? Role.STORE_KEEPER : role;
	}

	private AuthDtos.UserResponse toUserResponse(AppUser user) {
		return new AuthDtos.UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole(), user.getStatus());
	}
}
