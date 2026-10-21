package br.com.SisTomPatrimonio.SisTomPatrimonio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Rotas públicas e de autenticação
                .requestMatchers(HttpMethod.POST, "/api/v1/cadastros/relatos-inconsistencia").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/cadastros/relatos-inconsistencia").permitAll()
                .requestMatchers(HttpMethod.PATCH, "/api/v1/cadastros/relatos-inconsistencia/**")
                    .hasAnyRole("ADMIN", "TECNICO")
                .requestMatchers(
                        "/api/v1/bens-culturais/publicos/**",
                        "/api/v1/public/**",
                        "/api/v1/territorial/**",
                        "/api/v1/documentos/publicos/**",
                        "/api/usuarios/autenticar",
                        "/api/usuarios/refresh",
                        "/api/usuarios/logout",
                        "/error",
                        "/actuator/health",
                        "/api/actuator/health"
                ).permitAll()

                .requestMatchers("/api/bens/**", "/api/documentos/**", "/api/eventos/**",
                        "/api/processos-judiciais/**", "/api/salvaguardas/**").permitAll()
                .requestMatchers("/api/usuarios").hasRole("ADMIN")
                .requestMatchers("/api/v1/administracao/**", "/api/v1/configuracoes/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/auditorias/**").hasAnyRole("ADMIN", "TECNICO")
                .requestMatchers("/api/v1/processos-judiciais/**").hasAnyRole("ADMIN", "JURIDICO")
                .requestMatchers("/api/v1/protecoes/**", "/api/v1/salvaguardas/**")
                    .hasAnyRole("ADMIN", "TECNICO")
                .requestMatchers("/api/v1/vistorias/**").hasAnyRole("ADMIN", "TECNICO", "CONSULTOR")
                .requestMatchers("/api/v1/dashboard/**", "/api/v1/relatorios/**")
                    .hasAnyRole("ADMIN", "TECNICO", "JURIDICO", "CONSULTOR", "LEITOR")
                .requestMatchers("/api/v1/**").authenticated()
                .anyRequest().denyAll())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
