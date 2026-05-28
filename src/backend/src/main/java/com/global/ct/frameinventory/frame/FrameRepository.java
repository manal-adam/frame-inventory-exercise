package com.global.ct.frameinventory.frame;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface FrameRepository extends MongoRepository<Frame, String> {

    Optional<Frame> findByFrameId(String frameId);
}
