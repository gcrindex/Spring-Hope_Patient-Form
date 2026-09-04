import type { Language } from "./patientform";

export const adminI18n: Record<
  Language,
  {
    workspace: string;
    overview: string;
    forms: string;
    submissions: string;
    patients: string;
    analytics: string;
    settings: string;
    planned: string;
    searchPlaceholder: string;
    demoWorkspace: string;
    signOut: string;
    greeting: string;
    subtitle: string;
    todayDate: string;
    newForm: string;
    totalSubmissions: string;
    highRisk: string;
    moderateRisk: string;
    lowRisk: string;
    publishedForms: string;
    recentSubmissions: string;
    viewAll: string;
    patient: string;
    assessment: string;
    submitted: string;
    score: string;
    risk: string;
    action: string;
    publishedForm: string;
    live: string;
    questions: string;
    languages: string;
    voiceInput: string;
    enabled: string;
    manageForm: string;
    clinicalOps: string;
    clinicalOpsTitle: string;
    clinicalOpsDesc: string;
    avgCompletion: string;
    manualFallback: string;
    patientLangs: string;
    // Submissions view
    allSubmissions: string;
    searchPatients: string;
    filterAll: string;
    filterHigh: string;
    filterMod: string;
    filterLow: string;
    noSubmissions: string;
    submissionDetail: string;
    close: string;
    answersBreakdown: string;
    // Patients view
    patientDirectory: string;
    patientDirectoryDesc: string;
    status: string;
    lastAssessment: string;
    reviewNeeded: string;
    scheduled: string;
    completed: string;
    // Analytics view
    analyticsTitle: string;
    analyticsDesc: string;
    riskDistribution: string;
    languageUsage: string;
    triageTurnaround: string;
    avgTriageTime: string;
  }
