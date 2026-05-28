package com.global.ct.frameinventory.csv;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CsvUploadResult {
    private int totalRows;
    private int insertedCount;
    private int skippedCount;
    private int errorCount;
    private List<CsvRowError> errors;
}
