package com.global.ct.frameinventory.frame;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FrameHistoryEntry {
    private Instant timestamp;
    private Action action;
    private String user;
    private List<ChangedField> changes;
}
