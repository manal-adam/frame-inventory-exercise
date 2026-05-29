package com.global.ct.frameinventory.csv;

import com.global.ct.frameinventory.frame.Frame;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;

class CsvParserServiceTest {

    private CsvParserService csvParserService;

    @BeforeEach
    void setUp() {
        csvParserService = new CsvParserService();
    }

    @Test
    void parse_returnsValidFrames_whenCsvIsValid() {
        String csv = """
                frame_id,type_classic_digital,format,environment,status,created_date,modified_date
                FRAME001,DIGITAL,D6,UNDERGROUND,LIVE,2024-01-01 10:00:00,2024-01-15 14:30:00
                FRAME002,CLASSIC,,,DRAFT,2024-01-02 10:00:00,2024-01-16 09:00:00
                """;
        MockMultipartFile file = createCsvFile(csv);

        CsvParserService.CsvParseResult result = csvParserService.parse(file);

        assertThat(result.validFrames()).hasSize(2);
        assertThat(result.errors()).isEmpty();
        assertThat(result.totalRows()).isEqualTo(2);

        Frame frame1 = result.validFrames().get(0).frame();
        assertThat(frame1.getFrameId()).isEqualTo("FRAME001");
        assertThat(frame1.getType()).isEqualTo("DIGITAL");
        assertThat(frame1.getFormat()).isEqualTo("D6");
        assertThat(frame1.getEnvironment()).isEqualTo("UNDERGROUND");
        assertThat(frame1.getStatus()).isEqualTo("LIVE");
        assertThat(frame1.getCreatedDate()).isNotNull();
        assertThat(frame1.getModifiedDate()).isNotNull();

        Frame frame2 = result.validFrames().get(1).frame();
        assertThat(frame2.getFrameId()).isEqualTo("FRAME002");
        assertThat(frame2.getFormat()).isNull();
        assertThat(frame2.getEnvironment()).isNull();
    }

    @Test
    void parse_returnsError_whenFrameIdMissing() {
        String csv = """
                frame_id,type_classic_digital,format,environment,status
                ,DIGITAL,D6,UNDERGROUND,LIVE
                """;
        MockMultipartFile file = createCsvFile(csv);

        CsvParserService.CsvParseResult result = csvParserService.parse(file);

        assertThat(result.validFrames()).isEmpty();
        assertThat(result.errors()).hasSize(1);
        assertThat(result.errors().get(0).getMessage()).contains("Missing required field: frame_id");
        assertThat(result.errors().get(0).getRowNumber()).isEqualTo(2);
    }

    @Test
    void parse_returnsError_whenTypeMissing() {
        String csv = """
                frame_id,type_classic_digital,format,environment,status
                FRAME001,,D6,UNDERGROUND,LIVE
                """;
        MockMultipartFile file = createCsvFile(csv);

        CsvParserService.CsvParseResult result = csvParserService.parse(file);

        assertThat(result.validFrames()).isEmpty();
        assertThat(result.errors()).hasSize(1);
        assertThat(result.errors().get(0).getMessage()).contains("Missing required field: type_classic_digital");
        assertThat(result.errors().get(0).getFrameId()).isEqualTo("FRAME001");
    }

    @Test
    void parse_returnsError_whenStatusMissing() {
        String csv = """
                frame_id,type_classic_digital,format,environment,status
                FRAME001,DIGITAL,D6,UNDERGROUND,
                """;
        MockMultipartFile file = createCsvFile(csv);

        CsvParserService.CsvParseResult result = csvParserService.parse(file);

        assertThat(result.validFrames()).isEmpty();
        assertThat(result.errors()).hasSize(1);
        assertThat(result.errors().get(0).getMessage()).contains("Missing required field: status");
    }

    @Test
    void parse_returnsError_whenDateFormatInvalid() {
        String csv = """
                frame_id,type_classic_digital,format,environment,status,created_date
                FRAME001,DIGITAL,D6,UNDERGROUND,LIVE,invalid-date
                """;
        MockMultipartFile file = createCsvFile(csv);

        CsvParserService.CsvParseResult result = csvParserService.parse(file);

        assertThat(result.validFrames()).isEmpty();
        assertThat(result.errors()).hasSize(1);
        assertThat(result.errors().get(0).getMessage()).contains("Invalid date format");
    }

    @Test
    void parse_returnsError_whenCsvEmpty() {
        String csv = "";
        MockMultipartFile file = createCsvFile(csv);

        CsvParserService.CsvParseResult result = csvParserService.parse(file);

        assertThat(result.validFrames()).isEmpty();
        assertThat(result.errors()).hasSize(1);
        assertThat(result.errors().get(0).getMessage()).contains("Empty CSV file");
    }

    @Test
    void parse_processesValidAndInvalidRows_separately() {
        String csv = """
                frame_id,type_classic_digital,format,environment,status
                FRAME001,DIGITAL,D6,UNDERGROUND,LIVE
                ,DIGITAL,D6,UNDERGROUND,LIVE
                FRAME003,CLASSIC,,,DRAFT
                """;
        MockMultipartFile file = createCsvFile(csv);

        CsvParserService.CsvParseResult result = csvParserService.parse(file);

        assertThat(result.validFrames()).hasSize(2);
        assertThat(result.errors()).hasSize(1);
        assertThat(result.totalRows()).isEqualTo(3);
    }

    @Test
    void parse_handlesColumnsInAnyOrder() {
        String csv = """
                status,frame_id,type_classic_digital,environment,format
                LIVE,FRAME001,DIGITAL,UNDERGROUND,D6
                """;
        MockMultipartFile file = createCsvFile(csv);

        CsvParserService.CsvParseResult result = csvParserService.parse(file);

        assertThat(result.validFrames()).hasSize(1);
        Frame frame = result.validFrames().get(0).frame();
        assertThat(frame.getFrameId()).isEqualTo("FRAME001");
        assertThat(frame.getStatus()).isEqualTo("LIVE");
    }

    @Test
    void parse_trimsWhitespace() {
        String csv = """
                frame_id,type_classic_digital,format,environment,status
                 FRAME001 , DIGITAL , D6 , UNDERGROUND , LIVE
                """;
        MockMultipartFile file = createCsvFile(csv);

        CsvParserService.CsvParseResult result = csvParserService.parse(file);

        assertThat(result.validFrames()).hasSize(1);
        Frame frame = result.validFrames().get(0).frame();
        assertThat(frame.getFrameId()).isEqualTo("FRAME001");
        assertThat(frame.getType()).isEqualTo("DIGITAL");
    }

    private MockMultipartFile createCsvFile(String content) {
        return new MockMultipartFile(
                "file",
                "test.csv",
                "text/csv",
                content.getBytes(StandardCharsets.UTF_8)
        );
    }
}
