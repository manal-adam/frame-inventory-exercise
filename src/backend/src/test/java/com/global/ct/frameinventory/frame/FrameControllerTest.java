package com.global.ct.frameinventory.frame;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.global.ct.frameinventory.config.GlobalExceptionHandler;
import com.global.ct.frameinventory.csv.CsvUploadService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class FrameControllerTest {

    private MockMvc mockMvc;

    @Mock
    private FrameService frameService;

    @Mock
    private CsvUploadService csvUploadService;

    @InjectMocks
    private FrameController frameController;

    private ObjectMapper objectMapper;
    private Frame frame;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(frameController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();

        frame = new Frame();
        frame.setId("1");
        frame.setFrameId("FRAME001");
        frame.setType("DIGITAL");
        frame.setFormat("D6");
        frame.setEnvironment("UNDERGROUND");
        frame.setStatus("LIVE");
        frame.setCreatedDate(Instant.now());
        frame.setModifiedDate(Instant.now());
    }

    @Test
    void list_returnsAllFrames() throws Exception {
        when(frameService.findAll()).thenReturn(List.of(frame));

        mockMvc.perform(get("/api/frames"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].frameId").value("FRAME001"))
                .andExpect(jsonPath("$[0].type").value("DIGITAL"));

        verify(frameService).findAll();
    }

    @Test
    void get_returnsFrame_whenExists() throws Exception {
        when(frameService.findByFrameId("FRAME001")).thenReturn(frame);

        mockMvc.perform(get("/api/frames/FRAME001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.frameId").value("FRAME001"))
                .andExpect(jsonPath("$.type").value("DIGITAL"));

        verify(frameService).findByFrameId("FRAME001");
    }

    @Test
    void get_returns404_whenNotFound() throws Exception {
        when(frameService.findByFrameId("INVALID")).thenThrow(new FrameNotFoundException("INVALID"));

        mockMvc.perform(get("/api/frames/INVALID"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Frame not found: INVALID"));
    }

    @Test
    void create_returnsCreatedFrame() throws Exception {
        FrameRequest request = new FrameRequest();
        request.setFrameId("FRAME001");
        request.setType("DIGITAL");
        request.setStatus("LIVE");

        when(frameService.create(any(FrameRequest.class))).thenReturn(frame);

        mockMvc.perform(post("/api/frames")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.frameId").value("FRAME001"));

        verify(frameService).create(any(FrameRequest.class));
    }

    @Test
    void create_returns400_whenValidationFails() throws Exception {
        FrameRequest request = new FrameRequest();
        // Missing required fields

        mockMvc.perform(post("/api/frames")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.frameId").value("frameId is required"))
                .andExpect(jsonPath("$.fieldErrors.type").value("type is required"))
                .andExpect(jsonPath("$.fieldErrors.status").value("status is required"));

        verify(frameService, never()).create(any());
    }

    @Test
    void update_returnsUpdatedFrame() throws Exception {
        FrameRequest request = new FrameRequest();
        request.setFrameId("FRAME001");
        request.setType("DIGITAL");
        request.setStatus("DRAFT");

        when(frameService.update(eq("FRAME001"), any(FrameRequest.class))).thenReturn(frame);

        mockMvc.perform(put("/api/frames/FRAME001")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.frameId").value("FRAME001"));

        verify(frameService).update(eq("FRAME001"), any(FrameRequest.class));
    }

    @Test
    void update_returns404_whenNotFound() throws Exception {
        FrameRequest request = new FrameRequest();
        request.setFrameId("INVALID");
        request.setType("DIGITAL");
        request.setStatus("LIVE");

        when(frameService.update(eq("INVALID"), any(FrameRequest.class)))
                .thenThrow(new FrameNotFoundException("INVALID"));

        mockMvc.perform(put("/api/frames/INVALID")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Frame not found: INVALID"));
    }

    @Test
    void delete_returns204_whenSuccessful() throws Exception {
        doNothing().when(frameService).delete("FRAME001");

        mockMvc.perform(delete("/api/frames/FRAME001"))
                .andExpect(status().isNoContent());

        verify(frameService).delete("FRAME001");
    }

    @Test
    void delete_returns404_whenNotFound() throws Exception {
        doThrow(new FrameNotFoundException("INVALID")).when(frameService).delete("INVALID");

        mockMvc.perform(delete("/api/frames/INVALID"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Frame not found: INVALID"));
    }
}
