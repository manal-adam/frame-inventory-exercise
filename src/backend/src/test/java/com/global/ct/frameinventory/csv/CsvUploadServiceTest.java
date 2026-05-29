package com.global.ct.frameinventory.csv;

import com.global.ct.frameinventory.frame.Frame;
import com.global.ct.frameinventory.frame.FrameService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CsvUploadServiceTest {

    @Mock
    private CsvParserService csvParserService;

    @Mock
    private FrameService frameService;

    @InjectMocks
    private CsvUploadService csvUploadService;

    private MockMultipartFile file;
    private Frame frame1;
    private Frame frame2;

    @BeforeEach
    void setUp() {
        file = new MockMultipartFile("file", "test.csv", "text/csv", "content".getBytes());

        frame1 = new Frame();
        frame1.setFrameId("FRAME001");
        frame1.setType("DIGITAL");
        frame1.setStatus("LIVE");

        frame2 = new Frame();
        frame2.setFrameId("FRAME002");
        frame2.setType("CLASSIC");
        frame2.setStatus("DRAFT");
    }

    @Test
    void processUpload_insertsNewFrames() {
        CsvParserService.CsvParseResult parseResult = new CsvParserService.CsvParseResult(
                List.of(frame1, frame2),
                Collections.emptyList(),
                2
        );
        when(csvParserService.parse(file)).thenReturn(parseResult);
        when(frameService.existsByFrameId(any())).thenReturn(false);

        CsvUploadResult result = csvUploadService.processUpload(file);

        assertThat(result.getTotalRows()).isEqualTo(2);
        assertThat(result.getInsertedCount()).isEqualTo(2);
        assertThat(result.getSkippedCount()).isEqualTo(0);
        assertThat(result.getErrorCount()).isEqualTo(0);
        verify(frameService, times(2)).save(any(Frame.class));
    }

    @Test
    void processUpload_skipsDuplicateFrames() {
        CsvParserService.CsvParseResult parseResult = new CsvParserService.CsvParseResult(
                List.of(frame1, frame2),
                Collections.emptyList(),
                2
        );
        when(csvParserService.parse(file)).thenReturn(parseResult);
        when(frameService.existsByFrameId("FRAME001")).thenReturn(true);
        when(frameService.existsByFrameId("FRAME002")).thenReturn(false);

        CsvUploadResult result = csvUploadService.processUpload(file);

        assertThat(result.getInsertedCount()).isEqualTo(1);
        assertThat(result.getSkippedCount()).isEqualTo(1);
        verify(frameService, times(1)).save(any(Frame.class));
    }

    @Test
    void processUpload_includesParseErrors() {
        List<CsvRowError> parseErrors = List.of(
                new CsvRowError(2, null, "Missing required field: frame_id")
        );
        CsvParserService.CsvParseResult parseResult = new CsvParserService.CsvParseResult(
                List.of(frame1),
                parseErrors,
                2
        );
        when(csvParserService.parse(file)).thenReturn(parseResult);
        when(frameService.existsByFrameId(any())).thenReturn(false);

        CsvUploadResult result = csvUploadService.processUpload(file);

        assertThat(result.getTotalRows()).isEqualTo(2);
        assertThat(result.getInsertedCount()).isEqualTo(1);
        assertThat(result.getErrorCount()).isEqualTo(1);
        assertThat(result.getErrors()).hasSize(1);
        assertThat(result.getErrors().get(0).getMessage()).contains("Missing required field");
    }

    @Test
    void processUpload_handlesSaveFailure() {
        CsvParserService.CsvParseResult parseResult = new CsvParserService.CsvParseResult(
                List.of(frame1, frame2),
                Collections.emptyList(),
                2
        );
        when(csvParserService.parse(file)).thenReturn(parseResult);
        when(frameService.existsByFrameId(any())).thenReturn(false);
        doThrow(new RuntimeException("Database error")).when(frameService).save(frame1);
        doNothing().when(frameService).save(frame2);

        CsvUploadResult result = csvUploadService.processUpload(file);

        assertThat(result.getInsertedCount()).isEqualTo(1);
        assertThat(result.getErrorCount()).isEqualTo(1);
        assertThat(result.getErrors().get(0).getMessage()).contains("Failed to save");
        assertThat(result.getErrors().get(0).getFrameId()).isEqualTo("FRAME001");
    }

    @Test
    void processUpload_returnsEmptyResult_whenNoFrames() {
        CsvParserService.CsvParseResult parseResult = new CsvParserService.CsvParseResult(
                Collections.emptyList(),
                Collections.emptyList(),
                0
        );
        when(csvParserService.parse(file)).thenReturn(parseResult);

        CsvUploadResult result = csvUploadService.processUpload(file);

        assertThat(result.getTotalRows()).isEqualTo(0);
        assertThat(result.getInsertedCount()).isEqualTo(0);
        assertThat(result.getSkippedCount()).isEqualTo(0);
        assertThat(result.getErrorCount()).isEqualTo(0);
        verify(frameService, never()).save(any());
    }

    @Test
    void processUpload_skipsAllDuplicates() {
        CsvParserService.CsvParseResult parseResult = new CsvParserService.CsvParseResult(
                List.of(frame1, frame2),
                Collections.emptyList(),
                2
        );
        when(csvParserService.parse(file)).thenReturn(parseResult);
        when(frameService.existsByFrameId(any())).thenReturn(true);

        CsvUploadResult result = csvUploadService.processUpload(file);

        assertThat(result.getInsertedCount()).isEqualTo(0);
        assertThat(result.getSkippedCount()).isEqualTo(2);
        verify(frameService, never()).save(any());
    }
}
