package com.inventory.service;

import com.inventory.dto.AuthDtos;
import com.inventory.exception.BadRequestException;
import com.inventory.model.AppUser;
import com.inventory.repository.UserRepository;
import com.inventory.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
 
 // This class is a Spring service that handles authentication-related operations, such as user registration and login.
@Service
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}

	public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
		if (userRepository.existsByEmail(request.email())) {
			throw new BadRequestException("Email already exists");
		}

		AppUser user = new AppUser();
		user.setFullName(request.fullName());
		user.setEmail(request.email());
		user.setPassword(passwordEncoder.encode(request.password()));
		user.setRole(request.role());
		user.setActive(true);

		AppUser saved = userRepository.save(user);
		return new AuthDtos.AuthResponse(jwtService.generateToken(saved), toUserResponse(saved));
	}

	public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
		AppUser user = userRepository.findByEmail(request.email())
			.orElseThrow(() -> new BadRequestException("Invalid credentials"));
		if (!passwordEncoder.matches(request.password(), user.getPassword())) {
			throw new BadRequestException("Invalid credentials");
		}
		return new AuthDtos.AuthResponse(jwtService.generateToken(user), toUserResponse(user));
	}

	private AuthDtos.UserResponse toUserResponse(AppUser user) {
		return new AuthDtos.UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole());
	}
}