> = {
  en: {
    workspace: "Clinical workspace",
    overview: "Overview",
    forms: "Forms",
    submissions: "Submissions",
    patients: "Patients",
    analytics: "Analytics",
    settings: "Settings",
    planned: "Planned",
    searchPlaceholder: "Search patients, forms, submissions…",
    demoWorkspace: "Demo workspace",
    signOut: "Sign out",
    greeting: "Good morning, Dr. Vance",
    subtitle: "Here's what's happening across your patient assessments today.",
    todayDate: "04 Sep 2026",
    newForm: "New form",
    totalSubmissions: "Submissions",
    highRisk: "High risk",
    moderateRisk: "Moderate",
    lowRisk: "Low risk",
    publishedForms: "Published forms",
    recentSubmissions: "Patient submissions",
    viewAll: "View all",
    patient: "Patient",
    assessment: "Assessment",
    submitted: "Submitted",
    score: "Score",
    risk: "Risk",
    action: "Action",
    publishedForm: "Published form",
    live: "Live",
    questions: "Questions",
    languages: "Languages",
    voiceInput: "Voice input",
    enabled: "Enabled",
    manageForm: "Manage form",
    clinicalOps: "Clinical operations",
    clinicalOpsTitle: "Designed for faster review, not more dashboards.",
    clinicalOpsDesc:
      "PatientForm keeps the patient journey guided while giving staff a compact view of forms, scoring, risk and submissions.",
    avgCompletion: "Demo completion",
    manualFallback: "Manual fallback",
    patientLangs: "Patient languages",
    allSubmissions: "All Submissions",
    searchPatients: "Search by patient name or ID…",
    filterAll: "All Tiers",
    filterHigh: "High Risk",
    filterMod: "Moderate",
    filterLow: "Low Risk",
    noSubmissions: "No submissions match your filter.",
    submissionDetail: "Submission Detail",
    close: "Close",
    answersBreakdown: "Answers Breakdown",
    patientDirectory: "Patient Directory",
    patientDirectoryDesc: "Active patient roster across current clinical assessments.",
    status: "Status",
    lastAssessment: "Last Assessment",
    reviewNeeded: "Review needed",
    scheduled: "Scheduled",
    completed: "Completed",
    analyticsTitle: "Clinical Assessment Analytics",
    analyticsDesc: "Screening distribution, response times and patient interaction metrics.",
    riskDistribution: "Risk Distribution",
    languageUsage: "Patient Language Selection",
    triageTurnaround: "Triage Efficiency",
    avgTriageTime: "Avg. Triage Review",
  },
  id: {
    workspace: "Workspace klinis",
    overview: "Ikhtisar",
    forms: "Formulir",
    submissions: "Hasil Masuk",
    patients: "Pasien",
    analytics: "Analisis",
    settings: "Pengaturan",
    planned: "Rencana",
    searchPlaceholder: "Cari pasien, formulir, pengiriman…",
    demoWorkspace: "Workspace demo",
    signOut: "Keluar",
    greeting: "Selamat pagi, Dr. Vance",
    subtitle: "Berikut perkembangan penilaian klinis pasien Anda hari ini.",
    todayDate: "04 Sep 2026",
    newForm: "Formulir baru",
    totalSubmissions: "Total Pengiriman",
    highRisk: "Risiko tinggi",
    moderateRisk: "Sedang",
    lowRisk: "Risiko rendah",
    publishedForms: "Formulir aktif",
    recentSubmissions: "Pengiriman Pasien",
    viewAll: "Lihat semua",
    patient: "Pasien",
    assessment: "Penilaian",
    submitted: "Dikirim",
    score: "Skor",
    risk: "Risiko",
    action: "Aksi",
    publishedForm: "Formulir aktif",
    live: "Aktif",
    questions: "Pertanyaan",
    languages: "Bahasa",
    voiceInput: "Input suara",
    enabled: "Aktif",
    manageForm: "Kelola formulir",
    clinicalOps: "Operasional klinis",
    clinicalOpsTitle: "Dirancang untuk tinjauan lebih cepat, bukan sekadar dashboard.",
    clinicalOpsDesc:
      "PatientForm memandu alur pasien sambil memberikan tim klinik tinjauan ringkas formulir, skor, risiko, dan hasil.",
    avgCompletion: "Waktu pengisian",
    manualFallback: "Fallback manual",
    patientLangs: "Bahasa pasien",
    allSubmissions: "Semua Pengiriman",
    searchPatients: "Cari nama atau ID pasien…",
    filterAll: "Semua Tingkat",
    filterHigh: "Risiko Tinggi",
    filterMod: "Sedang",
    filterLow: "Risiko Rendah",
    noSubmissions: "Tidak ada data pengiriman yang cocok.",
    submissionDetail: "Detail Pengiriman Pasien",
    close: "Tutup",
    answersBreakdown: "Rincian Jawaban",
    patientDirectory: "Daftar Pasien",
    patientDirectoryDesc: "Daftar pasien aktif pada penilaian klinis saat ini.",
    status: "Status",
    lastAssessment: "Penilaian Terakhir",
    reviewNeeded: "Perlu ditinjau",
    scheduled: "Terjadwal",
    completed: "Selesai",
    analyticsTitle: "Analisis Penilaian Klinis",
    analyticsDesc: "Distribusi skrining, waktu respons, dan metrik interaksi pasien.",
    riskDistribution: "Distribusi Risiko",
    languageUsage: "Pilihan Bahasa Pasien",
    triageTurnaround: "Efisiensi Triase",
    avgTriageTime: "Rata-rata Tinjauan",
  },
  zh: {
    workspace: "临床工作区",
    overview: "总览",
    forms: "表单管理",
    submissions: "患者提交",
    patients: "患者列表",
    analytics: "数据分析",
    settings: "设置",
    planned: "规划中",
    searchPlaceholder: "搜索患者、表单、提交记录…",
    demoWorkspace: "演示工作区",
    signOut: "退出登录",
    greeting: "早上好，Dr. Vance",
    subtitle: "这是今天诊所患者评估的最新动态。",
    todayDate: "2026年9月4日",
    newForm: "新建表单",
    totalSubmissions: "总提交数",
    highRisk: "高风险",
    moderateRisk: "中等风险",
    lowRisk: "低风险",
    publishedForms: "已发布表单",
    recentSubmissions: "患者提交记录",
    viewAll: "查看全部",
    patient: "患者",
    assessment: "评估项目",
    submitted: "提交时间",
    score: "得分",
    risk: "风险等级",
    action: "操作",
    publishedForm: "已发布表单",
    live: "运行中",
    questions: "问题数量",
    languages: "支持语言",
    voiceInput: "语音输入",
    enabled: "已启用",
    manageForm: "管理表单",
    clinicalOps: "临床运营",
    clinicalOpsTitle: "专为快速审查设计，而非繁杂的仪表板。",
    clinicalOpsDesc:
      "PatientForm 引导患者轻松作答，同时为医护团队提供紧凑的评分、风险与提交总览。",
    avgCompletion: "平均完成用时",
    manualFallback: "手动降级保障",
    patientLangs: "患者语言覆盖",
    allSubmissions: "全部提交记录",
    searchPatients: "按姓名或ID搜索…",
    filterAll: "全部等级",
    filterHigh: "高风险",
    filterMod: "中等风险",
    filterLow: "低风险",
    noSubmissions: "暂无符合条件的提交记录。",
    submissionDetail: "患者提交详情",
    close: "关闭",
    answersBreakdown: "答案明细",
    patientDirectory: "患者花名册",
    patientDirectoryDesc: "当前临床评估项目下的活跃患者名单。",
    status: "状态",
    lastAssessment: "最近评估",
    reviewNeeded: "待审核",
    scheduled: "已预约",
    completed: "已完成",
    analyticsTitle: "临床评估数据分析",
    analyticsDesc: "筛查风险分布、响应时间与患者交互指标。",
    riskDistribution: "风险分布",
    languageUsage: "患者语言选择占比",
    triageTurnaround: "分诊效率",
    avgTriageTime: "平均分诊审查用时",
  },
};

