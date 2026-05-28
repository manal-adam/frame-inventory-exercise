package com.global.ct.frameinventory.frame;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@Document(collection = "frames")
public class Frame {

    @Id
    private String id;

    @Indexed(unique = true)
    private String frameId;

    private String type;
    private String format;
    private String environment;
    private String status;
    private Instant createdDate;
    private Instant modifiedDate;
}
