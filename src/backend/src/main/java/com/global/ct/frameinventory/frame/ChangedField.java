package com.global.ct.frameinventory.frame;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangedField {
    private String field;
    private String oldValue;
    private String newValue;
}