export const landingI18n: Record<
  Language,
  {
    navExperience: string;
    navVoice: string;
    navWorkflow: string;
    tryAssessment: string;
    badge: string;
    heroH1Pre: string;
    heroH1Span: string;
    heroLead: string;
    tryLive: string;
    seeVoice: string;
    noApp: string;
    languages: string;
    manualFallback: string;
    voiceUnderstood: string;
    voiceUnderstoodSub: string;
    patientInControl: string;
    patientInControlSub: string;
    p1Number: string;
    p1Title: string;
    p1Sub: string;
    p2Number: string;
    p2Title: string;
    p2Sub: string;
    p3Number: string;
    p3Title: string;
    p3Sub: string;
    p4Number: string;
    p4Title: string;
    p4Sub: string;
    expKicker: string;
    expTitle1: string;
    expTitle2: string;
    expDesc: string;
    f1Label: string;
    f1Title: string;
    f1Desc: string;
    f2Label: string;
    f2Title1: string;
    f2Title2: string;
    f2Desc: string;
    f2Listening: string;
    f3Label: string;
    f3Title: string;
    f3Desc: string;
    f4Label: string;
    f4Title: string;
    f4Desc: string;
    f4Upload: string;
    wfKicker: string;
    wfTitle: string;
    wfDesc: string;
    s1Title: string;
    s1Desc: string;
    s2Title: string;
    s2Desc: string;
    s3Title: string;
    s3Desc: string;
    closingBadge: string;
    closingTitle: string;
    closingDesc: string;
    closingCta: string;
    disclaimer: string;
  }
