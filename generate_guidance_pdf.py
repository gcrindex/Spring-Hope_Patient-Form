import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
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
        self.drawString(40, letter[1] - 24, "9FORMS.COM — NEWBIE GUIDANCE & SETUP MANUAL")
        
        # Footer
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#94A3B8"))
        self.drawString(40, 25, "Dokumentasi & Panduan Pemula (Newbie Guidance) · 9forms.com")
        page_text = f"Halaman {self._pageNumber} dari {page_count}"
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
    
    # Color Palette
    c_navy = colors.HexColor("#0F172A")
    c_blue = colors.HexColor("#2563EB")
    c_slate = colors.HexColor("#334155")
    c_bg = colors.HexColor("#F8FAFC")
    c_border = colors.HexColor("#E2E8F0")

    # Typography
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
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=c_navy,
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=c_slate
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

    # Title Banner
    story.append(Paragraph("<b>Newbie Guidance</b> &mdash; Setup & Konfigurasi 9forms.com", title_style))
    story.append(Paragraph("Panduan Langkah Demi Langkah Menjalankan, Mengatur, dan Mengoperasikan Web App 9forms.com", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=0, spaceAfter=8))

    # 1. PENGANTAR & KONSEP
    story.append(Paragraph("1. Konsep Dasar 9forms.com", h1_style))
    story.append(Paragraph(
        "<b>9forms.com</b> adalah platform SaaS pembuat formulir percakapan (<i>conversational form</i>) multi-industri. "
        "Menggunakan konsep <b>One Question per Screen</b>, <b>Auto-Advance</b> (otomatis lanjut soal setelah dijawab), dan <b>Sticky Voice Answering</b> (suara aktif otomatis). "
        "Tersedia portal admin no-code lengkap untuk membuat formulir baru, melihat submissions, dan ekspor data.",
        body_style
    ))
    story.append(Spacer(1, 4))

    # 2. CARA MENJALANKAN DI KOMPUTER LOKAL
    story.append(Paragraph("2. Cara Menjalankan Aplikasi di Lokal (Local Setup)", h1_style))
    run_steps_data = [
        [Paragraph("Langkah", table_header_style), Paragraph("Perintah Terminal (Git Bash / PowerShell)", table_header_style), Paragraph("Keterangan", table_header_style)],
        [Paragraph("<b>1. Buka Folder</b>", body_style), Paragraph("<code>cd \"D:\\data C\\Download\\springhope-project_2.0\"</code>", code_style), Paragraph("Masuk ke direktori project.", body_style)],
        [Paragraph("<b>2. Install Dependencies</b>", body_style), Paragraph("<code>npm install</code>", code_style), Paragraph("Hanya perlu dijalankan di awal / saat ada package baru.", body_style)],
        [Paragraph("<b>3. Jalankan Server</b>", body_style), Paragraph("<code>npm run dev</code>", code_style), Paragraph("Aplikasi aktif di <code>http://localhost:8080</code>.", body_style)],
        [Paragraph("<b>4. Buka di Browser</b>", body_style), Paragraph("Akses <code>http://localhost:8080</code>", code_style), Paragraph("Disarankan Google Chrome / Edge untuk fitur suara optimal.", body_style)],
    ]
    t_run = Table(run_steps_data, colWidths=[100, 240, 190])
    t_run.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_bg]),
    ]))
    story.append(t_run)
    story.append(Spacer(1, 6))

    # 3. PETA HALAMAN UTAMA
    story.append(Paragraph("3. Peta Halaman & Akses URL", h1_style))
    url_data = [
        [Paragraph("Halaman", table_header_style), Paragraph("URL Path", table_header_style), Paragraph("Fungsi & Konten", table_header_style)],
        [Paragraph("<b>Landing Page</b>", body_style), Paragraph("<code>/</code>", code_style), Paragraph("Halaman utama 9forms.com (showcase SaaS multi-industri).", body_style)],
        [Paragraph("<b>Demo 1: Pasien Baru</b>", body_style), Paragraph("<code>/intake?form=new-patient-intake</code>", code_style), Paragraph("Form ramah lansia: 1 tombol mulai, tanpa ketik nama di awal.", body_style)],
        [Paragraph("<b>Demo 2: Nyeri Lutut</b>", body_style), Paragraph("<code>/intake?form=knee-pain-assessment</code>", code_style), Paragraph("Asesmen klinis: skala nyeri 0–10, pertanyaan ya/tidak, triase risiko.", body_style)],
        [Paragraph("<b>Admin Portal</b>", body_style), Paragraph("<code>/admin</code>", code_style), Paragraph("Login: <code>admin@9forms.com</code> / <code>demo123</code>. Kelola form & hasil data.", body_style)],
        [Paragraph("<b>Arsip Landing Lama</b>", body_style), Paragraph("<code>/spring-hope</code>", code_style), Paragraph("Landing page versi 1.0 (tersimpan aman untuk arsip).", body_style)],
    ]
    t_url = Table(url_data, colWidths=[110, 190, 230])
    t_url.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_blue),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_bg]),
    ]))
    story.append(t_url)
    story.append(Spacer(1, 6))

    # 4. CARA MEMBUAT & MENGELOLA FORMULIR BARU
    story.append(Paragraph("4. Cara Membuat & Mengelola Formulir Baru", h1_style))
    form_create_data = [
        [Paragraph("Cara", table_header_style), Paragraph("Langkah Praktis", table_header_style)],
        [
            Paragraph("<b>Pakai AI Builder<br/>(Paling Cepat)</b>", body_style),
            Paragraph("1. Masuk <code>/admin</code> &rarr; klik <b>+ New Form</b> &rarr; pilih <b>AI-Assisted</b>.<br/>"
                      "2. Ketik kebutuhan Anda (contoh: <i>'Survei kepuasan pelanggan restoran'</i> atau <i>'Pendaftaran workshop'</i>).<br/>"
                      "3. AI langsung membuatkan draf pertanyaan lengkap. Klik <b>Use This Form</b> &rarr; form langsung masuk builder.", body_style)
        ],
        [
            Paragraph("<b>Manual Builder<br/>(Standard)</b>", body_style),
            Paragraph("1. Masuk <code>/admin</code> &rarr; klik <b>+ New Form</b> &rarr; pilih <b>Standard Builder</b>.<br/>"
                      "2. Ganti judul formulir, klik <b>+ Add Question</b>, pilih tipe pertanyaan (Choice / Scale 0-10 / Yes-No / Text).<br/>"
                      "3. Atur bobot skor tiap opsi &rarr; lihat live preview di sebelah kanan &rarr; klik <b>Publish</b>.", body_style)
        ],
        [
            Paragraph("<b>Via File Kode<br/>(Developer)</b>", body_style),
            Paragraph("Edit file <code>src/lib/patientform.ts</code> untuk menambah objek form baru beserta kata kunci suara (<code>aliases</code>).", body_style)
        ]
    ]
    t_create = Table(form_create_data, colWidths=[110, 420])
    t_create.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_bg]),
    ]))
    story.append(t_create)
    story.append(Spacer(1, 6))

    # 5. CARA MELIHAT DATA & EXPORT EXCEL/CSV
    story.append(Paragraph("5. Melihat Hasil Pengisian & Ekspor Data (Submissions)", h1_style))
    story.append(Paragraph(
        "&bull; <b>Sinkronisasi Otomatis:</b> Begitu responden menyelesaikan pertanyaan dan masuk halaman selesai, data jawaban dan skor risiko otomatis masuk ke Admin tanpa perlu klik tombol tambahan.<br/>"
        "&bull; <b>Melihat Detail Jawaban:</b> Di Admin, klik menu <b>Submissions</b> &rarr; klik tombol <b>View</b> pada baris nama pasien untuk melihat rincian jawaban per pertanyaan.<br/>"
        "&bull; <b>Ekspor ke Excel/CSV:</b> Klik tombol <b>Export CSV</b> di pojok kanan atas halaman Submissions untuk mengunduh seluruh data dalam format spreadsheet.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # 6. CHEAT SHEET COMMANDS
    story.append(Paragraph("6. Cheat Sheet Perintah Penting", h1_style))
    cmd_data = [
        [Paragraph("Kebutuhan", table_header_style), Paragraph("Perintah di Terminal", table_header_style)],
        [Paragraph("<b>Menjalankan Web</b>", body_style), Paragraph("<code>npm run dev</code>", code_style)],
        [Paragraph("<b>Kompilasi & Cek Error</b>", body_style), Paragraph("<code>npm run build</code>", code_style)],
        [Paragraph("<b>Format & Rapikan Kode</b>", body_style), Paragraph("<code>npm run format && npm run lint</code>", code_style)],
        [Paragraph("<b>Kirim ke GitHub / Live</b>", body_style), Paragraph("<code>git add . && git commit -m \"update\" && git push origin main</code>", code_style)],
        [Paragraph("<b>Ganti Logo Brand</b>", body_style), Paragraph("Simpan file logo baru format WebP di <code>public/logo-mark.webp</code>.", body_style)],
    ]
    t_cmd = Table(cmd_data, colWidths=[120, 410])
    t_cmd.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_bg]),
    ]))
    story.append(t_cmd)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Newbie Guidance PDF generated: {filename}")

if __name__ == '__main__':
    out_pdf = r"D:\data C\Download\Newbie-Guidance-9forms.pdf"
    build_pdf(out_pdf)
    # Also save as 9forms-Setup-Guidance-Leader.pdf for compatibility
    build_pdf(r"D:\data C\Download\9forms-Setup-Guidance-Leader.pdf")
