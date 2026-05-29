package com.global.ct.frameinventory.csv;

import com.global.ct.frameinventory.frame.Frame;
import com.global.ct.frameinventory.frame.FrameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CsvUploadService {

    private final CsvParserService csvParserService;
    private final FrameService frameService;

    public CsvUploadResult processUpload(MultipartFile file) {
        CsvParserService.CsvParseResult parseResult = csvParserService.parse(file);
        return saveFrames(parseResult.validFrames(), parseResult.errors(), parseResult.totalRows());
    }

    private CsvUploadResult saveFrames(List<CsvParserService.ParsedFrame> parsedFrames, List<CsvRowError> parseErrors, int totalRows) {
        log.info("Processing {} frames from CSV upload", parsedFrames.size());

        List<CsvRowError> allErrors = new ArrayList<>(parseErrors);
        int insertedCount = 0;
        int skippedCount = 0;

        for (CsvParserService.ParsedFrame parsedFrame : parsedFrames) {
            Frame frame = parsedFrame.frame();
            int rowNumber = parsedFrame.rowNumber();

            if (frameService.existsByFrameId(frame.getFrameId())) {
                skippedCount++;
                log.debug("Skipping duplicate frameId: {}", frame.getFrameId());
            } else {
                try {
                    frameService.save(frame);
                    insertedCount++;
                } catch (Exception e) {
                    log.error("Failed to save frame: {}", frame.getFrameId(), e);
                    allErrors.add(new CsvRowError(rowNumber, frame.getFrameId(), "Failed to save: " + e.getMessage()));
                }
            }
        }

        log.info("CSV upload complete: inserted={}, skipped={}, errors={}", insertedCount, skippedCount, allErrors.size());

        return CsvUploadResult.builder()
                .totalRows(totalRows)
                .insertedCount(insertedCount)
                .skippedCount(skippedCount)
                .errorCount(allErrors.size())
                .errors(allErrors)
                .build();
    }
}
