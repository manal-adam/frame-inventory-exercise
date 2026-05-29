package com.global.ct.frameinventory.frame;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FrameServiceTest {

    @Mock
    private FrameRepository frameRepository;

    @InjectMocks
    private FrameService frameService;

    private Frame existingFrame;
    private FrameRequest request;

    @BeforeEach
    void setUp() {
        existingFrame = new Frame();
        existingFrame.setId("1");
        existingFrame.setFrameId("FRAME001");
        existingFrame.setType("DIGITAL");
        existingFrame.setFormat("D6");
        existingFrame.setEnvironment("UNDERGROUND");
        existingFrame.setStatus("LIVE");
        existingFrame.setCreatedDate(Instant.now());
        existingFrame.setModifiedDate(Instant.now());

        request = new FrameRequest();
        request.setFrameId("FRAME001");
        request.setType("DIGITAL");
        request.setFormat("D6");
        request.setEnvironment("UNDERGROUND");
        request.setStatus("LIVE");
    }

    @Test
    void findAll_returnsAllFrames() {
        List<Frame> frames = List.of(existingFrame);
        when(frameRepository.findAll()).thenReturn(frames);

        List<Frame> result = frameService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getFrameId()).isEqualTo("FRAME001");
        verify(frameRepository).findAll();
    }

    @Test
    void findByFrameId_returnsFrame_whenExists() {
        when(frameRepository.findByFrameId("FRAME001")).thenReturn(Optional.of(existingFrame));

        Frame result = frameService.findByFrameId("FRAME001");

        assertThat(result.getFrameId()).isEqualTo("FRAME001");
        verify(frameRepository).findByFrameId("FRAME001");
    }

    @Test
    void findByFrameId_throwsException_whenNotFound() {
        when(frameRepository.findByFrameId("INVALID")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> frameService.findByFrameId("INVALID"))
                .isInstanceOf(FrameNotFoundException.class)
                .hasMessage("Frame not found: INVALID");
    }

    @Test
    void create_savesNewFrame() {
        when(frameRepository.save(any(Frame.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Frame result = frameService.create(request);

        assertThat(result.getFrameId()).isEqualTo("FRAME001");
        assertThat(result.getType()).isEqualTo("DIGITAL");
        assertThat(result.getFormat()).isEqualTo("D6");
        assertThat(result.getEnvironment()).isEqualTo("UNDERGROUND");
        assertThat(result.getStatus()).isEqualTo("LIVE");
        assertThat(result.getCreatedDate()).isNotNull();
        assertThat(result.getModifiedDate()).isNotNull();
        verify(frameRepository).save(any(Frame.class));
    }

    @Test
    void create_addsCreateHistoryEntry() {
        when(frameRepository.save(any(Frame.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Frame result = frameService.create(request);

        assertThat(result.getHistory()).hasSize(1);
        FrameHistoryEntry historyEntry = result.getHistory().get(0);
        assertThat(historyEntry.getAction()).isEqualTo(Action.CREATE);
        assertThat(historyEntry.getUser()).isEqualTo("system");
        assertThat(historyEntry.getChanges()).isEmpty();
    }

    @Test
    void update_updatesExistingFrame() {
        when(frameRepository.findByFrameId("FRAME001")).thenReturn(Optional.of(existingFrame));
        when(frameRepository.save(any(Frame.class))).thenAnswer(invocation -> invocation.getArgument(0));

        request.setStatus("DRAFT");
        Frame result = frameService.update("FRAME001", request);

        assertThat(result.getStatus()).isEqualTo("DRAFT");
        verify(frameRepository).save(any(Frame.class));
    }

    @Test
    void update_addsHistoryEntry_whenFieldsChange() {
        when(frameRepository.findByFrameId("FRAME001")).thenReturn(Optional.of(existingFrame));
        when(frameRepository.save(any(Frame.class))).thenAnswer(invocation -> invocation.getArgument(0));

        request.setStatus("DRAFT");
        Frame result = frameService.update("FRAME001", request);

        assertThat(result.getHistory()).hasSize(1);
        FrameHistoryEntry historyEntry = result.getHistory().get(0);
        assertThat(historyEntry.getAction()).isEqualTo(Action.UPDATE);
        assertThat(historyEntry.getChanges()).hasSize(1);
        assertThat(historyEntry.getChanges().get(0).getField()).isEqualTo("status");
        assertThat(historyEntry.getChanges().get(0).getOldValue()).isEqualTo("LIVE");
        assertThat(historyEntry.getChanges().get(0).getNewValue()).isEqualTo("DRAFT");
    }

    @Test
    void update_doesNotAddHistoryEntry_whenNoChanges() {
        when(frameRepository.findByFrameId("FRAME001")).thenReturn(Optional.of(existingFrame));
        when(frameRepository.save(any(Frame.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Frame result = frameService.update("FRAME001", request);

        assertThat(result.getHistory()).isEmpty();
    }

    @Test
    void update_throwsException_whenFrameNotFound() {
        when(frameRepository.findByFrameId("INVALID")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> frameService.update("INVALID", request))
                .isInstanceOf(FrameNotFoundException.class)
                .hasMessage("Frame not found: INVALID");
    }

    @Test
    void delete_deletesFrame() {
        when(frameRepository.findByFrameId("FRAME001")).thenReturn(Optional.of(existingFrame));

        frameService.delete("FRAME001");

        verify(frameRepository).delete(existingFrame);
    }

    @Test
    void delete_throwsException_whenFrameNotFound() {
        when(frameRepository.findByFrameId("INVALID")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> frameService.delete("INVALID"))
                .isInstanceOf(FrameNotFoundException.class)
                .hasMessage("Frame not found: INVALID");
    }

    @Test
    void existsByFrameId_returnsTrue_whenExists() {
        when(frameRepository.findByFrameId("FRAME001")).thenReturn(Optional.of(existingFrame));

        boolean result = frameService.existsByFrameId("FRAME001");

        assertThat(result).isTrue();
    }

    @Test
    void existsByFrameId_returnsFalse_whenNotExists() {
        when(frameRepository.findByFrameId("INVALID")).thenReturn(Optional.empty());

        boolean result = frameService.existsByFrameId("INVALID");

        assertThat(result).isFalse();
    }
}
