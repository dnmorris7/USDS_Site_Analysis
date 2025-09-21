package gov.usds.ecfr.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration for REST clients used to integrate with external APIs.
 */
@Configuration
public class RestClientConfig {

    /**
     * Creates a RestTemplate bean for HTTP API calls.
     * 
     * @return configured RestTemplate
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}