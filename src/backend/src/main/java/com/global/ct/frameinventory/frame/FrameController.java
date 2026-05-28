package com.global.ct.frameinventory.frame;

import com.global.ct.frameinventory.csv.CsvUploadResult;
import com.global.ct.frameinventory.csv.CsvUploadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/frames")
@RequiredArgsConstructor
public class FrameController {

    private final FrameService frameService;
    private final CsvUploadService csvUploadService;

    @GetMapping
    public List<Frame> list() {
        return frameService.findAll();
    }

    @GetMapping("/{frameId}")
    public Frame get(@PathVariable String frameId) {
        return frameService.findByFrameId(frameId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Frame create(@Valid @RequestBody FrameRequest request) {
        return frameService.create(request);
    }

    @PutMapping("/{frameId}")
    public Frame update(@PathVariable String frameId, @Valid @RequestBody FrameRequest request) {
        return frameService.update(frameId, request);
    }

    @DeleteMapping("/{frameId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String frameId) {
        frameService.delete(frameId);
    }

    @PostMapping("/upload")
    public CsvUploadResult upload(@RequestParam("file") MultipartFile file) {
        return csvUploadService.processUpload(file);
    }
}
