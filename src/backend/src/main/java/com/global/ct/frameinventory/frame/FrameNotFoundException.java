package com.global.ct.frameinventory.frame;

public class FrameNotFoundException extends RuntimeException {

    public FrameNotFoundException(String frameId) {
        super("Frame not found: " + frameId);
    }
}
