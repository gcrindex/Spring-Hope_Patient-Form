// src/lib/crypto.ts
// AES-256-GCM Encryption at Rest for sensitive clinical & patient health data

const SECRET_KEY_RAW =
  process.env["SESSION_SECRET"] ||
  "e7b4c91a03f84826d79e62c19b0f4a8e52c938d74a1f6305b8219c67ea9f2501";

let cryptoKeyPromise: Promise<CryptoKey> | null = null;

async function getEncryptionKey(): Promise<CryptoKey> {
  if (cryptoKeyPromise) return cryptoKeyPromise;

  cryptoKeyPromise = (async () => {
    const enc = new TextEncoder();
    const keyBytes = enc.encode(SECRET_KEY_RAW);
    const hashBuffer = await crypto.subtle.digest("SHA-256", keyBytes);
    return await crypto.subtle.importKey(
      "raw",
      hashBuffer,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );
  })();

  return cryptoKeyPromise;
}

export async function encryptData(plaintext: string): Promise<string> {
  if (!plaintext) return "";
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const encodedData = enc.encode(plaintext);

  const ciphertextBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedData);

  const ivHex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const cipherHex = Array.from(new Uint8Array(ciphertextBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `enc:${ivHex}:${cipherHex}`;
}

export async function decryptData(encryptedPayload: string): Promise<string> {
  if (!encryptedPayload) return "";
  if (!encryptedPayload.startsWith("enc:")) {
    // If plaintext backward-compat legacy record
    return encryptedPayload;
  }

  const parts = encryptedPayload.split(":");
  if (parts.length !== 3) return encryptedPayload;

  const ivHex = parts[1];
  const cipherHex = parts[2];

  const iv = new Uint8Array(ivHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []);
  const cipherBytes = new Uint8Array(
    cipherHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || [],
  );

  const key = await getEncryptionKey();
  const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipherBytes);

  const dec = new TextDecoder();
  return dec.decode(decryptedBuffer);
}
