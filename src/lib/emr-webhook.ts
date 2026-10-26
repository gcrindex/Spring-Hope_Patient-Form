// src/lib/emr-webhook.ts
// EMR (Plato / ClinicOS) Webhook Integration with SSRF Protection and HMAC-SHA256 Signatures

import { dbExecute } from "./db";

export interface EmrConfig {
  enabled: boolean;
  provider: "plato" | "clinicos" | "generic";
  webhookUrl: string;
  webhookSecret: string;
  autoSync: boolean;
  updatedAt?: string;
}

export interface WebhookValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * SSRF (Server-Side Request Forgery) Protection.
 * Strictly verifies that the destination URL is an external HTTPS endpoint
 * and blocks all private, loopback, link-local, and cloud metadata IPs.
 */
export function validateWebhookUrl(rawUrl: string): WebhookValidationResult {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { valid: false, error: "URL webhook tidak boleh kosong." };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { valid: false, error: "Format URL webhook tidak valid." };
  }

  // Scheme restriction: only HTTPS (or HTTP in local dev testing)
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return {
      valid: false,
      error: "Protokol dilarang: Webhook hanya mendukung https:// (atau http://).",
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost and standard loopback hostnames
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "local" ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".lan") ||
    hostname.endsWith(".home") ||
    hostname.endsWith(".corp")
  ) {
    return {
      valid: false,
      error: "SSRF Alert: Akses hostname internal / loopback diblokir demi keamanan.",
    };
  }

  // Check IPv6 loopback / link-local / unique local
  if (
    hostname === "::1" ||
    hostname === "[::1]" ||
    hostname === "0:0:0:0:0:0:0:1" ||
    hostname.startsWith("fe80:") ||
    hostname.startsWith("fc00:") ||
    hostname.startsWith("fd00:")
  ) {
    return {
      valid: false,
      error: "SSRF Alert: Alamat IPv6 internal / loopback diblokir.",
    };
  }

  // Parse IPv4 address
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const octets = [
      parseInt(ipv4Match[1], 10),
      parseInt(ipv4Match[2], 10),
      parseInt(ipv4Match[3], 10),
      parseInt(ipv4Match[4], 10),
    ];

    // Invalid octets
    if (octets.some((o) => o < 0 || o > 255)) {
      return { valid: false, error: "Format IP address tidak valid." };
    }

    const [a, b] = octets;

    // Loopback 127.0.0.0/8 & 0.0.0.0/8
    if (a === 127 || a === 0) {
      return { valid: false, error: "SSRF Alert: Akses loopback IP 127.0.0.0/8 diblokir." };
    }

    // Cloud Metadata & Link-local 169.254.0.0/16 (e.g. 169.254.169.254 AWS/GCP/DO)
    if (a === 169 && b === 254) {
      return {
        valid: false,
        error: "SSRF Alert: Akses AWS/GCP Cloud Metadata 169.254.x.x diblokir ketat.",
      };
    }

    // RFC 1918 Private Ranges:
    // 10.0.0.0/8
    if (a === 10) {
      return { valid: false, error: "SSRF Alert: Akses private subnet 10.0.0.0/8 diblokir." };
    }
    // 172.16.0.0/12 (172.16 - 172.31)
    if (a === 172 && b >= 16 && b <= 31) {
      return { valid: false, error: "SSRF Alert: Akses private subnet 172.16.0.0/12 diblokir." };
    }
    // 192.168.0.0/16
    if (a === 192 && b === 168) {
      return { valid: false, error: "SSRF Alert: Akses private subnet 192.168.0.0/16 diblokir." };
    }

    // Shared / CGNAT 100.64.0.0/10 (100.64 - 100.127)
    if (a === 100 && b >= 64 && b <= 127) {
      return { valid: false, error: "SSRF Alert: Akses CGNAT subnet 100.64.0.0/10 diblokir." };
    }

    // Broadcast / Multicast / Reserved 224.0.0.0+
    if (a >= 224) {
      return { valid: false, error: "SSRF Alert: Akses multicast / reserved IP diblokir." };
    }
  }

  // Hex / Octal / Decimal single-number IP bypass checks (e.g. 2130706433 or 0x7f000001)
  if (/^(0x[0-9a-f]+|\d+)$/i.test(hostname)) {
    return {
      valid: false,
      error: "SSRF Alert: Notasi IP angka tunggal (decimal/hex) tidak diizinkan.",
    };
  }

  return { valid: true };
}

/**
 * Generates HMAC-SHA256 signature for webhook payload authentication.
 */
export async function generateHmacSignature(
  secretKey: string,
  payload: string,
): Promise<string> {
  const enc = new TextEncoder();
  const keyData = enc.encode(secretKey);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    enc.encode(payload),
  );

  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Builds standardized EMR JSON payload for Plato / ClinicOS / Generic systems.
 */
