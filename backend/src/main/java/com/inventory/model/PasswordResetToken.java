package com.inventory.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String token = UUID.randomUUID().toString();

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private AppUser user;

	@Column(nullable = false)
	private Instant expiresAt;

	@Column(nullable = false)
	private boolean used = false;

	@Column(nullable = false, updatable = false)
	private Instant createdAt = Instant.now();

	public boolean isExpired() {
		return Instant.now().isAfter(expiresAt);
	}
}
