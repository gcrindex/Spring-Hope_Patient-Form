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
    demo3Badge: string;
    demo3Title: string;
    demo3Desc: string;
    demo3F1: string;
    demo3F2: string;
    demo3F3: string;
    demo3Cta: string;
    demo3ResearchLink: string;
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
    navPricing: string;
    pricingKicker: string;
    pricingTitle1: string;
    pricingTitle2: string;
    pricingDesc: string;
    pricingMonthly: string;
    pricingYearly: string;
    pricingSave: string;
    tierBasicName: string;
    tierBasicDesc: string;
    tierBasicPriceMonthly: string;
    tierBasicPriceYearly: string;
    tierBasicPeriod: string;
    tierBasicF1: string;
    tierBasicF2: string;
    tierBasicF3: string;
    tierBasicCta: string;
    tierPlusName: string;
    tierPlusBadge: string;
    tierPlusDesc: string;
    tierPlusPriceMonthly: string;
    tierPlusPriceYearly: string;
    tierPlusPeriod: string;
    tierPlusF1: string;
    tierPlusF2: string;
    tierPlusF3: string;
    tierPlusF4: string;
    tierPlusCta: string;
    tierBizName: string;
    tierBizBadge: string;
    tierBizDesc: string;
    tierBizPriceMonthly: string;
    tierBizPriceYearly: string;
    tierBizPeriod: string;
    tierBizF1: string;
    tierBizF2: string;
    tierBizF3: string;
    tierBizF4: string;
    tierBizF5: string;
    tierBizCta: string;
    tierEntName: string;
    tierEntDesc: string;
    tierEntPrice: string;
    tierEntPeriod: string;
    tierEntF1: string;
    tierEntF2: string;
    tierEntF3: string;
    tierEntCta: string;
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
    navDemo: "Live Demo",
    navPricing: "Pricing",
    navAdmin: "Admin Workspace",
    navCta: "Try Interactive Demo",
    badge: "Next-Gen Conversational Forms & AI Workflows",
    heroH1Pre: "Forms that feel like a conversation.",
    heroH1Span: "3x higher completion rate.",
    heroLead:
      "Stop losing respondents to tedious, endless static forms. Guide users one question at a time with frictionless auto-advance, native multilingual voice input, instant risk scoring, and automated system sync.",
    heroCtaPrimary: "Explore Interactive Demo",
    heroCtaSecondary: "Enter Admin Workspace",
    trustNoApp: "Zero app installation",
    trustVoice: "Multilingual voice input",
    mockQuestion: "What is bothering you most today?",
    mockOpt1: "Knee or leg pain",
    mockOpt2: "Back or waist pain",
    mockOpt3: "Shoulder or arm pain",
    mockAuto: "Instant auto-advance — zero friction",
    mockVoiceTitle: "Listening — speak naturally",
    mockVoiceSub: "Voice stays active for following questions",
    mockResponses: "23 new submissions",
    mockResponsesSub: "Knee Pain Assessment · live",
    proof1Number: "78%",
    proof1Title: "Avg. Completion",
    proof1Sub: "vs 30% static forms",
    proof2Number: "01",
    proof2Title: "One Question",
    proof2Sub: "per screen focus",
    proof3Number: "3-Way",
    proof3Title: "Voice, Tap, Type",
    proof3Sub: "multimodal input",
    proof4Number: "< 2m",
    proof4Title: "Avg. Response",
    proof4Sub: "effortless flow",
    indKicker: "Industry Solutions",
    indTitle1: "Purpose-built workflows,",
    indTitle2: "proven higher conversions.",
    indDesc:
      "Replace clunky multi-field questionnaires with fluid, guided micro-steps. Collect higher-quality data across every high-stakes industry.",
    ind1Name: "Healthcare & Clinics",
    ind1Desc: "Patient intake, symptom screening & 1-click EMR triage sync.",
    ind2Name: "Education & Admissions",
    ind2Desc: "Mobile-first student applications, course signups & quizzes.",
    ind3Name: "HR & Talent Screening",
    ind3Desc: "Job applications, candidate screening & pulse surveys.",
    ind4Name: "Events & Conferences",
    ind4Desc: "Frictionless guest check-in, RSVP & real-time session feedback.",
    ind5Name: "Real Estate & Leasing",
    ind5Desc: "Tenant pre-qualification, tour bookings & lead capture.",
    ind6Name: "High-Ticket Retail & F&B",
    ind6Desc: "Personalized customer onboarding, inquiries & order requests.",
    demoKicker: "Interactive Experience",
    demoTitle1: "Experience the difference",
    demoTitle2: "your respondents feel.",
    demoDesc:
      "Test our interactive 9forms flows directly on mobile or desktop. Notice how one-question focus eliminates drop-off.",
    demo1Badge: "Demo 1 · Universal Senior-Friendly",
    demo1Title: "New Patient Intake & History",
    demo1Desc:
      "Zero-friction intake for elderly or urgent patients: big touch targets, simple prompts, and continuous voice-to-text input.",
    demo1F1: "No typing required to get started",
    demo1F2: "High-contrast buttons, readable typography",
    demo1F3: "Smooth auto-advance with persistent voice mode",
    demo1Cta: "Launch Demo 1",
    demo2Badge: "Demo 2 · Clinical Triage",
    demo2Title: "Knee Pain Clinical Assessment",
    demo2Desc:
      "Targeted symptom questionnaire with visual pain scales, instant risk scoring, and structured staff handoff.",
    demo2F1: "1-tap visual 0–10 pain rating scale",
    demo2F2: "Rapid binary & multiple-choice screening",
    demo2F3: "Automatic risk stratification for triage",
    demo2Cta: "Launch Demo 2",
    demo3Badge: "Demo 3 · Senior-Care Dark Contrast",
    demo3Title: "Accessible Senior Registration",
    demo3Desc:
      "Warm charcoal high-contrast palette engineered for vision accessibility with tactile letter tags and voice answer assistance.",
    demo3F1: "Warm Charcoal & Gold high-contrast palette",
    demo3F2: "Tactile letter tags (A/B) with oversized touch targets",
    demo3F3: "Full accessibility + real-time speech recognition",
    demo3Cta: "Launch Demo 3",
    demo3ResearchLink: "Backed by Clinical Usability Research",
    featKicker: "Unfair Advantages",
    featTitle1: "Why conversational forms",
    featTitle2: "outperform traditional ones.",
    featDesc:
      "Engineered to maximize completion rates while feeding clean, structured records directly to your operations.",
    f1Label: "Zero Fatigue",
    f1Title: "One decision per screen.",
    f1Desc: "Break cognitive overload. Showing one question at a time keeps attention locked and reduces abandonment.",
    f2Label: "Smart Flow",
    f2Title: "Frictionless auto-advance.",
    f2Desc: "The interface advances instantly upon selection — eliminating hundreds of repetitive 'Next' clicks.",
    f3Label: "Voice AI",
    f3Title: "Natural speech answering.",
    f3Desc:
      "Respondents speak naturally in their native tongue. Built-in speech recognition transcribes answers accurately in real time.",
    f4Label: "Multilingual",
    f4Title: "English · Indonesian · Mandarin.",
    f4Desc: "Seamless language switching with synchronized voice recognition and localized terminology.",
    f5Label: "Operations Hub",
    f5Title: "Structured admin workspace.",
    f5Desc:
      "Instant risk flags, triage categories, patient dossiers, and automated export ready for your CRM/EMR workflows.",
    f6Label: "Universal Access",
    f6Title: "Built for all ages & abilities.",
    f6Desc: "Tested touch targets, accessible contrasts, and audio-first options for seniors and patients with reduced dexterity.",
    howKicker: "How It Works",
    howTitle: "From setup to actionable data in three steps.",
    howDesc: "No coding required. Launch high-converting workflows in minutes.",
    step1Title: "1. Build with AI or Visual Editor",
    step1Desc: "Select pre-built templates or generate complete multilingual forms with AI in seconds.",
    step2Title: "2. Share Anywhere via Link or QR",
    step2Desc: "Distribute via WhatsApp, SMS, QR codes, or web embeds. Loads instantly on any smartphone browser.",
    step3Title: "3. Receive Structured Data & Triage",
    step3Desc: "Submissions arrive structured with instant scores, automated triage alerts, and API/EMR integrations.",
    adminKicker: "Operational Excellence",
    adminTitle1: "Actionable data,",
    adminTitle2: "zero manual cleanup.",
    adminDesc:
      "Stop deciphering messy handwriting and fragmented emails. Review incoming submissions with automated risk flags, status updates, and one-click actions.",
    adminB1: "Real-time unified submission dashboard",
    adminB2: "Instant risk scoring & triage flags",
    adminB3: "One-click status updates & workflow tracking",
    adminB4: "EMR / API webhook integration ready",
    adminCta: "Access Admin Workspace",
    adminMockTitle: "Live Submissions · Triage Dashboard",
    adminStat1: "Submissions",
    adminStat2: "High Risk",
    adminStat3: "Avg. Triage Score",
    pricingKicker: "Transparent Pricing",
    pricingTitle1: "Simple plans that scale",
    pricingTitle2: "with your business.",
    pricingDesc:
      "All the power of next-gen conversational forms. Choose the plan that matches your monthly volume and team size.",
    pricingMonthly: "Monthly",
    pricingYearly: "Yearly",
    pricingSave: "Save up to 17%",
    tierBasicName: "Basic",
    tierBasicDesc: "For individuals creating simple conversational forms.",
    tierBasicPriceMonthly: "$29",
    tierBasicPriceYearly: "$25",
    tierBasicPeriod: "/ month",
    tierBasicF1: "100 responses / month",
    tierBasicF2: "1 user seat included",
    tierBasicF3: "Unlimited forms & questions",
    tierBasicCta: "Get Started",
    tierPlusName: "Plus",
    tierPlusBadge: "Most Popular",
    tierPlusDesc: "For growing teams ready to brand and scale interactions.",
    tierPlusPriceMonthly: "$59",
    tierPlusPriceYearly: "$50",
    tierPlusPeriod: "/ month",
    tierPlusF1: "1,000 responses / month",
    tierPlusF2: "3 user seats included",
    tierPlusF3: "Remove 9forms branding",
    tierPlusF4: "Custom subdomain & redirect",
    tierPlusCta: "Choose Plus",
    tierBizName: "Business",
    tierBizBadge: "Level Max",
    tierBizDesc: "For power users, clinics & high-volume organizations.",
    tierBizPriceMonthly: "$99",
    tierBizPriceYearly: "$83",
    tierBizPeriod: "/ month",
    tierBizF1: "10,000 responses / month",
    tierBizF2: "5 user seats included",
    tierBizF3: "Drop-off rate & funnel analytics",
    tierBizF4: "Priority support & live triage sync",
    tierBizF5: "EMR & custom webhook integrations",
    tierBizCta: "Upgrade to Business",
    tierEntName: "Enterprise",
    tierEntDesc: "Custom volume, dedicated SLA & security compliance.",
    tierEntPrice: "Custom",
    tierEntPeriod: "tailored billing",
    tierEntF1: "Unlimited responses & seats",
    tierEntF2: "Dedicated account manager",
    tierEntF3: "Custom SLA & HIPAA/GDPR terms",
    tierEntCta: "Contact Sales",
    closingBadge: "Start Free Today",
    closingTitle: "Turn form drop-offs into completed submissions.",
    closingDesc:
      "Test the live conversational demo on your phone, experience voice inputs, and see how clean answers land in your admin workspace.",
    closingCta: "Try Interactive Demo Now",
    footerNote: "9forms.com — High-conversion conversational forms & automated workflows.",
    footerOld: "Clinic Landing Page (Legacy)",
  },
  id: {
    navFeatures: "Fitur",
    navIndustries: "Solusi Industri",
    navDemo: "Demo Interaktif",
    navPricing: "Harga",
    navAdmin: "Workspace Admin",
    navCta: "Coba Demo Interaktif",
    badge: "Formulir Interaktif Generasi Baru & Alur Kerja AI",
    heroH1Pre: "Formulir layaknya percakapan.",
    heroH1Span: "Tingkat selesai 3x lebih tinggi.",
    heroLead:
      "Hentikan formulir statis yang panjang dan membosankan. Bimbing responden satu pertanyaan per layar dengan auto-advance mulus, input suara multibahasa, penilaian risiko otomatis, dan integrasi data instan.",
    heroCtaPrimary: "Coba Demo Interaktif",
    heroCtaSecondary: "Masuk Workspace Admin",
    trustNoApp: "Tanpa instal aplikasi",
    trustVoice: "Input suara multibahasa",
    mockQuestion: "Apa keluhan utama Anda hari ini?",
    mockOpt1: "Nyeri lutut atau kaki",
    mockOpt2: "Sakit pinggang atau punggung",
    mockOpt3: "Nyeri bahu atau lengan",
    mockAuto: "Lanjut otomatis — tanpa klik tombol next",
    mockVoiceTitle: "Mendengarkan — ucapkan jawaban Anda",
    mockVoiceSub: "Mode suara tetap aktif untuk pertanyaan berikutnya",
    mockResponses: "23 respons baru",
    mockResponsesSub: "Asesmen Nyeri Lutut · live",
    proof1Number: "78%",
    proof1Title: "Rata-rata Selesai",
    proof1Sub: "vs 30% form biasa",
    proof2Number: "01",
    proof2Title: "Satu Pertanyaan",
    proof2Sub: "per layar fokus",
    proof3Number: "3 Pilihan",
    proof3Title: "Suara, Sentuh, Ketik",
    proof3Sub: "input fleksibel",
    proof4Number: "< 2 mnt",
    proof4Title: "Waktu Pengisian",
    proof4Sub: "cepat & tanpa beban",
    indKicker: "Solusi Industri",
    indTitle1: "Satu platform,",
    indTitle2: "konversi lebih tinggi di semua sektor.",
    indDesc:
      "Gantikan kuesioner kaku dengan alur mikro terpandu yang nyaman di ponsel. Dapatkan data berkualitas tinggi untuk setiap industri.",
    ind1Name: "Kesehatan & Klinik",
    ind1Desc: "Pendaftaran pasien, skrining gejala & sinkronisasi EMR otomatis.",
    ind2Name: "Pendidikan & Akademik",
    ind2Desc: "Formulir pendaftaran siswa, survei kelas & kuis interaktif.",
    ind3Name: "HR & Rekrutmen",
    ind3Desc: "Lamaran kerja, skrining kualifikasi kandidat & evaluasi tim.",
    ind4Name: "Event & Konferensi",
    ind4Desc: "Check-in tamu tanpa antre, RSVP & feedback sesi real-time.",
    ind5Name: "Properti & Real Estat",
    ind5Desc: "Pra-kualifikasi penyewa, jadwal survei unit & prospek penjualan.",
    ind6Name: "Ritel & Layanan F&B",
    ind6Desc: "Onboarding pelanggan, penanganan keluhan & permintaan pesanan.",
    demoKicker: "Pengalaman Langsung",
    demoTitle1: "Rasakan kemudahan yang",
    demoTitle2: "dialami responden Anda.",
    demoDesc:
      "Coba langsung 3 demo formulir interaktif di ponsel atau laptop Anda. Rasakan bagaimana fokus satu pertanyaan menghilangkan rasa jenuh.",
    demo1Badge: "Demo 1 · Ramah Lansia & Inklusif",
    demo1Title: "Kuesioner Pasien Baru",
    demo1Desc:
      "Formulir tanpa beban untuk lansia: tanpa perlu mengetik nama di awal, tombol sentuh besar, dan dukungan suara instan.",
    demo1F1: "Langsung mulai tanpa ketik nama di awal",
    demo1F2: "Tombol ekstra besar, teks jelas & nyaman dibaca",
    demo1F3: "Lanjut otomatis + mode suara pintar terus aktif",
    demo1Cta: "Buka Demo 1",
    demo2Badge: "Demo 2 · Triase Klinis",
    demo2Title: "Asesmen Nyeri Lutut",
    demo2Desc:
      "Asesmen gejala terfokus dengan skala nyeri visual 0–10, pertanyaan ya/tidak cepat, dan perhitungan skor risiko otomatis.",
    demo2F1: "Skala nyeri visual 0–10 dalam 1 sentuhan",
    demo2F2: "Pertanyaan ya/tidak cepat tanpa lag",
    demo2F3: "Kategorisasi risiko otomatis untuk tim medis",
    demo2Cta: "Buka Demo 2",
    demo3Badge: "Demo 3 · Kontras Tinggi Ramah Lansia",
    demo3Title: "Pendaftaran Lansia Kontras Gelap",
    demo3Desc:
      "Palet warm charcoal & golden yellow kontras tinggi yang dirancang khusus untuk kenyamanan penglihatan lansia.",
    demo3F1: "Desain kontras tinggi Warm Charcoal & Emas",
    demo3F2: "Tombol raksasa dengan penanda huruf A/B yang jelas",
    demo3F3: "Aksesibilitas penuh + pengenalan suara instan",
    demo3Cta: "Buka Demo 3",
    demo3ResearchLink: "Didukung Riset Usabilitas Klinis",
    featKicker: "Keunggulan Utama",
    featTitle1: "Kenapa formulir interaktif",
    featTitle2: "jauh lebih efektif.",
    featDesc:
      "Dirancang untuk meningkatkan tingkat pengisian sekaligus mengirimkan data rapi langsung ke sistem operasional Anda.",
    f1Label: "Tanpa Beban",
    f1Title: "Satu keputusan per layar.",
    f1Desc: "Hilangkan rasa lelah melihat form panjang. Fokus pada satu pertanyaan memastikan responden tidak keluar di tengah jalan.",
    f2Label: "Alur Pintar",
    f2Title: "Lanjut otomatis tanpa tombol next.",
    f2Desc: "Layar langsung berganti begitu opsi dipilih — menghemat puluhan klik tombol 'Berikutnya'.",
    f3Label: "Voice AI",
    f3Title: "Jawab alami dengan suara.",
    f3Desc:
      "Responden cukup berbicara dalam bahasa mereka. Fitur pengenalan suara bawaan mengubah ucapan menjadi jawaban teks yang rapi.",
    f4Label: "Multibahasa",
    f4Title: "Indonesia · English · Mandarin.",
    f4Desc: "Pilihan bahasa real-time yang langsung menyinkronkan tampilan dan pengenalan suara.",
    f5Label: "Pusat Operasional",
    f5Title: "Workspace admin yang terstruktur.",
    f5Desc:
      "Status triase otomatis, rekam data pasien, dan integrasi siap pakai untuk EMR/CRM tanpa olah manual.",
    f6Label: "Aksesibilitas",
    f6Title: "Ramah untuk semua usia & kondisi.",
    f6Desc: "Tombol sentuh ekstra besar, kontras nyaman, dan opsi suara untuk lansia atau mereka yang sulit mengetik.",
    howKicker: "Cara Kerja",
    howTitle: "Dari pembuatan hingga terima data dalam 3 langkah.",
    howDesc: "Tanpa coding. Siapkan formulir berkonversi tinggi dalam hitungan menit.",
    step1Title: "1. Buat dengan AI atau Template",
    step1Desc: "Pilih template siap pakai atau hasilkan formulir multibahasa lengkap menggunakan AI dalam sekejap.",
    step2Title: "2. Bagikan via Link atau QR",
    step2Desc: "Kirim lewat WhatsApp, QR code, atau sematkan di website. Terbuka cepat di browser ponsel apa pun.",
    step3Title: "3. Terima Data & Skor Otomatis",
    step3Desc: "Jawaban masuk secara terstruktur lengkap dengan skor risiko, status triase, dan integrasi API/EMR.",
    adminKicker: "Keunggulan Operasional",
    adminTitle1: "Data terstruktur,",
    adminTitle2: "tanpa rekap manual.",
    adminDesc:
      "Tinggalkan catatan kertas yang sulit dibaca. Kelola setiap pengiriman data dengan skor risiko instan, pembaruan status cepat, dan pencarian cerdas.",
    adminB1: "Dasbor pemantauan respons terpadu real-time",
    adminB2: "Perhitungan skor & kategori risiko otomatis",
    adminB3: "Pembaruan status triase dalam 1 klik",
    adminB4: "Siap terhubung ke webhook API & EMR medis",
    adminCta: "Buka Workspace Admin",
    adminMockTitle: "Data Masuk · Dasbor Triase",
    adminStat1: "Total Respons",
    adminStat2: "Risiko Tinggi",
    adminStat3: "Rata-rata Skor",
    pricingKicker: "Pilihan Harga Transparan",
    pricingTitle1: "Paket simpel yang tumbuh",
    pricingTitle2: "bersama bisnis Anda.",
    pricingDesc:
      "Nikmati keunggulan formulir interaktif generasi baru. Pilih paket yang sesuai dengan volume respon dan ukuran tim Anda.",
    pricingMonthly: "Bulanan",
    pricingYearly: "Tahunan",
    pricingSave: "Hemat hingga 17%",
    tierBasicName: "Basic",
    tierBasicDesc: "Untuk individu yang membutuhkan formulir interaktif simpel.",
    tierBasicPriceMonthly: "$29",
    tierBasicPriceYearly: "$25",
    tierBasicPeriod: "/ bulan",
    tierBasicF1: "100 respon / bulan",
    tierBasicF2: "Termasuk 1 akses pengguna",
    tierBasicF3: "Jumlah form & pertanyaan tanpa batas",
    tierBasicCta: "Mulai Sekarang",
    tierPlusName: "Plus",
    tierPlusBadge: "Paling Populer",
    tierPlusDesc: "Untuk tim berkembang yang ingin branding profesional.",
    tierPlusPriceMonthly: "$59",
    tierPlusPriceYearly: "$50",
    tierPlusPeriod: "/ bulan",
    tierPlusF1: "1.000 respon / bulan",
    tierPlusF2: "Termasuk 3 akses pengguna",
    tierPlusF3: "Hapus branding 9forms",
    tierPlusF4: "Custom subdomain & redirect link",
    tierPlusCta: "Pilih Plus",
    tierBizName: "Business",
    tierBizBadge: "Level Max",
    tierBizDesc: "Untuk klinik, organisasi & operasional bervolume tinggi.",
    tierBizPriceMonthly: "$99",
    tierBizPriceYearly: "$83",
    tierBizPeriod: "/ bulan",
    tierBizF1: "10.000 respon / bulan",
    tierBizF2: "Termasuk 5 akses pengguna",
    tierBizF3: "Analitik drop-off rate & corong konversi",
    tierBizF4: "Prioritas dukungan & sinkronisasi triase",
    tierBizF5: "Integrasi EMR & webhook API kustom",
    tierBizCta: "Upgrade ke Business",
    tierEntName: "Enterprise",
    tierEntDesc: "Volume kustom, SLA dedikasi & kepatuhan privasi ketat.",
    tierEntPrice: "Kustom",
    tierEntPeriod: "penagihan khusus",
    tierEntF1: "Respon & akun pengguna tanpa batas",
    tierEntF2: "Dedicated account manager",
    tierEntF3: "SLA khusus & kesepakatan HIPAA/GDPR",
    tierEntCta: "Hubungi Sales",
    closingBadge: "Mulai Gratis",
    closingTitle: "Tingkatkan respon formulir Anda hingga 3x lipat.",
    closingDesc:
      "Coba demo formulir interaktif di ponsel Anda, rasakan kemudahan input suara, dan lihat bagaimana data rapi langsung masuk ke admin.",
    closingCta: "Coba Demo Interaktif Sekarang",
    footerNote: "9forms.com — Formulir interaktif cerdas & alur kerja otomatis.",
    footerOld: "Landing page klinik (versi lama)",
  },
  zh: {
    navFeatures: "功能特性",
    navIndustries: "行业方案",
    navDemo: "在线演示",
    navPricing: "价格方案",
    navAdmin: "管理工作区",
    navCta: "体验互动演示",
    badge: "新一代对话式表单与 AI 自动化工作流",
    heroH1Pre: "像对话一样自然的智能表单。",
    heroH1Span: "完成率提升 3 倍。",
    heroLead:
      "告别繁琐冗长、填到一半就放弃的传统静态表单。通过一屏一题的引导式交互、无感自动跳转、多语言语音输入以及即时风险评分，让数据收集轻松高效。",
    heroCtaPrimary: "体验在线互动演示",
    heroCtaSecondary: "进入管理工作区",
    trustNoApp: "无需下载安装 App",
    trustVoice: "多语言原生语音输入",
    mockQuestion: "您今天最不舒服的地方是？",
    mockOpt1: "膝盖或腿部疼痛",
    mockOpt2: "腰部或背部酸痛",
    mockOpt3: "肩膀或手臂疼痛",
    mockAuto: "极速自动跳转——无需费心寻找下一题",
    mockVoiceTitle: "正在聆听——请自然说话作答",
    mockVoiceSub: "后续题目将保持语音识别开启",
    mockResponses: "23 条新提交",
    mockResponsesSub: "膝关节疼痛评估 · 实时",
    proof1Number: "78%",
    proof1Title: "平均完成率",
    proof1Sub: "传统表单仅约 30%",
    proof2Number: "01",
    proof2Title: "一屏一题",
    proof2Sub: "全专注交互",
    proof3Number: "3 种模式",
    proof3Title: "语音·触控·打字",
    proof3Sub: "灵活无障碍",
    proof4Number: "< 2 分钟",
    proof4Title: "极速填写",
    proof4Sub: "流畅零负担",
    indKicker: "行业解决方案",
    indTitle1: "专属场景工作流，",
    indTitle2: "全面提升表单转化率。",
    indDesc:
      "用移动端优先的引导式微步骤替代繁重冗长的多字段表格。在各大关键业务场景中收集更高质量的结构化数据。",
    ind1Name: "医疗与专科诊所",
    ind1Desc: "患者初诊登记、症状分流筛查与 EMR 电子病历一键同步。",
    ind2Name: "教育机构与招生",
    ind2Desc: "移动端学生报名申请、课程注册与互动测验问卷。",
    ind3Name: "人力资源与招聘",
    ind3Desc: "求职申请、候选人资质预审与员工满意度调查。",
    ind4Name: "大型活动与会议",
    ind4Desc: "无排队快速签到、参会回执与实时现场反馈。",
    ind5Name: "房产中介与租赁",
    ind5Desc: "租客资格预审、看房预约登记与高意向客户收集。",
    ind6Name: "高客单零售与餐饮",
    ind6Desc: "客户定制咨询、售后回访与订单意向收集。",
    demoKicker: "沉浸式体验",
    demoTitle1: "亲自体验您的用户",
    demoTitle2: "感受到的顺畅与高效。",
    demoDesc:
      "在手机或电脑上即刻体验 3 款互动演示表单。亲身感受一屏一题如何彻底杜绝中途放弃。",
    demo1Badge: "演示 1 · 长者关怀无障碍",
    demo1Title: "新患者初诊健康问卷",
    demo1Desc:
      "专为长者或身体不适患者设计的零负担登记：无需开始打字、超大触控按键、支持全程语音作答。",
    demo1F1: "无需打字输入姓名即可即刻作答",
    demo1F2: "高对比度超大按键，文字清晰易读",
    demo1F3: "丝滑自动跳转与持续智能语音识别",
    demo1Cta: "启动演示 1",
    demo2Badge: "演示 2 · 临床分流评估",
    demo2Title: "膝关节疼痛临床评估",
    demo2Desc:
      "聚焦症状的专业问卷：0–10 分级直观疼痛量表、快速是非题与医护团队专属自动风险评分。",
    demo2F1: "一触即选的 0–10 视觉疼痛量表",
    demo2F2: "极速无延迟的是非与多选题",
    demo2F3: "即时风险分层与分诊等级计算",
    demo2Cta: "启动演示 2",
    demo3Badge: "演示 3 · 长者关怀高对比深色版",
    demo3Title: "无障碍长者健康登记",
    demo3Desc:
      "专为视觉无障碍优化的暖炭黑与暖金黄高对比度配色，配备带字母标识的超大按键与语音辅助。",
    demo3F1: "暖炭黑与暖金黄高对比度界面",
    demo3F2: "带 A/B 标识的超大触控按键",
    demo3F3: "全面无障碍设计与实时语音转换",
    demo3Cta: "启动演示 3",
    demo3ResearchLink: "基于临床可用性学术研究设计",
    featKicker: "核心竞争优势",
    featTitle1: "为什么对话式表单的",
    featTitle2: "表现远胜传统表单。",
    featDesc:
      "专注于最大化提升完成率，同时将清洗完毕的结构化数据直接注入您的业务系统与工作流。",
    f1Label: "零负担交互",
    f1Title: "一屏仅做一个决策。",
    f1Desc: "彻底消除面对密密麻麻输入框时的焦虑感。一次聚焦一个问题，答卷完成率提升至最高。",
    f2Label: "智能流转",
    f2Title: "选择即跳，告别“下一步”。",
    f2Desc: "点击选项后立即自动切入下一题——免除成百上千次重复点击“下一页”的冗余操作。",
    f3Label: "语音 AI",
    f3Title: "自然开口，即说即填。",
    f3Desc:
      "受访者可以用母语自然口述。内置语音识别技术实时将语音精准转录为结构化文本答案。",
    f4Label: "多语言无缝切换",
    f4Title: "英语 · 印尼语 · 中文简体。",
    f4Desc: "一键切换语种，界面文本与语音识别语种自动同步，消除语言隔阂。",
    f5Label: "运营中枢",
    f5Title: "结构化管理工作区。",
    f5Desc:
      "自动风险标示、分诊分类、患者详细档案，并支持一键导出或直连外部 EMR/CRM 系统。",
    f6Label: "全龄友好",
    f6Title: "老少皆宜的包容性体验。",
    f6Desc: "超大点击区域、清晰对比度与语音优先模式，让长者与不便打字的用户也能轻松完成。",
    howKicker: "运作流程",
    howTitle: "三步完成从表单创建到数据洞察。",
    howDesc: "无需编写代码，几分钟内即可上线高转化率的互动表单工作流。",
    step1Title: "1. 通过 AI 或模板快速构建",
    step1Desc: "选择开箱即用的行业模板，或利用 AI 在数秒内生成多语言专业表单。",
    step2Title: "2. 通过链接或二维码一键分享",
    step2Desc: "支持 WhatsApp、短信、二维码或网页内嵌，任何手机浏览器即点即开。",
    step3Title: "3. 实时接收结构化数据与评分",
    step3Desc: "提交内容实时汇总入库，附带即时风险评分、自动分诊提示与 API/EMR 接口同步。",
    adminKicker: "高效运营保障",
    adminTitle1: "结构化数据流转，",
    adminTitle2: "杜绝人工整理耗时。",
    adminDesc:
      "告别字迹模糊的手写纸质单和碎片化的邮件沟通。在一体化后台中查看自动风险评级、一键更新处理状态并随时检索。",
    adminB1: "实时统一的提交记录监控仪表盘",
    adminB2: "即时风险评分与自动分诊预警",
    adminB3: "一键切换跟进状态与流程标记",
    adminB4: "支持对接 Webhook API 与医疗 EMR",
    adminCta: "进入管理工作区",
    adminMockTitle: "实时提交 · 分诊监控台",
    adminStat1: "总回复数",
    adminStat2: "高风险预警",
    adminStat3: "平均分诊得分",
    pricingKicker: "透明价格体系",
    pricingTitle1: "简单灵活的方案，",
    pricingTitle2: "随业务规模自由扩展。",
    pricingDesc:
      "体验新一代对话式表单的全部潜能。根据团队每月答卷量与席位需求选择最适合的方案。",
    pricingMonthly: "按月结算",
    pricingYearly: "按年结算",
    pricingSave: "立省最高 17%",
    tierBasicName: "基础版",
    tierBasicDesc: "适用于制作简单交互表单的个人或自由职业者。",
    tierBasicPriceMonthly: "$29",
    tierBasicPriceYearly: "$25",
    tierBasicPeriod: "/ 月",
    tierBasicF1: "每月 100 条答卷额度",
    tierBasicF2: "包含 1 个管理员席位",
    tierBasicF3: "不限表单数量与题目数",
    tierBasicCta: "立即开通",
    tierPlusName: "进阶版",
    tierPlusBadge: "最受欢迎",
    tierPlusDesc: "适用于需要独立品牌形象与多席位协作的成长型团队。",
    tierPlusPriceMonthly: "$59",
    tierPlusPriceYearly: "$50",
    tierPlusPeriod: "/ 月",
    tierPlusF1: "每月 1,000 条答卷额度",
    tierPlusF2: "包含 3 个协作席位",
    tierPlusF3: "移除 9forms 官方标识",
    tierPlusF4: "自定义二级域名与跳转链接",
    tierPlusCta: "选择进阶版",
    tierBizName: "企业商业版",
    tierBizBadge: "Level Max",
    tierBizDesc: "专为诊所、高频业务机构与大型组织深度定制。",
    tierBizPriceMonthly: "$99",
    tierBizPriceYearly: "$83",
    tierBizPeriod: "/ 月",
    tierBizF1: "每月 10,000 条答卷额度",
    tierBizF2: "包含 5 个协作席位",
    tierBizF3: "用户跳出率与漏斗转化分析",
    tierBizF4: "优先专属技术支持与实时分流同步",
    tierBizF5: "EMR 电子病历与自定义 Webhook 对接",
    tierBizCta: "升级至企业商业版",
    tierEntName: "尊享定制版",
    tierEntDesc: "无限用量、专属 SLA 保障与合规企业支持。",
    tierEntPrice: "定制",
    tierEntPeriod: "专属报价结算",
    tierEntF1: "无限答卷额度与协作席位",
    tierEntF2: "专属客户成功经理",
    tierEntF3: "定制 SLA 保障与隐私合规协议",
    tierEntCta: "联系销售团队",
    closingBadge: "立即免费体验",
    closingTitle: "让流失的访客转化为满分的答卷。",
    closingDesc:
      "在手机上体验流畅的对话式交互与语音作答，亲眼见证整洁结构化的数据如何实时进入管理后台。",
    closingCta: "立即体验互动演示",
    footerNote: "9forms.com — 高转化对话式表单与自动化工作流平台。",
    footerOld: "诊所旧版落地页 (Legacy)",
  },
};
