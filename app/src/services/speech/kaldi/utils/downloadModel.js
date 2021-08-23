async function trackedDownload(url, chunkCallback) {
  const response = await fetch(url);
  const reader = response.body.getReader();
  const contentLength = +response.headers.get('Content-Length');
  let receivedLength = 0;
  const chunks = [];

  // eslint-disable-next-line no-constant-condition
  while (true) { // for await ... of is not widely supported
    // eslint-disable-next-line no-await-in-loop
    const { done, value: chunk } = await reader.read();
    if (done) break;
    chunks.push(chunk);
    receivedLength += chunk.length;
    chunkCallback(receivedLength / contentLength);
  }

  const allChunks = new Uint8Array(receivedLength);
  let position = 0;
  chunks.forEach((chunk) => {
    allChunks.set(chunk, position);
    position += chunk.length;
  });
  return allChunks;
}

export { trackedDownload };
