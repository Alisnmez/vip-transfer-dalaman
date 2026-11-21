package com.viptransfer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;

import java.util.UUID;
import java.util.List;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers(HttpMethod.GET, "/route-prices").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/route-prices").hasRole("ADMIN")
                        .requestMatchers("/route-prices/**").denyAll()
                        .requestMatchers(HttpMethod.POST, "/bookings").permitAll()
                        .requestMatchers(HttpMethod.POST, "/bookings/management-requests").permitAll()
                        .requestMatchers(HttpMethod.GET, "/bookings/management-requests", "/bookings/management-requests/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/bookings/management-requests/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/bookings/management-requests/*/cancel-booking").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/reviews").permitAll()
                        .requestMatchers(HttpMethod.GET, "/reviews").permitAll()
                        .requestMatchers("/reviews/moderation", "/reviews/*/moderation").hasRole("ADMIN")
                        .requestMatchers("/reviews/**").denyAll()
                        // Customer support uses external messaging, not public booking APIs.
                        .requestMatchers("/bookings/support/**").denyAll()
                        .requestMatchers(HttpMethod.DELETE, "/bookings/**").denyAll()
                        .requestMatchers("/bookings", "/bookings/**", "/admin/auth-check").hasRole("ADMIN")
                        .anyRequest().permitAll())
                .httpBasic(Customizer.withDefaults())
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${app.frontend.origin:http://localhost:5173}") String frontendOrigin) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(frontendOrigin));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Idempotency-Key"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/bookings/**", config);
        source.registerCorsConfiguration("/bookings", config);
        source.registerCorsConfiguration("/admin/auth-check", config);
        source.registerCorsConfiguration("/reviews", config);
        source.registerCorsConfiguration("/reviews/**", config);
        source.registerCorsConfiguration("/route-prices", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(
            @Value("${app.admin.username:admin}") String username,
            @Value("${app.admin.password:}") String configuredPassword,
            PasswordEncoder encoder) {
        // Without a configured password, admin access remains locked.
        String password = configuredPassword.isBlank() ? UUID.randomUUID().toString() : configuredPassword;
        return new InMemoryUserDetailsManager(
                User.withUsername(username)
                        .password(encoder.encode(password))
                        .roles("ADMIN")
                        .build());
    }
}
