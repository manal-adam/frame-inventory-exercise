package com.global.ct.frameinventory.csv;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CsvRowError {
    private int rowNumber;
    private String frameId;
    private String message;
}
