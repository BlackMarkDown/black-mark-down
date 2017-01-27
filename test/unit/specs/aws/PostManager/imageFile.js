const contentType = 'image/png';
const base64ImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
const decodedString = atob(base64ImageData);

const decodedAsciiNumber = new Array(decodedString.length);

for (let i = 0; i < decodedString.length; i += 1) {
  decodedAsciiNumber[i] = decodedString.charCodeAt(i);
}

const byteArray = new Uint8Array(decodedAsciiNumber);

const blob = new Blob([byteArray], { type: contentType });
const file = new File([blob], 'test.png', {
  type: contentType,
  lastModified: Date.now(),
});

export default file;
