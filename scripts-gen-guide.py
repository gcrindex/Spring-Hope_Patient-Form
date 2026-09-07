# -*- coding: utf-8 -*-
"""Generate 9forms.com Newbie Guidance PDF - concise, for team lead."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)

OUT = r"D:\data C\Download\9forms-setup-guide.pdf"

PRIMARY = HexColor("#1B2A4A")
ACCENT = HexColor("#00B4D8")
TEXT = HexColor("#1A1F2E")
MUTED = HexColor("#5A6478")
LIGHT = HexColor("#F4F6F9")
BORDER = HexColor("#D8DEE8")

styles = {
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=22, textColor=PRIMARY, spaceAfter=2),
    "subtitle": ParagraphStyle("subtitle", fontName="Helvetica", fontSize=10.5, textColor=MUTED, spaceAfter=10),
    "h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=13, textColor=PRIMARY, spaceBefore=12, spaceAfter=4),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10, textColor=TEXT, leading=14, spaceAfter=4),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=10, textColor=TEXT, leading=14, leftIndent=10, spaceAfter=2),
    "code": ParagraphStyle("code", fontName="Courier-Bold", fontSize=9.5, textColor=PRIMARY, leading=13, spaceAfter=2),
    "note": ParagraphStyle("note", fontName="Helvetica-Oblique", fontSize=9, textColor=MUTED, leading=12, spaceAfter=4),
}

def bullet(text):
    return Paragraph(f"&bull;&nbsp;&nbsp;{text}", styles["bullet"])

def code(text):
    return Paragraph(text, styles["code"])

doc = SimpleDocTemplate(
    OUT, pagesize=A4,
    leftMargin=16*mm, rightMargin=16*mm, topMargin=16*mm, bottomMargin=16*mm,
    title="9forms.com — Setup Guide",
    author="9forms.com Team",
    subject="Newbie guidance setup 9forms.com",
)

story = []

# Header
story.append(Paragraph("9forms.com — Setup Guide", styles["title"]))
story.append(Paragraph("Panduan cepat menjalankan & mengelola web app 9forms.com (Smart Form Builder)", styles["subtitle"]))
story.append(HRFlowable(width="100%", thickness=1, color=ACCENT, spaceAfter=8))

# 1. Jalankan
story.append(Paragraph("1. Menjalankan di Komputer Lokal", styles["h1"]))
story.append(bullet("Buka terminal (Git Bash / PowerShell), masuk ke folder project:"))
story.append(code('cd "D:\\data C\\Download\\springhope-project_2.0"'))
story.append(bullet("Install dependency — hanya pertama kali:"))
story.append(code("npm install"))
story.append(bullet("Jalankan aplikasi:"))
story.append(code("npm run dev"))
story.append(bullet("Buka <b>http://localhost:8080</b> di Chrome (disarankan — fitur suara paling stabil di Chrome/Edge)."))
story.append(Spacer(1, 4))

# 2. Halaman penting
story.append(Paragraph("2. Halaman Penting", styles["h1"]))
url_rows = [
    [Paragraph("<b>Halaman</b>", styles["body"]), Paragraph("<b>URL</b>", styles["body"])],
    [Paragraph("Landing page 9forms.com", styles["body"]), code("/")],
    [Paragraph("Demo 1 — Form Pasien Baru (ramah manula)", styles["body"]), code("/intake?form=new-patient-intake")],
    [Paragraph("Demo 2 — Asesmen Nyeri Lutut", styles["body"]), code("/intake?form=knee-pain-assessment")],
    [Paragraph("Admin portal", styles["body"]), code("/admin")],
    [Paragraph("Landing lama v1.0 (arsip)", styles["body"]), code("/spring-hope")],
]
t = Table(url_rows, colWidths=[95*mm, 75*mm])
t.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), LIGHT),
    ("GRID", (0,0), (-1,-1), 0.5, BORDER),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING", (0,0), (-1,-1), 4),
    ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ("LEFTPADDING", (0,0), (-1,-1), 6),
]))
story.append(t)
story.append(Spacer(1, 4))
story.append(Paragraph("Login admin: email <b>admin@9forms.com</b> / password <b>demo123</b> (sudah terisi, tinggal klik Sign In).", styles["note"]))
story.append(Spacer(1, 4))

# 3. Struktur folder
story.append(Paragraph("3. File yang Perlu Dikenal", styles["h1"]))
files_rows = [
    [Paragraph("<b>File</b>", styles["body"]), Paragraph("<b>Fungsi</b>", styles["body"])],
    [code("src/lib/patientform.ts"), Paragraph("Definisi form, pertanyaan, skor, penyimpanan data", styles["body"])],
    [code("src/lib/translations.ts"), Paragraph("Teks multi-bahasa (EN / ID / 中文)", styles["body"])],
    [code("src/routes/index.tsx"), Paragraph("Landing page 9forms.com", styles["body"])],
    [code("src/routes/intake.*.tsx"), Paragraph("Alur form pasien: mulai, pertanyaan, selesai", styles["body"])],
    [code("src/hooks/use-speech-recognition.ts"), Paragraph("Mesin pengenalan suara", styles["body"])],
    [code("public/admin.html"), Paragraph("Portal admin (dashboard, builder, submissions)", styles["body"])],
    [code("public/logo-mark.webp"), Paragraph("Logo 9forms.com (format WebP)", styles["body"])],
]
t2 = Table(files_rows, colWidths=[70*mm, 100*mm])
t2.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), LIGHT),
    ("GRID", (0,0), (-1,-1), 0.5, BORDER),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING", (0,0), (-1,-1), 4),
    ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ("LEFTPADDING", (0,0), (-1,-1), 6),
]))
story.append(t2)
story.append(Spacer(1, 6))

# 4. Edit pertanyaan form
story.append(Paragraph("4. Mengubah / Menambah Pertanyaan Form", styles["h1"]))
story.append(bullet("Buka <b>src/lib/patientform.ts</b>, cari <b>newPatientForm</b> (Demo 1) atau <b>kneePainForm</b> (Demo 2)."))
story.append(bullet("Tipe pertanyaan: <b>choice</b> (pilihan), <b>yesno</b> (ya/tidak), <b>scale</b> (skala 0–10), <b>text</b> (isian)."))
story.append(bullet("<b>aliases</b> = kata yang dikenali saat pasien menjawab lewat suara."))
story.append(bullet("<b>score</b> = bobot skor untuk triase risiko (Low / Moderate / High)."))
story.append(bullet("Setelah edit, refresh browser — perubahan langsung terlihat."))
story.append(Spacer(1, 4))

# 5. Ganti logo
story.append(Paragraph("5. Mengganti Logo", styles["h1"]))
story.append(bullet("Siapkan logo format <b>WebP transparan</b>."))
story.append(bullet("Timpa file <b>public/logo-mark.webp</b> (nama file harus sama)."))
story.append(bullet("Logo otomatis ter-update di landing page, form, dan admin."))
story.append(Spacer(1, 4))

# 6. Deploy
story.append(Paragraph("6. Deploy / Update ke GitHub", styles["h1"]))
story.append(code('cd "D:\\data C\\Download\\springhope-project_2.0"'))
story.append(code("git add ."))
story.append(code('git commit -m "update: deskripsi perubahan"'))
story.append(code("git push origin main"))
story.append(bullet("Jika error <b>port 443 / timeout</b>: ulangi perintah push (gangguan jaringan sesaat)."))
story.append(bullet("Jangan gunakan <b>git push --force</b>."))
story.append(Spacer(1, 4))

# 7. Backup
story.append(Paragraph("7. Backup", styles["h1"]))
story.append(bullet('Backup terbaru selalu tersedia: <b>D:\\data C\\Download\\springhope-project_2.0.zip</b>'))
story.append(bullet("Di komputer baru: ekstrak ZIP → npm install → npm run dev."))
story.append(Spacer(1, 8))
story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceAfter=4))
story.append(Paragraph("9forms.com — Smart Form Builder &amp; Workflows", styles["note"]))

doc.build(story)
print("PDF generated:", OUT)