> = {
  en: {
    navExperience: "Patient experience",
    navVoice: "Voice",
    navWorkflow: "Workflow",
    tryAssessment: "Try assessment",
    badge: "PatientForm vNext",
    heroH1Pre: "Clinical assessments that feel ",
    heroH1Span: "effortless.",
    heroLead:
      "A calmer way for patients to share symptoms and for clinic staff to receive structured answers — one clear question at a time, with optional voice.",
    tryLive: "Try the live experience",
    seeVoice: "See how voice works",
    noApp: "No app download",
    languages: "EN · ID · 中文",
    manualFallback: "Manual fallback always available",
    voiceUnderstood: "Voice understood",
    voiceUnderstoodSub: "“Seven” → Pain level 7",
    patientInControl: "Patient stays in control",
    patientInControlSub: "Review before moving on",
    p1Number: "01",
    p1Title: "One question",
    p1Sub: "at a time",
    p2Number: "02",
    p2Title: "Tap, type",
    p2Sub: "or speak",
    p3Number: "03",
    p3Title: "Clear progress",
    p3Sub: "from start to finish",
    p4Number: "04",
    p4Title: "Structured result",
    p4Sub: "for clinic review",
    expKicker: "Designed around the patient",
    expTitle1: "Less form-filling.",
    expTitle2: "More guided conversation.",
    expDesc:
      "PatientForm replaces dense, multi-page questionnaires with focused steps that are easy to understand on a phone — especially when a patient is uncomfortable, older, or in a hurry.",
    f1Label: "Focused interaction",
    f1Title: "One decision per screen.",
    f1Desc:
      "Big answer targets, a persistent progress bar, immediate acknowledgement, and a clear next action reduce cognitive load.",
    f2Label: "Voice-first, not voice-only",
    f2Title1: "Speak naturally.",
    f2Title2: "Review what we heard.",
    f2Desc:
      "Voice is a first-class input method, while every manual control stays available. Ambiguous answers are confirmed, not guessed.",
    f2Listening: "Listening… say your answer naturally",
    f3Label: "Multilingual",
    f3Title: "EN, Bahasa Indonesia, 中文.",
    f3Desc:
      "The interface and voice locale follow the patient’s selected language, with layouts built to handle translated strings cleanly.",
    f4Label: "Flexible intake",
    f4Title: "Paper is still welcome.",
    f4Desc:
      "Patients who already completed a paper form can use the secondary photo path instead of starting over.",
    f4Upload: "Upload completed form",
    wfKicker: "From question to clinic",
    wfTitle: "A simple flow, end to end.",
    wfDesc:
      "Designed so patients can complete the assessment quickly while staff get a cleaner handoff before the appointment.",
    s1Title: "Clinic prepares the assessment",
    s1Desc: "Staff create a focused questionnaire with scoring and clear patient instructions.",
    s2Title: "Patient answers naturally",
    s2Desc: "One question at a time — tap, type, or speak. No app download required.",
    s3Title: "Answers arrive structured",
    s3Desc: "Staff review the submission, score, risk tier, and response details in one place.",
    closingBadge: "Demo prototype",
    closingTitle: "See the assessment from a patient’s point of view.",
    closingDesc:
      "Try the seeded Knee Pain Assessment on mobile or desktop. Tap, type, or use browser-supported voice input.",
    closingCta: "Start demo assessment",
    disclaimer:
      "PatientForm is an MVP screening experience and does not provide a medical diagnosis.",
  },
  id: {
    navExperience: "Pengalaman pasien",
    navVoice: "Suara",
    navWorkflow: "Alur kerja",
    tryAssessment: "Coba penilaian",
    badge: "PatientForm vNext",
    heroH1Pre: "Penilaian klinis yang terasa ",
    heroH1Span: "mudah & terpandu.",
    heroLead:
      "Cara yang lebih tenang bagi pasien untuk menyampaikan gejala dan bagi staf klinik menerima jawaban terstruktur — satu pertanyaan jelas dalam satu layar, dengan opsi suara.",
    tryLive: "Coba pengalaman langsung",
    seeVoice: "Lihat cara kerja suara",
    noApp: "Tanpa unduh aplikasi",
    languages: "EN · ID · 中文",
    manualFallback: "Opsi manual selalu tersedia",
    voiceUnderstood: "Suara dipahami",
    voiceUnderstoodSub: "“Tujuh” → Tingkat nyeri 7",
    patientInControl: "Pasien memegang kendali",
    patientInControlSub: "Tinjau sebelum lanjut",
    p1Number: "01",
    p1Title: "Satu pertanyaan",
    p1Sub: "per layar",
    p2Number: "02",
    p2Title: "Ketuk, ketik",
    p2Sub: "atau bicara",
    p3Number: "03",
    p3Title: "Progres jelas",
    p3Sub: "dari awal hingga akhir",
    p4Number: "04",
    p4Title: "Hasil terstruktur",
    p4Sub: "untuk ditinjau klinik",
    expKicker: "Dirancang berpusat pada pasien",
    expTitle1: "Kurangi beban formulir.",
    expTitle2: "Lebih mirip percakapan terpandu.",
    expDesc:
      "PatientForm menggantikan kuesioner berlapis yang padat dengan langkah fokus yang mudah dipahami di ponsel — terutama saat pasien sedang tidak nyaman, lansia, atau terburu-buru.",
    f1Label: "Interaksi fokus",
    f1Title: "Satu keputusan per layar.",
    f1Desc:
      "Target sentuh besar, bilah progres konsisten, konfirmasi instan, dan aksi lanjut yang jelas mengurangi beban berpikir.",
    f2Label: "Utamakan suara, bukan hanya suara",
    f2Title1: "Bicara secara alami.",
    f2Title2: "Tinjau apa yang didengar.",
    f2Desc:
      "Suara adalah metode input utama, namun setiap kontrol manual tetap aktif. Jawaban ambigu dikonfirmasi, bukan ditebak.",
    f2Listening: "Mendengarkan… ucapkan jawaban Anda",
    f3Label: "Tiga bahasa",
    f3Title: "EN, Bahasa Indonesia, 中文.",
    f3Desc:
      "Antarmuka dan pengenalan suara mengikuti bahasa pilihan pasien dengan tata letak yang rapi.",
    f4Label: "Penerimaan fleksibel",
    f4Title: "Formulir kertas tetap diterima.",
    f4Desc:
      "Pasien yang telah mengisi formulir kertas dapat mengunggah foto formulir tanpa harus mengetik ulang.",
    f4Upload: "Unggah formulir yang terisi",
    wfKicker: "Dari pertanyaan hingga klinik",
    wfTitle: "Alur sederhana, ujung ke ujung.",
    wfDesc:
      "Dirancang agar pasien dapat menyelesaikan penilaian dengan cepat sementara staf mendapatkan ringkasan yang rapi sebelum kunjungan.",
    s1Title: "Klinik menyiapkan penilaian",
    s1Desc: "Staf menyusun kuesioner terarah dengan pembobotan skor dan panduan pasien yang jelas.",
    s2Title: "Pasien menjawab dengan alami",
    s2Desc: "Satu pertanyaan per waktu — sentuh, ketik, atau bicara. Tanpa perlu download aplikasi.",
    s3Title: "Jawaban tiba secara terstruktur",
    s3Desc: "Staf meninjau kiriman pasien, skor, tingkat risiko, dan detail jawaban di satu tempat.",
    closingBadge: "Prototipe demo",
    closingTitle: "Lihat penilaian dari sudut pandang pasien.",
    closingDesc:
      "Coba Penilaian Nyeri Lutut di ponsel atau desktop. Sentuh, ketik, atau gunakan input suara yang didukung browser.",
    closingCta: "Mulai penilaian demo",
    disclaimer:
      "PatientForm adalah pengalaman skrining MVP dan bukan merupakan diagnosis medis.",
  },
  zh: {
    navExperience: "患者体验",
    navVoice: "语音功能",
    navWorkflow: "工作流程",
    tryAssessment: "体验评估",
    badge: "PatientForm vNext",
    heroH1Pre: "让临床评估变得 ",
    heroH1Span: "轻松自然。",
    heroLead:
      "一种更平和的方式让患者表达症状，让医护人员接收结构化答案——每次一题，支持可选语音。",
    tryLive: "体验在线演示",
    seeVoice: "了解语音功能",
    noApp: "无需下载应用",
    languages: "EN · ID · 中文",
    manualFallback: "手动输入始终可用",
    voiceUnderstood: "语音识别准确",
    voiceUnderstoodSub: "“七” → 疼痛级别 7",
    patientInControl: "患者自主确认",
    patientInControlSub: "进入下一步前可随时审查",
    p1Number: "01",
    p1Title: "单题专注",
    p1Sub: "一次一个任务",
    p2Number: "02",
    p2Title: "轻触、打字",
    p2Sub: "或语音作答",
    p3Number: "03",
    p3Title: "进度清晰",
    p3Sub: "从头到尾一目了然",
    p4Number: "04",
    p4Title: "结构化结果",
    p4Sub: "供诊所团队审阅",
    expKicker: "以患者为中心的设计",
    expTitle1: "减少填表负担。",
    expTitle2: "更具引导性的对话感。",
    expDesc:
      "PatientForm 取代冗长的纸质问卷，采用易于手机阅读的专注步骤——尤其适合身体不适、长者或急于就诊的患者。",
    f1Label: "专注交互",
    f1Title: "一屏仅做一个决定。",
    f1Desc: "大号触控目标、始终可见的进度条和即时确认，大幅降低认知负荷。",
    f2Label: "语音优先，而非仅限语音",
    f2Title1: "自然口述。",
    f2Title2: "即时核对听取内容。",
    f2Desc: "语音为一等输入方式，同时所有手动控件始终可用。模糊答案会提示确认而非胡乱猜测。",
    f2Listening: "正在聆听… 请自然作答",
    f3Label: "多语言支持",
    f3Title: "英文、印尼语、简体中文。",
    f3Desc: "界面与语音语种实时跟随患者选择，版式专为多语言文字自适应。",
    f4Label: "灵活采集",
    f4Title: "纸质表单同样支持。",
    f4Desc: "已经填好纸质问卷的患者可直接拍照上传，无需重新填写一遍。",
    f4Upload: "上传已填好的表单照片",
    wfKicker: "从问卷到诊所",
    wfTitle: "端到端极简流程。",
    wfDesc: "让患者迅速完成评估，同时为医护团队在就诊前提供条理分明的信息交接。",
    s1Title: "诊所配置评估表单",
    s1Desc: "医护人员制定结构化问卷，设置评分标准与温馨作答提示。",
    s2Title: "患者自然流畅回答",
    s2Desc: "一次只答一题——轻触、打字或语音，无需安装任何App。",
    s3Title: "答案结构化同步",
    s3Desc: "医护团队一站式查阅患者提交记录、得分、风险分级及答题明细。",
    closingBadge: "演示原型",
    closingTitle: "以患者视角体验全新的临床评估。",
    closingDesc: "在手机或电脑端体验膝关节疼痛评估。支持触控、打字或浏览器语音输入。",
    closingCta: "开始演示评估",
    disclaimer: "PatientForm 为 MVP 筛查体验，不构成医疗诊断建议。",
  },
};
