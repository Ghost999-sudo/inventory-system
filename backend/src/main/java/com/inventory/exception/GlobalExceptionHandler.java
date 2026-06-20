package com.inventory.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
 // This method handles ResourceNotFoundException and returns a 404 Not Found response with a message.
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException exception) {
		return build(HttpStatus.NOT_FOUND, exception.getMessage());
	}

	// This method handles BadRequestException and returns a 400 Bad Request response with a message.
	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<Map<String, Object>> handleBadRequest(BadRequestException exception) {
		return build(HttpStatus.BAD_REQUEST, exception.getMessage());
	}

	// This method handles MethodArgumentNotValidException and returns a 400 Bad Request response with validation error messages.
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException exception) {
		String message = exception.getBindingResult().getFieldErrors().stream()
			.findFirst()
			.map(error -> error.getField() + " " + error.getDefaultMessage())
			.orElse("Validation failed");
		return build(HttpStatus.BAD_REQUEST, message);
	}

    // This method handles all other exceptions and returns a 500 Internal Server Error response with a generic message.
	private ResponseEntity<Map<String, Object>> build(HttpStatus status, String message) {
		Map<String, Object> body = new HashMap<>();
		body.put("status", status.value());
		body.put("message", message);
		return ResponseEntity.status(status).body(body);
	}
}
