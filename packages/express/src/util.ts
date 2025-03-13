/**
 * Create a 44-byte WAV header for 16-bit mono PCM data.
 *
 * @param {number} dataSize - The size of the PCM audio data in bytes.
 * @param {number} sampleRate - The sampling rate (e.g., 22050).
 * @returns {Buffer} - A 44-byte Buffer containing the WAV header.
 */
export function createWavHeader(dataSize, sampleRate = 22050) {
  // WAV header constants for 16-bit PCM mono:
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const headerSize = 44;

  // Allocate a 44-byte buffer
  const buffer = Buffer.alloc(headerSize);

  /*
   * ChunkID   (4 bytes)  - "RIFF"
   * ChunkSize (4 bytes)  - 36 + SubChunk2Size
   * Format    (4 bytes)  - "WAVE"
   *
   * Subchunk1ID   (4 bytes) - "fmt "
   * Subchunk1Size (4 bytes) - 16 (PCM)
   * AudioFormat    (2 bytes) - 1 (PCM)
   * NumChannels    (2 bytes) - 1 (mono)
   * SampleRate     (4 bytes)
   * ByteRate       (4 bytes) - sampleRate * numChannels * bitsPerSample / 8
   * BlockAlign     (2 bytes) - numChannels * bitsPerSample / 8
   * BitsPerSample  (2 bytes) - 16
   *
   * Subchunk2ID    (4 bytes) - "data"
   * Subchunk2Size  (4 bytes) - dataSize
   */

  // RIFF header
  buffer.write('RIFF', 0);                       // ChunkID
  buffer.writeUInt32LE(dataSize + 36, 4);        // ChunkSize = 36 + Subchunk2Size
  buffer.write('WAVE', 8);                       // Format

  // fmt sub-chunk
  buffer.write('fmt ', 12);                      // Subchunk1ID
  buffer.writeUInt32LE(16, 16);                  // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);                   // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);         // NumChannels
  buffer.writeUInt32LE(sampleRate, 24);          // SampleRate
  buffer.writeUInt32LE(byteRate, 28);            // ByteRate
  buffer.writeUInt16LE(blockAlign, 32);          // BlockAlign
  buffer.writeUInt16LE(bitsPerSample, 34);       // BitsPerSample

  // data sub-chunk
  buffer.write('data', 36);                      // Subchunk2ID
  buffer.writeUInt32LE(dataSize, 40);            // Subchunk2Size

  return buffer;
}

/**
 * saveAudio
 *
 * Saves 16-bit, mono PCM audio to a .wav file. Works if audio is:
 * 1) A single Buffer/Uint8Array of PCM data, or
 * 2) An array/iterator of objects that contain a `.data.audio` Buffer (similar to your TTSResponse).
 *
 * @param {Buffer|Array} audioBytes - Either a single Buffer of PCM data
 *                                    or an array of { data: { audio: Buffer } } objects.
 * @param {string} filePath - Where to save the .wav file.
 * @param {number} samplingRate - The audio sample rate (e.g., 22050).
 */
export function saveAudio(audioBytes, samplingRate = 22050) {
  let pcmData;

  // Case 1: Already a Buffer
  if (Buffer.isBuffer(audioBytes)) {
    pcmData = audioBytes;

    // Case 2: Array / iterator of objects with { data: { audio: Buffer } }
  } else if (Array.isArray(audioBytes)) {
    // Concatenate all 'audio' buffers
    const buffers = audioBytes.map(entry => {
      if (!entry || !entry.data || !entry.data.audio) {
        throw new Error('Each item in the array must be an object with `data.audio` as a Buffer.');
      }
      return entry.data.audio;
    });
    pcmData = Buffer.concat(buffers);

  } else {
    throw new Error('`audioBytes` must be either a Buffer or an array of objects with `data.audio` Buffers.');
  }

  // Create the 44-byte WAV header
  const header = createWavHeader(pcmData.length, samplingRate);

  // Combine header + PCM data
  const wavBuffer = Buffer.concat([header, pcmData]);

  return wavBuffer;
}
