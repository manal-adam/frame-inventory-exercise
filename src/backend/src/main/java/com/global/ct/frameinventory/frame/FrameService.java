package com.global.ct.frameinventory.frame;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

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
        Frame frame = new Frame();
        frame.setFrameId(request.getFrameId());
        frame.setType(request.getType());
        frame.setFormat(request.getFormat());
        frame.setEnvironment(request.getEnvironment());
        frame.setStatus(request.getStatus());
        frame.setCreatedDate(Instant.now());
        frame.setModifiedDate(Instant.now());
        return frameRepository.save(frame);
    }

    public Frame update(String frameId, FrameRequest request) {
        log.info("Updating frame with frameId= {}", frameId);
        Frame frame = findByFrameId(frameId);
        frame.setType(request.getType());
        frame.setFormat(request.getFormat());
        frame.setEnvironment(request.getEnvironment());
        frame.setStatus(request.getStatus());
        frame.setModifiedDate(Instant.now());
        return frameRepository.save(frame);
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
