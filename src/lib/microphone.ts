'use client';

// The real microphone, used only in live sessions (docs/sprint-context.md › Real recall engine, phase 2). The
// mic is opened for each recording and closed straight after, so the phone's mic indicator shows only while
// the student is being recorded. The finished recording is held here, in memory, for the processing screen
// to send: a reload drops it, as a reload already drops a take.

export type Recording = {
  /** Ends the recording and returns it. */
  stop: () => Promise<Blob>;
  /** Ends the recording and throws it away. */
  cancel: () => void;
};

/** Asks for the mic (the browser's prompt, the first time) and lets it go at once. False when it's blocked. */
export async function requestMic(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
}

/**
 * Starts recording. Rejects when the mic is blocked or missing. Safari records mp4 (AAC), other browsers
 * webm; the speech service takes both. A low bitrate keeps a long answer small to upload.
 */
export async function startRecording(): Promise<Recording> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mimeType = ['audio/mp4', 'audio/webm'].find((type) => MediaRecorder.isTypeSupported(type));
  const recorder = new MediaRecorder(stream, { ...(mimeType && { mimeType }), audioBitsPerSecond: 64_000 });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  const release = () => stream.getTracks().forEach((track) => track.stop());
  recorder.start();
  return {
    stop: () =>
      new Promise((resolve) => {
        recorder.onstop = () => {
          release();
          resolve(new Blob(chunks, { type: recorder.mimeType || mimeType || 'audio/mp4' }));
        };
        if (recorder.state === 'inactive') recorder.onstop(new Event('stop'));
        else recorder.stop();
      }),
    cancel: () => {
      recorder.onstop = release;
      if (recorder.state === 'inactive') release();
      else recorder.stop();
    },
  };
}

let held: { n: number; audio: Blob } | null = null;

/** Keeps question n's finished recording for the processing screen. */
export function holdRecording(n: number, audio: Blob) {
  held = { n, audio };
}

/** Drops any held recording, when a new take starts. */
export function dropRecording() {
  held = null;
}

/** Question n's held recording, if there is one. Reading it doesn't drop it. */
export function heldRecording(n: number): Blob | null {
  return held?.n === n ? held.audio : null;
}

/** A file name with the extension the speech service needs to know the format. */
export function recordingFileName(audio: Blob): string {
  return audio.type.includes('webm') ? 'answer.webm' : 'answer.mp4';
}
