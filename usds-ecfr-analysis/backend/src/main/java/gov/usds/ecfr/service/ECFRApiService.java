package gov.usds.ecfr.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.Map;

/**
 * Service for integrating with the official eCFR API.
 * Downloads and processes federal regulation data.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ECFRApiService {

    private final RestTemplate restTemplate;
    
    private static final String ECFR_BASE_URL = "https://www.ecfr.gov/api/versioner/v1";

    /**
     * Downloads the list of all CFR titles from the eCFR API.
     * 
     * @return List of CFR titles with metadata
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> downloadTitles() {
        try {
            log.info("Downloading CFR titles from eCFR API");
            String url = ECFR_BASE_URL + "/titles";
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response != null && response.containsKey("titles")) {
                List<Map<String, Object>> titles = (List<Map<String, Object>>) response.get("titles");
                log.info("Successfully downloaded {} CFR titles", titles.size());
                return titles;
            }
            
            log.warn("No titles found in eCFR API response");
            return List.of();
            
        } catch (HttpClientErrorException e) {
            log.error("HTTP error downloading CFR titles: {} - {}", e.getStatusCode(), e.getMessage());
            throw new RuntimeException("Failed to download CFR titles from eCFR API", e);
        } catch (Exception e) {
            log.error("Error downloading CFR titles", e);
            throw new RuntimeException("Failed to download CFR titles", e);
        }
    }

    /**
     * Downloads all parts for a specific CFR title.
     * 
     * @param titleNumber The CFR title number (e.g., 40 for EPA)
     * @return List of parts within the title
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> downloadPartsForTitle(int titleNumber) {
        try {
            log.info("Downloading parts for CFR title {}", titleNumber);
            String url = ECFR_BASE_URL + "/titles/" + titleNumber + "/parts";
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response != null && response.containsKey("parts")) {
                List<Map<String, Object>> parts = (List<Map<String, Object>>) response.get("parts");
                log.info("Successfully downloaded {} parts for title {}", parts.size(), titleNumber);
                return parts;
            }
            
            log.warn("No parts found for CFR title {}", titleNumber);
            return List.of();
            
        } catch (HttpClientErrorException e) {
            log.error("HTTP error downloading parts for title {}: {} - {}", titleNumber, e.getStatusCode(), e.getMessage());
            throw new RuntimeException("Failed to download parts for title " + titleNumber, e);
        } catch (Exception e) {
            log.error("Error downloading parts for title {}", titleNumber, e);
            throw new RuntimeException("Failed to download parts for title " + titleNumber, e);
        }
    }

    /**
     * Downloads the full text content of a specific regulation.
     * 
     * @param titleNumber CFR title number
     * @param partNumber CFR part number  
     * @return The regulation content and metadata
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> downloadRegulationContent(int titleNumber, String partNumber) {
        try {
            log.info("Downloading content for CFR {} part {}", titleNumber, partNumber);
            String url = ECFR_BASE_URL + "/titles/" + titleNumber + "/parts/" + partNumber;
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response != null) {
                log.info("Successfully downloaded content for CFR {} part {}", titleNumber, partNumber);
                return response;
            }
            
            log.warn("No content found for CFR {} part {}", titleNumber, partNumber);
            return Map.of();
            
        } catch (HttpClientErrorException e) {
            log.error("HTTP error downloading content for CFR {} part {}: {} - {}", 
                     titleNumber, partNumber, e.getStatusCode(), e.getMessage());
            throw new RuntimeException("Failed to download regulation content", e);
        } catch (Exception e) {
            log.error("Error downloading content for CFR {} part {}", titleNumber, partNumber, e);
            throw new RuntimeException("Failed to download regulation content", e);
        }
    }

    /**
     * Downloads historical versions of a regulation to track changes.
     * 
     * @param titleNumber CFR title number
     * @param partNumber CFR part number
     * @return List of historical versions
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> downloadRegulationHistory(int titleNumber, String partNumber) {
        try {
            log.info("Downloading history for CFR {} part {}", titleNumber, partNumber);
            String url = ECFR_BASE_URL + "/titles/" + titleNumber + "/parts/" + partNumber + "/versions";
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response != null && response.containsKey("versions")) {
                List<Map<String, Object>> versions = (List<Map<String, Object>>) response.get("versions");
                log.info("Successfully downloaded {} historical versions for CFR {} part {}", 
                        versions.size(), titleNumber, partNumber);
                return versions;
            }
            
            log.warn("No historical versions found for CFR {} part {}", titleNumber, partNumber);
            return List.of();
            
        } catch (HttpClientErrorException e) {
            log.error("HTTP error downloading history for CFR {} part {}: {} - {}", 
                     titleNumber, partNumber, e.getStatusCode(), e.getMessage());
            throw new RuntimeException("Failed to download regulation history", e);
        } catch (Exception e) {
            log.error("Error downloading history for CFR {} part {}", titleNumber, partNumber, e);
            throw new RuntimeException("Failed to download regulation history", e);
        }
    }
}