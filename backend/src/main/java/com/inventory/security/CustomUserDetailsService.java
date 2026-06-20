package com.inventory.security;

import com.inventory.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepository;

	public CustomUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) {
		var appUser = userRepository.findByEmail(username)
			.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return new User(
			appUser.getEmail(),
			appUser.getPassword(),
			appUser.isActive(),
			true,
			true,
			true,
			List.of(new SimpleGrantedAuthority("ROLE_" + appUser.getRole().name()))
		);
	}
}
