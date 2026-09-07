import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        # Top Accent Line
        self.setStrokeColor(colors.HexColor("#2563EB"))
        self.setLineWidth(2.5)
        self.line(40, letter[1] - 30, letter[0] - 40, letter[1] - 30)
        
        # Header text
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(40, letter[1] - 24, "9FORMS.COM — EXECUTIVE CONFIGURATION GUIDE")
        
        # Footer
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#94A3B8"))
        self.drawString(40, 25, "Confidential · For Internal Leader & Team Operations · Version 2.0")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 40, 25, page_text)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=45,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_navy = colors.HexColor("#0F172A")
    c_blue = colors.HexColor("#2563EB")
    c_cyan = colors.HexColor("#00B4D8")
    c_slate = colors.HexColor("#334155")
    c_bg = colors.HexColor("#F8FAFC")
    c_border = colors.HexColor("#E2E8F0")

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=c_navy,
        spaceAfter=3
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=c_navy,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12.5,
        textColor=c_slate
    )

    bold_style = ParagraphStyle(
        'BodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12.5,
        textColor=c_navy
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#1E293B")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    story = []

    # Header Title Banner
    story.append(Paragraph("<b>9forms.com</b> &mdash; Executive Setup & Configuration Guide", title_style))
    story.append(Paragraph("Panduan Ringkas, Padat, & Bebas Basa-Basi untuk Pengaturan & Operasional Web App", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=0, spaceAfter=10))

    # 1. RINGKASAN PRODUK
    story.append(Paragraph("1. Ringkasan Eksekutif & Value Proposition", h1_style))
    story.append(Paragraph(
        "<b>9forms.com</b> adalah platform SaaS pembuat formulir percakapan (<i>conversational form builder</i>) bergaya modern (seperti Typeform / Getformly) yang melayani multi-industri: kesehatan, HR, event, edukasi, dan ritel. "
        "Formulir mengusung konsep <b>One Question per Screen</b>, navigasi otomatis (<b>Auto-Advance</b>), dan input suara mandiri (<b>Sticky Voice Mode</b>) yang sangat ramah lansia (<i>zero cognitive load</i>).",
        body_style
    ))
    story.append(Spacer(1, 8))

    # 2. STRUKTUR RUTE LIVE
    story.append(Paragraph("2. Struktur Rute & Alamat Web App", h1_style))
    routes_data = [
        [Paragraph("Rute URL", table_header_style), Paragraph("Fungsi & Tampilan Halaman", table_header_style), Paragraph("Keterangan Operasional", table_header_style)],
        [Paragraph("<b>/</b>", code_style), Paragraph("Landing Page Utama 9forms.com (Multi-Industri)", body_style), Paragraph("Showcase SaaS, 6 kategori industri, link demo, dan portal admin.", body_style)],
        [Paragraph("<b>/intake?form=new-patient-intake</b>", code_style), Paragraph("Demo 1: Form Pasien Baru (Ramah Lansia)", body_style), Paragraph("1 tombol mulai raksasa, tanpa ketik nama di awal, auto-advance.", body_style)],
        [Paragraph("<b>/intake?form=knee-pain-assessment</b>", code_style), Paragraph("Demo 2: Asesmen Nyeri Lutut (Klinis)", body_style), Paragraph("Skala nyeri 0–10 1-tap, pertanyaan ya/tidak, triase risiko otomatis.", body_style)],
        [Paragraph("<b>/admin</b>", code_style), Paragraph("Admin Portal & Form Builder 1:1", body_style), Paragraph("Login <code>admin@9forms.com</code> / <code>demo123</code>. Kelola form & submissions.", body_style)],
        [Paragraph("<b>/spring-hope</b>", code_style), Paragraph("Landing Page Lama Klinik (Arsip v1.0)", body_style), Paragraph("Tersimpan utuh untuk kebutuhan referensi klinis lama.", body_style)],
    ]
    t_routes = Table(routes_data, colWidths=[150, 200, 180])
    t_routes.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_bg]),
    ]))
    story.append(t_routes)
    story.append(Spacer(1, 10))

    # 3. PANDUAN PENGATURAN FORM
    story.append(Paragraph("3. Cara Leader Mengatur & Menambah Formulir", h1_style))
    story.append(Paragraph("Tersedia 2 metode mudah untuk menambah atau mengubah formulir:", body_style))
    story.append(Spacer(1, 4))
    
    form_guide_data = [
        [Paragraph("Metode", table_header_style), Paragraph("Langkah & Cara Kerja", table_header_style)],
        [
            Paragraph("<b>A. Via Admin Portal<br/>(No-Code)</b>", body_style),
            Paragraph("1. Masuk ke <code>/admin</code> lalu klik tombol <b>+ New Form</b>.<br/>"
                      "2. Pilih <b>AI-Assisted</b> (cukup ketik kebutuhan form) atau <b>Standard Builder</b>.<br/>"
                      "3. Tambah pertanyaan, pilih tipe (Choice / Yes-No / Scale 0-10 / Text), dan atur bobot skor.<br/>"
                      "4. Klik <b>Publish</b> untuk mendapatkan link unik formulir yang langsung aktif.", body_style)
        ],
        [
            Paragraph("<b>B. Via File Kode<br/>(Programmatic)</b>", body_style),
            Paragraph("1. Buka file <code>src/lib/patientform.ts</code>.<br/>"
                      "2. Tambahkan objek form baru dengan struktur pertanyaan, terjemahan (EN/ID/ZH), dan kata kunci suara (<code>aliases</code>).<br/>"
                      "3. Sistem otomatis mengaktifkan form di web app tanpa perlu utak-atik CSS.", body_style)
        ]
    ]
    t_form_guide = Table(form_guide_data, colWidths=[130, 400])
    t_form_guide.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_blue),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_bg]),
    ]))
    story.append(t_form_guide)
    story.append(Spacer(1, 10))

    # 4. FITUR SUARA & UX MANULA
    story.append(Paragraph("4. Pengoperasian Fitur Suara (Voice Engine) & UX Manula", h1_style))
    voice_points = [
        ("Mikrofon Nyala Terus (Continuous)", "Mikrofon tidak mati-mati sendiri. Jika responden hening, koneksi suara tetap terjaga otomatis tanpa menekan tombol berulang kali."),
        ("Pengenalan Kata Alami & Fleksibel", "Mendukung penyebutan huruf ('Opsi A', 'B'), angka umur ('tujuh puluh tahun'), durasi ('sebulan'), kata 'Ya/Tidak', dan istilah keluhan ('lutut', 'bengkak', 'jalan sendiri')."),
        ("Koreksi Suara Instan (Debounce Override)", "Jika responden keliru bicara dan meralat ucapannya, timer auto-advance seketika batal dan jawaban langsung berganti ke kata yang baru."),
        ("Zero Friction Screen", "Layar awal manula 100% bebas dari form ketik dan kotak-kotak penjelasan yang membingungkan. Cukup 1 tombol besar 'Mulai Sekarang'.")
    ]
    
    voice_table_data = [[Paragraph("Fitur Utama", table_header_style), Paragraph("Mekanisme & Keuntungan Pengguna", table_header_style)]]
    for title, desc in voice_points:
        voice_table_data.append([Paragraph(f"<b>{title}</b>", body_style), Paragraph(desc, body_style)])
    
    t_voice = Table(voice_table_data, colWidths=[160, 370])
    t_voice.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_bg]),
    ]))
    story.append(t_voice)
    story.append(Spacer(1, 10))

    # 5. INTEGRASI & SINKRONISASI DATA SUBMISSION
    story.append(Paragraph("5. Alur Data & Sinkronisasi Real-Time", h1_style))
    story.append(Paragraph(
        "&bull; <b>Auto-Sync ke Admin:</b> Begitu responden menyelesaikan pertanyaan terakhir dan tiba di halaman sukses, hasil jawaban, skor risiko (Low/Mod/High), dan nama otomatis masuk ke tabel <code>/admin</code>.<br/>"
        "&bull; <b>Identitas Pasien Dinamis:</b> Jika responden mengisi nama di pertanyaan nama, admin mencatat nama aslinya. Jika dilewati/dikosongkan, admin mencatat sebagai <code>Pasien</code>.<br/>"
        "&bull; <b>Export CSV:</b> Di menu Submissions admin, klik tombol <b>Export CSV</b> untuk mengunduh seluruh data jawaban pasien ke file spreadsheet Excel/CSV.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # 6. CHEAT SHEET PERINTAH GIT (DEPLOY & RUN)
    story.append(Paragraph("6. Perintah Standar Menjalankan & Deploy", h1_style))
    
    cmd_data = [
        [Paragraph("Tujuan", table_header_style), Paragraph("Perintah Terminal (Git Bash / PowerShell)", table_header_style)],
        [Paragraph("<b>Menjalankan Lokal</b>", body_style), Paragraph("<code>npm run dev</code> &rarr; buka <code>http://localhost:8080</code> di Chrome/Edge.", code_style)],
        [Paragraph("<b>Deploy ke Web Live</b>", body_style), Paragraph("<code>git add . && git commit -m \"update\" && git push origin main</code>", code_style)],
        [Paragraph("<b>Format & Cek Error</b>", body_style), Paragraph("<code>npm run format && npm run lint && npm run build</code>", code_style)],
        [Paragraph("<b>Ganti Logo Baru</b>", body_style), Paragraph("Cukup ganti file gambar di <code>public/logo-mark.webp</code> (format WebP transparan).", body_style)]
    ]
    t_cmd = Table(cmd_data, colWidths=[130, 400])
    t_cmd.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_bg]),
    ]))
    story.append(t_cmd)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated: {filename}")

if __name__ == '__main__':
    out_pdf = r"D:\data C\Download\9forms-Setup-Guidance-Leader.pdf"
    build_pdf(out_pdf)
