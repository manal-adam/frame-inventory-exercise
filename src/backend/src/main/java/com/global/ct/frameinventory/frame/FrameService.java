package com.global.ct.frameinventory.frame;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
@RequiredArgsConstructor
public class FrameService {

    private final FrameRepository frameRepository;

    public List<Frame> findAll() {
        return frameRepository.findAll();
    }

    public Frame findByFrameId(String frameId) {
        return frameRepository.findByFrameId(frameId)
                .orElseThrow(() -> new FrameNotFoundException(frameId));
    }

    public Frame create(FrameRequest request) {
        log.info("Creating frame with frameId= {}", request.getFrameId());
        Instant now = Instant.now();

        Frame frame = new Frame();
        frame.setFrameId(request.getFrameId());
        frame.setType(request.getType());
        frame.setFormat(request.getFormat());
        frame.setEnvironment(request.getEnvironment());
        frame.setStatus(request.getStatus());
        frame.setCreatedDate(now);
        frame.setModifiedDate(now);

        FrameHistoryEntry historyEntry = FrameHistoryEntry.builder()
                .timestamp(now)
                .action(Action.CREATE)
                .user("system")
                .changes(Collections.emptyList())
                .build();
        frame.getHistory().add(historyEntry);

        return frameRepository.save(frame);
    }

    public Frame update(String frameId, FrameRequest request) {
        log.info("Updating frame with frameId= {}", frameId);
        Frame frame = findByFrameId(frameId);
        Instant now = Instant.now();

        List<ChangedField> changes = detectChanges(frame, request);

        frame.setType(request.getType());
        frame.setFormat(request.getFormat());
        frame.setEnvironment(request.getEnvironment());
        frame.setStatus(request.getStatus());
        frame.setModifiedDate(now);

        if (!changes.isEmpty()) {
            FrameHistoryEntry historyEntry = FrameHistoryEntry.builder()
                    .timestamp(now)
                    .action(Action.UPDATE)
                    .user("system")
                    .changes(changes)
                    .build();
            frame.getHistory().add(historyEntry);
        }

        return frameRepository.save(frame);
    }

    private List<ChangedField> detectChanges(Frame frame, FrameRequest request) {
        List<ChangedField> changes = new ArrayList<>();

        if (!Objects.equals(frame.getType(), request.getType())) {
            changes.add(new ChangedField("type", frame.getType(), request.getType()));
        }
        if (!Objects.equals(frame.getFormat(), request.getFormat())) {
            changes.add(new ChangedField("format", frame.getFormat(), request.getFormat()));
        }
        if (!Objects.equals(frame.getEnvironment(), request.getEnvironment())) {
            changes.add(new ChangedField("environment", frame.getEnvironment(), request.getEnvironment()));
        }
        if (!Objects.equals(frame.getStatus(), request.getStatus())) {
            changes.add(new ChangedField("status", frame.getStatus(), request.getStatus()));
        }

        return changes;
    }

    public void delete(String frameId) {
        log.info("Deleting frame with frameId= {}", frameId);
        Frame frame = findByFrameId(frameId);
        frameRepository.delete(frame);
    }

    public boolean existsByFrameId(String frameId) {
        return frameRepository.findByFrameId(frameId).isPresent();
    }

    public void save(Frame frame) {
        if (frame.getCreatedDate() == null) {
            frame.setCreatedDate(Instant.now());
        }
        if (frame.getModifiedDate() == null) {
            frame.setModifiedDate(Instant.now());
        }
        frameRepository.save(frame);
    }
}
