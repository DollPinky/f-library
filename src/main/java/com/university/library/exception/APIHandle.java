package com.university.library.exception;


import com.university.library.base.StandardResponse;
import com.university.library.exception.exceptions.*;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.lang.IllegalArgumentException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class APIHandle {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<StandardResponse<?>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> errorMessages = new ArrayList<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error -> errorMessages.add(error.getField() + ": " + error.getDefaultMessage()));


        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(StandardResponse.error(errorMessages));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<StandardResponse<?>> handleConstraintViolation(ConstraintViolationException ex) {
        List<String> errorMessages = new ArrayList<>();

        ex.getConstraintViolations().forEach(violation -> {
            String field = violation.getPropertyPath().toString();
            errorMessages.add(field + ": " + violation.getMessage());
        });


        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(StandardResponse.error(errorMessages));
    }

    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public ResponseEntity<StandardResponse<?>> handleDuplicate(SQLIntegrityConstraintViolationException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(StandardResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(NullPointerException.class)
    public  ResponseEntity<StandardResponse<?>> handleNullPointer(NullPointerException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(StandardResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<StandardResponse<?>> handleUnauthorizedException(UnauthorizedException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(StandardResponse.error(HttpStatus.UNAUTHORIZED.value()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<StandardResponse<?>> handleRuntimeExceptionException(RuntimeException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(StandardResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<StandardResponse<?>> handleNotFoundException(NotFoundException exception) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(StandardResponse.error(exception.getMessage()));

    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<StandardResponse<?>> handleConflictException(ConflictException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(StandardResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<StandardResponse<?>>  handleBadRequestException(BadRequestException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<StandardResponse<?>> handleForbiddenException(ForbiddenException exception) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(StandardResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(TokenRefreshException.class)
    public ResponseEntity<StandardResponse<?>> handleTokenRefreshException(TokenRefreshException exception) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(StandardResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(InternalServerErrorException.class)
    public ResponseEntity<StandardResponse<?>> handleTokenRefreshException(InternalServerErrorException exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<StandardResponse<?>> handleResourceNotFoundException(ResourceNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(StandardResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<StandardResponse<?>> handleIllegalArgumentException(IllegalArgumentException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardResponse.error(exception.getMessage()));
    }
}
