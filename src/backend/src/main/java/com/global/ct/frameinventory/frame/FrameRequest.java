package com.global.ct.frameinventory.frame;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FrameRequest {

    @NotBlank(message = "frameId is required")
    private String frameId;

    @NotBlank(message = "type is required")
    private String type;

    private String format;

    private String environment;

    @NotBlank(message = "status is required")
    private String status;
}
