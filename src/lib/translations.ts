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
    deleteAction: string;
    confirmDelete: string;
    changeStatus: string;
    editTriage: string;
    editName: string;
    newNameLabel: string;
    saveName: string;
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
    deleteAction: "Delete",
    confirmDelete: "Are you sure you want to delete this submission?",
    changeStatus: "Update Status",
    editTriage: "Triage Status",
    editName: "Edit Name",
    newNameLabel: "New Patient Name",
    saveName: "Save Name",
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
    deleteAction: "Hapus",
    confirmDelete: "Yakin ingin menghapus data ini?",
    changeStatus: "Ubah Status",
    editTriage: "Status Triase",
    editName: "Ubah Nama",
    newNameLabel: "Nama Pasien Baru",
    saveName: "Simpan Nama",
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
    clinicalOpsDesc: "PatientForm 引导患者轻松作答，同时为医护团队提供紧凑的评分、风险与提交总览。",
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
    deleteAction: "删除",
    confirmDelete: "确认删除该记录？此操作不可撤销。",
    changeStatus: "更新状态",
    editTriage: "分诊状态",
    editName: "修改姓名",
    newNameLabel: "新患者姓名",
    saveName: "保存姓名",
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
    s2Desc:
      "Satu pertanyaan per waktu — sentuh, ketik, atau bicara. Tanpa perlu download aplikasi.",
    s3Title: "Jawaban tiba secara terstruktur",
    s3Desc:
      "Staf meninjau kiriman pasien, skor, tingkat risiko, dan detail jawaban di satu tempat.",
    closingBadge: "Prototipe demo",
    closingTitle: "Lihat penilaian dari sudut pandang pasien.",
    closingDesc:
      "Coba Penilaian Nyeri Lutut di ponsel atau desktop. Sentuh, ketik, atau gunakan input suara yang didukung browser.",
    closingCta: "Mulai penilaian demo",
    disclaimer: "PatientForm adalah pengalaman skrining MVP dan bukan merupakan diagnosis medis.",
  },
  zh: {
    navExperience: "患者体验",
    navVoice: "语音功能",
    navWorkflow: "工作流程",
    tryAssessment: "体验评估",
    badge: "PatientForm vNext",
    heroH1Pre: "让临床评估变得 ",
    heroH1Span: "轻松自然。",
    heroLead: "一种更平和的方式让患者表达症状，让医护人员接收结构化答案——每次一题，支持可选语音。",
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

export const builderI18n: Record<
  Language,
  {
    navFeatures: string;
    navIndustries: string;
    navDemo: string;
    navAdmin: string;
    navCta: string;
    badge: string;
    heroH1Pre: string;
    heroH1Span: string;
    heroLead: string;
    heroCtaPrimary: string;
    heroCtaSecondary: string;
    trustNoApp: string;
    trustVoice: string;
    mockQuestion: string;
    mockOpt1: string;
    mockOpt2: string;
    mockOpt3: string;
    mockAuto: string;
    mockVoiceTitle: string;
    mockVoiceSub: string;
    mockResponses: string;
    mockResponsesSub: string;
    proof1Number: string;
    proof1Title: string;
    proof1Sub: string;
    proof2Number: string;
    proof2Title: string;
    proof2Sub: string;
    proof3Number: string;
    proof3Title: string;
    proof3Sub: string;
    proof4Number: string;
    proof4Title: string;
    proof4Sub: string;
    indKicker: string;
    indTitle1: string;
    indTitle2: string;
    indDesc: string;
    ind1Name: string;
    ind1Desc: string;
    ind2Name: string;
    ind2Desc: string;
    ind3Name: string;
    ind3Desc: string;
    ind4Name: string;
    ind4Desc: string;
    ind5Name: string;
    ind5Desc: string;
    ind6Name: string;
    ind6Desc: string;
    demoKicker: string;
    demoTitle1: string;
    demoTitle2: string;
    demoDesc: string;
    demo1Badge: string;
    demo1Title: string;
    demo1Desc: string;
    demo1F1: string;
    demo1F2: string;
    demo1F3: string;
    demo1Cta: string;
    demo2Badge: string;
    demo2Title: string;
    demo2Desc: string;
    demo2F1: string;
    demo2F2: string;
    demo2F3: string;
    demo2Cta: string;
    featKicker: string;
    featTitle1: string;
    featTitle2: string;
    featDesc: string;
    f1Label: string;
    f1Title: string;
    f1Desc: string;
    f2Label: string;
    f2Title: string;
    f2Desc: string;
    f3Label: string;
    f3Title: string;
    f3Desc: string;
    f4Label: string;
    f4Title: string;
    f4Desc: string;
    f5Label: string;
    f5Title: string;
    f5Desc: string;
    f6Label: string;
    f6Title: string;
    f6Desc: string;
    howKicker: string;
    howTitle: string;
    howDesc: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    adminKicker: string;
    adminTitle1: string;
    adminTitle2: string;
    adminDesc: string;
    adminB1: string;
    adminB2: string;
    adminB3: string;
    adminB4: string;
    adminCta: string;
    adminMockTitle: string;
    adminStat1: string;
    adminStat2: string;
    adminStat3: string;
    closingBadge: string;
    closingTitle: string;
    closingDesc: string;
    closingCta: string;
    footerNote: string;
    footerOld: string;
  }
> = {
  en: {
    navFeatures: "Features",
    navIndustries: "Industries",
    navDemo: "Live demo",
    navAdmin: "Admin area",
    navCta: "Try the demo",
    badge: "SpringForm · Multi-Industry Form Builder",
    heroH1Pre: "One form platform for",
    heroH1Span: "every industry.",
    heroLead:
      "SpringForm is a conversational form builder — one question at a time, automatic navigation, voice answers, and a clean admin dashboard. From clinics to classrooms, collect better data in minutes.",
    heroCtaPrimary: "Try the live demo",
    heroCtaSecondary: "Enter admin area",
    trustNoApp: "No installation",
    trustVoice: "Voice answers",
    mockQuestion: "What is bothering you most today?",
    mockOpt1: "Knee or leg pain",
    mockOpt2: "Back or waist pain",
    mockOpt3: "Shoulder or arm pain",
    mockAuto: "Auto-advance — no next button needed",
    mockVoiceTitle: "Listening — say your answer",
    mockVoiceSub: "Voice mode stays on for the next questions",
    mockResponses: "23 new responses",
    mockResponsesSub: "Knee Pain Assessment · live",
    proof1Number: "6+",
    proof1Title: "Industries",
    proof1Sub: "one platform",
    proof2Number: "01",
    proof2Title: "One question",
    proof2Sub: "per screen",
    proof3Number: "03",
    proof3Title: "Auto-advance",
    proof3Sub: "no next button",
    proof4Number: "92%",
    proof4Title: "Completion",
    proof4Sub: "guided flow",
    indKicker: "Built for every field",
    indTitle1: "One builder,",
    indTitle2: "many industries.",
    indDesc:
      "Design guided, mobile-first forms for any scenario — then share one link and watch structured answers arrive in your dashboard.",
    ind1Name: "Healthcare & Clinics",
    ind1Desc: "Patient intake, screening & triage forms.",
    ind2Name: "Education",
    ind2Desc: "Student surveys, class registration, quizzes.",
    ind3Name: "HR & Recruitment",
    ind3Desc: "Job applications, onboarding, pulse checks.",
    ind4Name: "Events",
    ind4Desc: "Guest registration, session feedback.",
    ind5Name: "Real Estate",
    ind5Desc: "Tenant applications, viewing requests.",
    ind6Name: "Retail & F&B",
    ind6Desc: "Customer feedback, order requests.",
    demoKicker: "Live demos",
    demoTitle1: "Try it like",
    demoTitle2: "your customers would.",
    demoDesc:
      "Two published SpringForm demos from Spring Hope Orthopaedic Clinic. Open them on your phone — every answer advances automatically.",
    demo1Badge: "Demo 1 · Elderly-friendly",
    demo1Title: "New Patient Questionnaire",
    demo1Desc:
      "A simplified intake for senior patients: no typing required to start, giant touch targets, and optional voice answering.",
    demo1F1: "No name typing at the start",
    demo1F2: "Large buttons, minimal text",
    demo1F3: "Auto-advance + persistent voice mode",
    demo1Cta: "Open Demo 1",
    demo2Badge: "Demo 2 · Clinical assessment",
    demo2Title: "Knee Pain Assessment",
    demo2Desc:
      "A focused knee assessment with a 0–10 pain scale, quick yes/no questions, and automatic risk scoring for the clinic.",
    demo2F1: "0–10 pain scale with one tap",
    demo2F2: "Fast yes/no questions",
    demo2F3: "Automatic risk score for staff",
    demo2Cta: "Open Demo 2",
    featKicker: "Why SpringForm",
    featTitle1: "Everything a modern",
    featTitle2: "form needs.",
    featDesc:
      "A guided experience for respondents and a tidy workspace for your team — out of the box.",
    f1Label: "Conversational",
    f1Title: "One question per screen.",
    f1Desc: "Respondents focus on a single decision at a time, so completion rates stay high.",
    f2Label: "Automatic",
    f2Title: "Auto-advance navigation.",
    f2Desc: "The next question loads the moment an answer is given — no next button to hunt for.",
    f3Label: "Voice-first",
    f3Title: "Answer by voice.",
    f3Desc:
      "Activate the mic once and every following question listens automatically, with manual input as fallback.",
    f4Label: "Multilingual",
    f4Title: "EN · Bahasa · 中文.",
    f4Desc: "The interface and voice recognition follow each respondent's language.",
    f5Label: "Admin area",
    f5Title: "A dashboard your team loves.",
    f5Desc:
      "Review every submission with scores, statuses and quick filters — inspired by modern clinical portals.",
    f6Label: "Accessible",
    f6Title: "Friendly to every age.",
    f6Desc: "An elderly mode with larger text, fewer words and giant touch targets.",
    howKicker: "How it works",
    howTitle: "From blank page to insights in three steps.",
    howDesc: "No code, no complex setup — build, share and analyze.",
    step1Title: "Build the form",
    step1Desc: "Start from a template or AI draft, add questions, scoring and languages.",
    step2Title: "Share one link",
    step2Desc: "Send the form by QR, WhatsApp or embed. It works instantly on any phone.",
    step3Title: "Review & act",
    step3Desc: "Answers arrive structured in your admin area with scores and statuses.",
    adminKicker: "For your team",
    adminTitle1: "The admin area",
    adminTitle2: "keeps work moving.",
    adminDesc:
      "Every response lands in a clean workspace: search, filter, change statuses and keep names tidy.",
    adminB1: "All submissions in one table",
    adminB2: "Change status in one click",
    adminB3: "Rename respondents safely",
    adminB4: "Quick search & filters",
    adminCta: "Enter the admin area",
    adminMockTitle: "Submissions · Knee Pain Assessment",
    adminStat1: "Responses",
    adminStat2: "High risk",
    adminStat3: "Avg. score",
    closingBadge: "Free demo",
    closingTitle: "See SpringForm through your customers' eyes.",
    closingDesc:
      "Open a demo form, answer with touch or voice, then explore the admin area where those answers arrive.",
    closingCta: "Start the demo now",
    footerNote:
      "SpringForm is a demo product experience. Demo content belongs to Spring Hope Orthopaedic Clinic.",
    footerOld: "Legacy clinic landing page",
  },
  id: {
    navFeatures: "Fitur",
    navIndustries: "Industri",
    navDemo: "Demo Langsung",
    navAdmin: "Area Admin",
    navCta: "Coba Demo",
    badge: "SpringForm · Pembuat Form Multi-Industri",
    heroH1Pre: "Satu platform formulir untuk",
    heroH1Span: "semua industri.",
    heroLead:
      "SpringForm adalah pembuat formulir percakapan — satu pertanyaan per layar, perpindahan otomatis, jawaban dengan suara, dan dasbor admin yang rapi. Dari klinik hingga kelas, kumpulkan data lebih baik dalam hitungan menit.",
    heroCtaPrimary: "Coba Demo Langsung",
    heroCtaSecondary: "Masuk Area Admin",
    trustNoApp: "Tanpa instalasi",
    trustVoice: "Jawaban suara",
    mockQuestion: "Apa yang paling mengganggu Anda hari ini?",
    mockOpt1: "Nyeri lutut atau kaki",
    mockOpt2: "Sakit pinggang",
    mockOpt3: "Nyeri bahu atau lengan",
    mockAuto: "Lanjut otomatis — tanpa tombol next",
    mockVoiceTitle: "Mendengarkan — ucapkan jawaban Anda",
    mockVoiceSub: "Mode suara tetap aktif untuk pertanyaan berikutnya",
    mockResponses: "23 respons baru",
    mockResponsesSub: "Asesmen Nyeri Lutut · aktif",
    proof1Number: "6+",
    proof1Title: "Industri",
    proof1Sub: "satu platform",
    proof2Number: "01",
    proof2Title: "Satu pertanyaan",
    proof2Sub: "per layar",
    proof3Number: "03",
    proof3Title: "Lanjut otomatis",
    proof3Sub: "tanpa tombol next",
    proof4Number: "92%",
    proof4Title: "Selesai diisi",
    proof4Sub: "alur terpandu",
    indKicker: "Dibuat untuk semua bidang",
    indTitle1: "Satu builder,",
    indTitle2: "banyak industri.",
    indDesc:
      "Rancang formulir terpandu yang ramah ponsel untuk kebutuhan apa pun — bagikan satu tautan, dan jawaban terstruktur langsung masuk ke dasbor Anda.",
    ind1Name: "Kesehatan & Klinik",
    ind1Desc: "Intake pasien, skrining & triase.",
    ind2Name: "Pendidikan",
    ind2Desc: "Survei siswa, pendaftaran kelas, kuis.",
    ind3Name: "SDM & Rekrutmen",
    ind3Desc: "Formulir lamaran, onboarding, survei karyawan.",
    ind4Name: "Acara & Event",
    ind4Desc: "Registrasi peserta, umpan balik sesi.",
    ind5Name: "Properti",
    ind5Desc: "Data penyewa, permintaan kunjungan.",
    ind6Name: "Ritel & F&B",
    ind6Desc: "Umpan balik pelanggan, permintaan pesanan.",
    demoKicker: "Demo langsung",
    demoTitle1: "Rasakan seperti",
    demoTitle2: "pelanggan Anda.",
    demoDesc:
      "Dua demo SpringForm yang dipublikasikan Spring Hope Orthopaedic Clinic. Buka di ponsel Anda — setiap jawaban langsung lanjut otomatis.",
    demo1Badge: "Demo 1 · Ramah Lansia",
    demo1Title: "Kuesioner Pasien Baru",
    demo1Desc:
      "Formulir intake yang disederhanakan untuk lansia: tanpa mengetik nama di awal, tombol sentuh raksasa, dan jawaban suara opsional.",
    demo1F1: "Tanpa mengetik nama di awal",
    demo1F2: "Tombol besar, teks minimal",
    demo1F3: "Lanjut otomatis + mode suara persisten",
    demo1Cta: "Buka Demo 1",
    demo2Badge: "Demo 2 · Asesmen Klinis",
    demo2Title: "Asesmen Nyeri Lutut",
    demo2Desc:
      "Asesmen lutut yang fokus dengan skala nyeri 0–10, pertanyaan ya/tidak cepat, dan skor risiko otomatis untuk klinik.",
    demo2F1: "Skala nyeri 0–10 sekali sentuh",
    demo2F2: "Pertanyaan ya/tidak yang cepat",
    demo2F3: "Skor risiko otomatis untuk staf",
    demo2Cta: "Buka Demo 2",
    featKicker: "Kenapa SpringForm",
    featTitle1: "Semua yang dibutuhkan",
    featTitle2: "formulir modern.",
    featDesc:
      "Pengalaman terpandu untuk pengisi dan workspace rapi untuk tim Anda — langsung dari kotak.",
    f1Label: "Konversasional",
    f1Title: "Satu pertanyaan per layar.",
    f1Desc:
      "Pengisi fokus pada satu keputusan dalam satu waktu, sehingga tingkat penyelesaian tetap tinggi.",
    f2Label: "Otomatis",
    f2Title: "Navigasi lanjut otomatis.",
    f2Desc: "Pertanyaan berikutnya langsung muncul begitu jawaban diberikan — tanpa tombol next.",
    f3Label: "Utamakan suara",
    f3Title: "Jawab dengan suara.",
    f3Desc:
      "Aktifkan mikrofon sekali dan pertanyaan berikutnya otomatis mendengarkan, dengan input manual sebagai cadangan.",
    f4Label: "Multi-bahasa",
    f4Title: "EN · Bahasa · 中文.",
    f4Desc: "Antarmuka dan pengenalan suara mengikuti bahasa masing-masing pengisi.",
    f5Label: "Area admin",
    f5Title: "Dasbor yang disukai tim Anda.",
    f5Desc:
      "Tinjau setiap pengiriman dengan skor, status, dan filter cepat — terinspirasi portal klinis modern.",
    f6Label: "Aksesibel",
    f6Title: "Ramah untuk semua usia.",
    f6Desc: "Mode lansia dengan huruf lebih besar, teks lebih sedikit, dan target sentuh raksasa.",
    howKicker: "Cara kerja",
    howTitle: "Dari halaman kosong ke wawasan dalam tiga langkah.",
    howDesc: "Tanpa kode, tanpa pengaturan rumit — buat, bagikan, analisis.",
    step1Title: "Bangun formulirnya",
    step1Desc: "Mulai dari template atau draf AI, tambahkan pertanyaan, skor, dan bahasa.",
    step2Title: "Bagikan satu tautan",
    step2Desc: "Kirim formulir via QR, WhatsApp, atau embed. Langsung jalan di ponsel apa pun.",
    step3Title: "Tinjau & bertindak",
    step3Desc: "Jawaban masuk terstruktur ke area admin Anda lengkap dengan skor dan status.",
    adminKicker: "Untuk tim Anda",
    adminTitle1: "Area admin",
    adminTitle2: "membantu kerja mengalir.",
    adminDesc:
      "Setiap respons masuk ke workspace yang bersih: cari, filter, ubah status, dan jaga nama tetap rapi.",
    adminB1: "Semua pengiriman dalam satu tabel",
    adminB2: "Ubah status dalam satu klik",
    adminB3: "Ganti nama responden dengan aman",
    adminB4: "Pencarian & filter cepat",
    adminCta: "Masuk Area Admin",
    adminMockTitle: "Pengiriman · Asesmen Nyeri Lutut",
    adminStat1: "Respons",
    adminStat2: "Risiko tinggi",
    adminStat3: "Skor rata-rata",
    closingBadge: "Demo gratis",
    closingTitle: "Lihat SpringForm dari mata pelanggan Anda.",
    closingDesc:
      "Buka formulir demo, jawab dengan sentuhan atau suara, lalu jelajahi area admin tempat jawaban tersebut tiba.",
    closingCta: "Mulai Demo Sekarang",
    footerNote:
      "SpringForm adalah pengalaman produk demo. Konten demo milik Spring Hope Orthopaedic Clinic.",
    footerOld: "Landing page klinik (versi lama)",
  },
  zh: {
    navFeatures: "功能特性",
    navIndustries: "适用行业",
    navDemo: "在线演示",
    navAdmin: "管理后台",
    navCta: "试用演示",
    badge: "SpringForm · 多行业表单平台",
    heroH1Pre: "一个表单平台，服务",
    heroH1Span: "所有行业。",
    heroLead:
      "SpringForm 是对话式表单构建工具——一次一题、自动跳转、语音作答，并配备清爽的管理后台。从诊所到课堂，几分钟内收集更优质的数据。",
    heroCtaPrimary: "试用在线演示",
    heroCtaSecondary: "进入管理后台",
    trustNoApp: "无需安装",
    trustVoice: "语音作答",
    mockQuestion: "您今天最不舒服的地方是？",
    mockOpt1: "膝盖或腿部疼痛",
    mockOpt2: "腰部或背部酸痛",
    mockOpt3: "肩膀或手臂疼痛",
    mockAuto: "自动跳转 — 无需点击下一页",
    mockVoiceTitle: "正在聆听 — 请说出您的答案",
    mockVoiceSub: "语音模式将为后续问题保持开启",
    mockResponses: "23 条新回复",
    mockResponsesSub: "膝关节疼痛评估 · 运行中",
    proof1Number: "6+",
    proof1Title: "大行业",
    proof1Sub: "一个平台",
    proof2Number: "01",
    proof2Title: "单题专注",
    proof2Sub: "一屏一答",
    proof3Number: "03",
    proof3Title: "自动跳转",
    proof3Sub: "无需下一页按钮",
    proof4Number: "92%",
    proof4Title: "完成率",
    proof4Sub: "引导式流程",
    indKicker: "适用于各行各业",
    indTitle1: "一个构建器，",
    indTitle2: "服务多个行业。",
    indDesc: "为任何场景设计引导式、移动优先的表单——分享一个链接，结构化的答案便会汇入您的后台。",
    ind1Name: "医疗与诊所",
    ind1Desc: "患者登记、筛查与分诊表单。",
    ind2Name: "教育培训",
    ind2Desc: "学生问卷、课程报名、测验。",
    ind3Name: "人力资源与招聘",
    ind3Desc: "职位申请、入职引导、员工调研。",
    ind4Name: "活动会议",
    ind4Desc: "来宾登记、场次反馈。",
    ind5Name: "房地产",
    ind5Desc: "租户申请、看房预约。",
    ind6Name: "零售与餐饮",
    ind6Desc: "顾客反馈、订单登记。",
    demoKicker: "在线演示",
    demoTitle1: "像您的客户",
    demoTitle2: "一样体验。",
    demoDesc:
      "两个由 Spring Hope 骨科诊所发布的 SpringForm 演示。在手机上打开——每个答案都会自动进入下一题。",
    demo1Badge: "演示 1 · 长者友好",
    demo1Title: "新患者问卷",
    demo1Desc: "为长者简化的登记流程：开始无需打字、超大触控按钮，以及可选的语音作答。",
    demo1F1: "开始时无需输入姓名",
    demo1F2: "大按钮、精简文字",
    demo1F3: "自动跳转 + 语音模式保持开启",
    demo1Cta: "打开演示 1",
    demo2Badge: "演示 2 · 临床评估",
    demo2Title: "膝关节疼痛评估",
    demo2Desc: "聚焦膝关节的评估：0–10 疼痛量表、快速是非题，以及供诊所使用的自动风险评分。",
    demo2F1: "0–10 疼痛量表一键选择",
    demo2F2: "快速是非题",
    demo2F3: "自动生成风险评分",
    demo2Cta: "打开演示 2",
    featKicker: "为什么选择 SpringForm",
    featTitle1: "现代表单所需的",
    featTitle2: "一切功能。",
    featDesc: "为填写者提供引导式体验，为团队提供整洁的工作区——开箱即用。",
    f1Label: "对话式",
    f1Title: "一屏一个问题。",
    f1Desc: "填写者每次只做一个决定，完成率自然更高。",
    f2Label: "自动化",
    f2Title: "自动跳转导航。",
    f2Desc: "答案一经选择立即进入下一题——无需寻找下一页按钮。",
    f3Label: "语音优先",
    f3Title: "开口即答。",
    f3Desc: "只需开启一次麦克风，后续问题都会自动聆听，同时保留手动输入。",
    f4Label: "多语言",
    f4Title: "EN · 印尼语 · 中文。",
    f4Desc: "界面与语音识别跟随每位填写者的语言。",
    f5Label: "管理后台",
    f5Title: "团队爱用的仪表板。",
    f5Desc: "在一个地方审阅所有提交，含评分、状态与快捷筛选——灵感来自现代临床门户。",
    f6Label: "无障碍",
    f6Title: "对每个年龄层都友好。",
    f6Desc: "长者模式提供更大字号、更少文字与超大触控目标。",
    howKicker: "工作方式",
    howTitle: "三步从空白页面到洞察。",
    howDesc: "无需代码，无需复杂配置——构建、分享、分析。",
    step1Title: "搭建表单",
    step1Desc: "从模板或 AI 草稿开始，添加问题、评分与语言。",
    step2Title: "分享链接",
    step2Desc: "通过二维码、WhatsApp 或嵌入分享，任何手机即刻可用。",
    step3Title: "审阅并行动",
    step3Desc: "答案连同评分与状态，结构化地汇入您的管理后台。",
    adminKicker: "为您的团队",
    adminTitle1: "管理后台",
    adminTitle2: "让工作顺畅推进。",
    adminDesc: "每条回复都进入整洁的工作区：搜索、筛选、更改状态、维护姓名。",
    adminB1: "所有提交汇聚一张表格",
    adminB2: "一键更改状态",
    adminB3: "安全地修改填写者姓名",
    adminB4: "快速搜索与筛选",
    adminCta: "进入管理后台",
    adminMockTitle: "提交记录 · 膝关节疼痛评估",
    adminStat1: "回复数",
    adminStat2: "高风险",
    adminStat3: "平均分",
    closingBadge: "免费演示",
    closingTitle: "从客户视角体验 SpringForm。",
    closingDesc: "打开演示表单，用触控或语音作答，再走进管理后台查看这些答案的落脚处。",
    closingCta: "立即开始演示",
    footerNote: "SpringForm 为演示产品体验。演示内容属于 Spring Hope 骨科诊所。",
    footerOld: "诊所旧版落地页",
  },
};
