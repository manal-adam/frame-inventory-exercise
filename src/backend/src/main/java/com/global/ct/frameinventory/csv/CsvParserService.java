package com.global.ct.frameinventory.csv;

import com.global.ct.frameinventory.frame.Frame;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class CsvParserService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public CsvParseResult parse(MultipartFile file) {
        List<ParsedFrame> validFrames = new ArrayList<>();
        List<CsvRowError> errors = new ArrayList<>();

        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] header = reader.readNext();
            if (header == null) {
                errors.add(new CsvRowError(0, null, "Empty CSV file"));
                return new CsvParseResult(validFrames, errors, 0);
            }

            Map<String, Integer> columnIndex = buildColumnIndex(header);

            String[] row;
            int rowNumber = 1;
            while ((row = reader.readNext()) != null) {
                rowNumber++;
                try {
                    Frame frame = parseRow(row, columnIndex, rowNumber);
                    validFrames.add(new ParsedFrame(frame, rowNumber));
                } catch (CsvParseException e) {
                    errors.add(new CsvRowError(rowNumber, e.getFrameId(), e.getMessage()));
                }
            }

            return new CsvParseResult(validFrames, errors, rowNumber - 1);

        } catch (IOException | CsvValidationException e) {
            log.error("Failed to parse CSV file", e);
            errors.add(new CsvRowError(0, null, "Failed to read CSV file: " + e.getMessage()));
            return new CsvParseResult(validFrames, errors, 0);
        }
    }

    private Map<String, Integer> buildColumnIndex(String[] header) {
        Map<String, Integer> index = new HashMap<>();
        for (int i = 0; i < header.length; i++) {
            index.put(header[i].trim().toLowerCase(), i);
        }
        return index;
    }

    private Frame parseRow(String[] row, Map<String, Integer> columnIndex, int rowNumber) throws CsvParseException {
        String frameId = getColumnValue(row, columnIndex, "frame_id");

        if (frameId == null || frameId.isBlank()) {
            throw new CsvParseException(null, "Missing required field: frame_id");
        }

        String type = getColumnValue(row, columnIndex, "type_classic_digital");
        if (type == null || type.isBlank()) {
            throw new CsvParseException(frameId, "Missing required field: type_classic_digital");
        }

        String status = getColumnValue(row, columnIndex, "status");
        if (status == null || status.isBlank()) {
            throw new CsvParseException(frameId, "Missing required field: status");
        }

        Frame frame = new Frame();
        frame.setFrameId(frameId);
        frame.setType(type);
        frame.setFormat(getColumnValue(row, columnIndex, "format"));
        frame.setEnvironment(getColumnValue(row, columnIndex, "environment"));
        frame.setStatus(status);
        frame.setCreatedDate(parseDate(row, columnIndex, "created_date", frameId));
        frame.setModifiedDate(parseDate(row, columnIndex, "modified_date", frameId));

        return frame;
    }

    private String getColumnValue(String[] row, Map<String, Integer> columnIndex, String columnName) {
        Integer index = columnIndex.get(columnName);
        if (index == null || index >= row.length) {
            return null;
        }
        String value = row[index].trim();
        return value.isEmpty() ? null : value;
    }

    private Instant parseDate(String[] row, Map<String, Integer> columnIndex, String columnName, String frameId) throws CsvParseException {
        String value = getColumnValue(row, columnIndex, columnName);
        if (value == null) {
            return null;
        }
        try {
            LocalDateTime localDateTime = LocalDateTime.parse(value, DATE_FORMATTER);
            return localDateTime.toInstant(ZoneOffset.UTC);
        } catch (DateTimeParseException e) {
            throw new CsvParseException(frameId, "Invalid date format in " + columnName + ": " + value);
        }
    }

    public record ParsedFrame(Frame frame, int rowNumber) {}

    public record CsvParseResult(List<ParsedFrame> validFrames, List<CsvRowError> errors, int totalRows) {}

    private static class CsvParseException extends Exception {
        private final String frameId;

        CsvParseException(String frameId, String message) {
            super(message);
            this.frameId = frameId;
        }

        String getFrameId() {
            return frameId;
        }
    }
}
