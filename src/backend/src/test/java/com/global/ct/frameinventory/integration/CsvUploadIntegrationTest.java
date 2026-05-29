package com.global.ct.frameinventory.integration;

import static org.assertj.core.api.Assertions.assertThat;

import com.global.ct.frameinventory.csv.CsvUploadResult;
import com.global.ct.frameinventory.frame.Frame;
import com.global.ct.frameinventory.frame.FrameRepository;
import com.global.ct.frameinventory.frame.FrameRequest;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class CsvUploadIntegrationTest {

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
    void uploadCsv_insertsFrames() {
        String csvContent = "frame_id,type_classic_digital,status,format,environment\n" +
            "CSV001,DIGITAL,LIVE,D6,UNDERGROUND\n" +
            "CSV002,CLASSIC,DRAFT,48,ROADSIDE\n";

        ResponseEntity<CsvUploadResult> response = uploadCsv(csvContent);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getTotalRows()).isEqualTo(2);
        assertThat(response.getBody().getInsertedCount()).isEqualTo(2);
        assertThat(response.getBody().getErrorCount()).isEqualTo(0);

        // Verify frames exist in database
        List<Frame> frames = frameRepository.findAll();
        assertThat(frames).hasSize(2);
        assertThat(frames).extracting(Frame::getFrameId).containsExactlyInAnyOrder("CSV001", "CSV002");
    }

    @Test
    void uploadCsv_skipsExistingFrames() {
        // Create existing frame
        FrameRequest existingFrame = createFrameRequest("EXISTING001", "DIGITAL", "LIVE");
        restTemplate.postForEntity("/api/frames", existingFrame, Frame.class);

        // Upload CSV with existing and new frame
        String csvContent = "frame_id,type_classic_digital,status\n" +
            "EXISTING001,CLASSIC,DRAFT\n" +
            "NEW001,DIGITAL,LIVE\n";

        ResponseEntity<CsvUploadResult> response = uploadCsv(csvContent);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getTotalRows()).isEqualTo(2);
        assertThat(response.getBody().getInsertedCount()).isEqualTo(1);
        assertThat(response.getBody().getSkippedCount()).isEqualTo(1);

        // Verify existing frame was not modified
        ResponseEntity<Frame> existingResponse = restTemplate.getForEntity(
            "/api/frames/EXISTING001", Frame.class);
        assertThat(existingResponse.getBody()).isNotNull();
        assertThat(existingResponse.getBody().getType()).isEqualTo("DIGITAL"); // Original value, not CLASSIC
    }


    private ResponseEntity<CsvUploadResult> uploadCsv(String csvContent) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(csvContent.getBytes()) {
            @Override
            public String getFilename() {
                return "test.csv";
            }
        });

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        return restTemplate.postForEntity("/api/frames/upload", requestEntity, CsvUploadResult.class);
    }

    private static FrameRequest createFrameRequest(String frameId, String type, String status) {
        FrameRequest request = new FrameRequest();
        request.setFrameId(frameId);
        request.setType(type);
        request.setStatus(status);
        return request;
    }

}
