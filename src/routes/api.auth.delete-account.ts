import { createFileRoute } from "@tanstack/react-router";
import {
  authenticateRequest,
  clearSessionCookieHeader,
  deleteSession,
  parseSessionCookie,
  verifyPassword,
} from "../lib/auth";
import { dbExecute, dbQueryOne } from "../lib/db";

export const Route = createFileRoute("/api/auth/delete-account")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const user = await authenticateRequest(request);
          if (!user) {
            return Response.json(
              {
                success: false,
                error: "UNAUTHORIZED",
                message: "Sesi telah berakhir. Silakan login kembali.",
              },
              { status: 401 },
            );
          }

          const body = (await request.json().catch(() => null)) as { password?: string } | null;
          const password = body?.password;

          if (!password || typeof password !== "string") {
            return Response.json(
              {
                success: false,
                error: "MISSING_PASSWORD",
                message: "Kata sandi wajib diisi untuk konfirmasi penghapusan akun.",
              },
              { status: 400 },
            );
          }

          // Fetch stored password hash
          const adminRow = await dbQueryOne<{ id: string; email: string; password_hash: string; role: string }>(
            "SELECT id, email, password_hash, role FROM admins WHERE id = ?",
            [user.adminId],
          );

          if (!adminRow) {
            return Response.json(
              {
                success: false,
                error: "USER_NOT_FOUND",
                message: "Data akun tidak ditemukan di server.",
              },
              { status: 404 },
            );
          }

          // Protect primary superadmin account
          if (adminRow.email === "admin@gmail.com" || adminRow.email === "admin@9forms.com") {
            return Response.json(
              {
                success: false,
                error: "FORBIDDEN",
                message: "Akun Super Administrator master tidak dapat dihapus.",
              },
              { status: 403 },
            );
          }

          // Verify password
          const isValid = await verifyPassword(password, adminRow.password_hash);
          if (!isValid) {
            return Response.json(
              {
                success: false,
                error: "INVALID_PASSWORD",
                message: "Kata sandi yang Anda masukkan salah. Penghapusan akun dibatalkan.",
              },
              { status: 400 },
            );
          }

          // Perform full cascade deletion
          await dbExecute("DELETE FROM admins WHERE id = ?", [user.adminId]);
          await dbExecute("DELETE FROM sessions WHERE admin_id = ?", [user.adminId]);
          await dbExecute("DELETE FROM forms WHERE user_id = ? OR user_id = ?", [user.adminId, user.email]);
          await dbExecute("DELETE FROM submissions WHERE user_id = ? OR user_id = ?", [user.adminId, user.email]);

          const token = parseSessionCookie(request);
          if (token) {
            await deleteSession(token).catch(() => {});
          }

          const clearCookie = clearSessionCookieHeader();

          return Response.json(
            {
              success: true,
              message: "Akun Anda dan seluruh data formulir berhasil dihapus permanen.",
            },
            {
              headers: {
                "Set-Cookie": clearCookie,
              },
            },
          );
        } catch (err) {
          console.error("Delete account error:", err);
          return Response.json(
            {
              success: false,
              error: "INTERNAL_ERROR",
              message: "Gagal memproses penghapusan akun. Silakan coba lagi.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