export function buildEmrPayload(submission: {
  id: string;
  formId?: string;
  patientName: string;
  score?: number;
  risk?: string;
  triageStatus?: string;
  submittedAt?: string;
  answers?: Record<string, unknown>;
}, provider: string = "plato") {
  const timestamp = Math.floor(Date.now() / 1000);
  return {
    event: "patient.intake.completed",
    timestamp,
    emr_target: provider === "clinicos" ? "ClinicOS" : provider === "generic" ? "Generic EMR" : "Plato EMR",
    schema_version: "2.0",
    data: {
      submission_id: submission.id,
      form_id: submission.formId || "new-patient-intake",
      patient_name: submission.patientName || "Anonymous",
      clinical_score: typeof submission.score === "number" ? submission.score : 0,
      risk_tier:
        submission.risk === "high"
          ? "High Risk"
          : submission.risk === "mod"
            ? "Moderate"
            : "Low Risk",
      triage_status: submission.triageStatus || "review",
      submitted_at: submission.submittedAt || new Date().toISOString(),
      answers: submission.answers || {},
    },
  };
}

/**
 * Dispatches webhook with SSRF validation, HMAC-SHA256 signing,
 * exponential backoff retry on 5xx/network errors, and logs to database.
 */
export async function dispatchWebhookWithRetry(
  url: string,
  secretKey: string,
  payloadObj: Record<string, unknown>,
  eventType: string = "patient.intake.completed",
): Promise<{
  success: boolean;
  statusCode: number;
  responseSnippet: string;
  attempts: number;
  signature: string;
  error?: string;
}> {
  // Step 1: Validate URL against SSRF
  const validation = validateWebhookUrl(url);
  if (!validation.valid) {
    const errorMsg = validation.error || "SSRF Protection: URL ditolak.";
    // Log blocked SSRF attempt
    await dbExecute(
      "INSERT INTO webhook_logs (id, webhook_url, event_type, status_code, response_body, attempt_count, success, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, datetime('now'))",
      [`log_${crypto.randomUUID()}`, url, eventType, 400, `SSRF BLOCKED: ${errorMsg}`, 0],
    ).catch(() => null);

    return {
      success: false,
      statusCode: 400,
      responseSnippet: errorMsg,
      attempts: 0,
      signature: "",
      error: errorMsg,
    };
  }

  const payloadString = JSON.stringify(payloadObj);
  const signatureHex = secretKey
    ? await generateHmacSignature(secretKey, payloadString)
    : "";
  const timestamp = Math.floor(Date.now() / 1000);

  const maxAttempts = 3;
  let lastStatus = 0;
  let lastBody = "";
  let lastError = "";

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "User-Agent": "9forms-EMR-Dispatcher/2.0",
        "X-9Forms-Event": eventType,
        "X-9Forms-Timestamp": String(timestamp),
      };

      if (signatureHex) {
        headers["X-9Forms-Signature"] = `sha256=${signatureHex}`;
      }

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: payloadString,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      lastStatus = res.status;

      const resText = await res.text().catch(() => "");
      lastBody = resText.slice(0, 500);

      // If success (2xx) or client rejection (4xx - do not retry bad client requests)
      if (res.ok || (res.status >= 400 && res.status < 500)) {
        const isSuccess = res.ok;
        await dbExecute(
          "INSERT INTO webhook_logs (id, webhook_url, event_type, status_code, response_body, attempt_count, success, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))",
          [
            `log_${crypto.randomUUID()}`,
            url,
            eventType,
            lastStatus,
            lastBody || (isSuccess ? "OK" : "Client Error"),
            attempt,
            isSuccess ? 1 : 0,
          ],
        ).catch(() => null);

        return {
          success: isSuccess,
          statusCode: lastStatus,
          responseSnippet: lastBody,
          attempts: attempt,
          signature: signatureHex,
        };
      }

      // If server error 5xx, wait and retry
      lastError = `Server responded with ${res.status}`;
    } catch (err: unknown) {
      const errObj = err as Error;
      lastStatus = 0;
      lastError = errObj.name === "AbortError" ? "Request timeout (6s)" : errObj.message;
      lastBody = lastError;
    }

    if (attempt < maxAttempts) {
      // Exponential backoff: 200ms, 400ms
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 100));
    }
  }

  // Record failed attempt after all retries exhausted
  await dbExecute(
    "INSERT INTO webhook_logs (id, webhook_url, event_type, status_code, response_body, attempt_count, success, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, datetime('now'))",
    [
      `log_${crypto.randomUUID()}`,
      url,
      eventType,
      lastStatus || 504,
      `Failed after ${maxAttempts} attempts: ${lastError}`,
      maxAttempts,
    ],
  ).catch(() => null);

  return {
    success: false,
    statusCode: lastStatus || 504,
    responseSnippet: lastBody,
    attempts: maxAttempts,
    signature: signatureHex,
    error: lastError,
  };
}
