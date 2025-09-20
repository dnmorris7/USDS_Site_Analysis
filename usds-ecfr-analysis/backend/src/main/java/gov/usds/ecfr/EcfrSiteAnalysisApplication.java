package gov.usds.ecfr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Main Spring Boot application class for the USDS eCFR Site Analysis service.
 * This application provides REST APIs for analyzing the eCFR government website
 * focusing on accessibility, performance, and usability metrics.
 */
@SpringBootApplication
@EnableAsync
public class EcfrSiteAnalysisApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcfrSiteAnalysisApplication.class, args);
    }
}