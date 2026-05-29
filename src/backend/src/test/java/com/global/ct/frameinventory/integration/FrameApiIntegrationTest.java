package com.global.ct.frameinventory.integration;

import static org.assertj.core.api.Assertions.assertThat;

import com.global.ct.frameinventory.frame.Action;
import com.global.ct.frameinventory.frame.Frame;
import com.global.ct.frameinventory.frame.FrameRepository;
import com.global.ct.frameinventory.frame.FrameRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class FrameApiIntegrationTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:7.0");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private FrameRepository frameRepository;

    @BeforeEach
    void setUp() {
        frameRepository.deleteAll();
    }

    @Test
    void createAndGetFrame() {
        // Create frame
        FrameRequest request = createFrameRequest("FRAME001", "DIGITAL", "D6", "UNDERGROUND", "LIVE");

        ResponseEntity<Frame> createResponse = restTemplate.postForEntity(
                "/api/frames", request, Frame.class);

        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(createResponse.getBody()).isNotNull();
        assertThat(createResponse.getBody().getFrameId()).isEqualTo("FRAME001");

        // Get frame
        ResponseEntity<Frame> getResponse = restTemplate.getForEntity(
                "/api/frames/FRAME001", Frame.class);

        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getResponse.getBody()).isNotNull();
        assertThat(getResponse.getBody().getFrameId()).isEqualTo("FRAME001");
        assertThat(getResponse.getBody().getType()).isEqualTo("DIGITAL");
        assertThat(getResponse.getBody().getHistory()).hasSize(1);
        assertThat(getResponse.getBody().getHistory().get(0).getAction()).isEqualTo(Action.CREATE);
    }

    @Test
    void updateFrame_recordsHistory() {
        // Create frame first
        FrameRequest createRequest = createFrameRequest("FRAME002", "DIGITAL", "DRAFT");

        restTemplate.postForEntity("/api/frames", createRequest, Frame.class);

        // Update frame
        FrameRequest updateRequest = createFrameRequest("FRAME002", "DIGITAL", "LIVE");

        ResponseEntity<Frame> updateResponse = restTemplate.exchange(
                "/api/frames/FRAME002",
                HttpMethod.PUT,
                new HttpEntity<>(updateRequest),
                Frame.class);

        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(updateResponse.getBody()).isNotNull();
        assertThat(updateResponse.getBody().getStatus()).isEqualTo("LIVE");

        // Verify history was recorded
        ResponseEntity<Frame> getResponse = restTemplate.getForEntity(
                "/api/frames/FRAME002", Frame.class);

        assertThat(getResponse.getBody()).isNotNull();
        assertThat(getResponse.getBody().getHistory()).hasSize(2);

        var updateEntry = getResponse.getBody().getHistory().stream()
                .filter(h -> h.getAction() == Action.UPDATE)
                .findFirst()
                .orElseThrow();

        assertThat(updateEntry.getChanges()).hasSize(1);
        assertThat(updateEntry.getChanges().get(0).getField()).isEqualTo("status");
        assertThat(updateEntry.getChanges().get(0).getOldValue()).isEqualTo("DRAFT");
        assertThat(updateEntry.getChanges().get(0).getNewValue()).isEqualTo("LIVE");
    }

    @Test
    void getFrame_returns404_whenNotFound() {
        ResponseEntity<String> response = restTemplate.getForEntity(
                "/api/frames/NONEXISTENT", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).contains("Frame not found");
    }

    @Test
    void deleteFrame_removesFromDatabase() {
        // Create frame
        FrameRequest request = createFrameRequest("TO_DELETE", "DIGITAL", "LIVE");
        restTemplate.postForEntity("/api/frames", request, Frame.class);

        // Verify it exists
        assertThat(frameRepository.findByFrameId("TO_DELETE")).isPresent();

        // Delete frame
        ResponseEntity<Void> deleteResponse = restTemplate.exchange(
                "/api/frames/TO_DELETE",
                HttpMethod.DELETE,
                null,
                Void.class);

        assertThat(deleteResponse.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        // Verify it's gone
        assertThat(frameRepository.findByFrameId("TO_DELETE")).isEmpty();
    }



    private static FrameRequest createFrameRequest(String frameId, String type, String format, String environment, String status) {
        FrameRequest request = new FrameRequest();
        request.setFrameId(frameId);
        request.setType(type);
        request.setFormat(format);
        request.setEnvironment(environment);
        request.setStatus(status);
        return request;
    }

    private static FrameRequest createFrameRequest(String frameId, String type, String status) {
        FrameRequest request = new FrameRequest();
        request.setFrameId(frameId);
        request.setType(type);
        request.setStatus(status);
        return request;
    }
}
