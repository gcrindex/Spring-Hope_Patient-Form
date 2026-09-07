export type Language = "en" | "id" | "zh";
export type QuestionType = "choice" | "yesno" | "scale" | "text";
export type RiskLevel = "low" | "mod" | "high";

export type Localized = Record<Language, string>;

export type QuestionOption = {
  value: string;
  label: Localized;
  score: number;
  aliases?: Partial<Record<Language, string[]>>;
};

export type Question = {
  id: string;
  type: QuestionType;
  prompt: Localized;
  helper?: Localized;
  options?: QuestionOption[];
  max?: number;
  optional?: boolean;
};

export type AssessmentForm = {
  id: string;
  title: Localized;
  description: Localized;
  status: "draft" | "published";
  questions: Question[];
};

export type Answers = Record<string, string | number>;

export type TriageStatus = "review" | "scheduled" | "completed";

export type Submission = {
  id: string;
  formId: string;
  patientName: string;
  submittedAt: string;
  answers: Answers;
  score: number;
  risk: RiskLevel;
  triageStatus?: TriageStatus;
};

export const languages: Array<{ value: Language; short: string; label: string; locale: string }> = [
  { value: "en", short: "EN", label: "English", locale: "en-SG" },
  { value: "id", short: "ID", label: "Bahasa Indonesia", locale: "id-ID" },
  { value: "zh", short: "中文", label: "简体中文", locale: "zh-CN" },
];

export const copy = {
  en: {
    continue: "Continue",
    back: "Back",
    voice: "Answer by voice",
    listening: "Listening…",
    processing: "Understanding your answer…",
    heard: "I heard",
    confirm: "Use this answer",
    change: "Change answer",
    retry: "Try again",
    manual: "Answer manually",
    unsupported: "Voice answering isn't available on this browser.",
    denied: "Microphone access is turned off.",
    noSpeech: "I didn't catch that.",
    voiceHint: "Say your answer naturally",
    questionOf: "Question",
    optional: "Optional",
  },
  id: {
    continue: "Lanjut",
    back: "Kembali",
    voice: "Jawab dengan suara",
    listening: "Mendengarkan…",
    processing: "Memahami jawaban Anda…",
    heard: "Saya mendengar",
    confirm: "Gunakan jawaban ini",
    change: "Ubah jawaban",
    retry: "Coba lagi",
    manual: "Jawab manual",
    unsupported: "Jawaban suara tidak tersedia di browser ini.",
    denied: "Akses mikrofon dimatikan.",
    noSpeech: "Saya belum menangkap jawabannya.",
    voiceHint: "Ucapkan jawaban Anda dengan natural",
    questionOf: "Pertanyaan",
    optional: "Opsional",
  },
  zh: {
    continue: "继续",
    back: "返回",
    voice: "语音回答",
    listening: "正在聆听…",
    processing: "正在理解您的回答…",
    heard: "我听到",
    confirm: "使用此答案",
    change: "更改答案",
    retry: "重试",
    manual: "手动回答",
    unsupported: "此浏览器不支持语音回答。",
    denied: "麦克风权限已关闭。",
    noSpeech: "我没有听清。",
    voiceHint: "请自然地说出您的答案",
    questionOf: "问题",
    optional: "可选",
  },
} satisfies Record<Language, Record<string, string>>;

export const newPatientForm: AssessmentForm = {
  id: "new-patient-intake",
  title: {
    en: "New Patient Registration",
    id: "Pendaftaran Pasien Baru",
    zh: "新患者初诊登记",
  },
  description: {
    en: "Quick, large-button guided intake designed for elderly & first-time patients.",
    id: "Formulir ramah lansia berhuruf besar dan tombol mudah untuk pasien pertama kali.",
    zh: "专为长者设计的清晰大字号初诊导引表单。",
  },
  status: "published",
  questions: [
    {
      id: "q_np_who",
      type: "choice",
      prompt: {
        en: "Who is this visit for?",
        id: "Pemeriksaan ini untuk siapa?",
        zh: "这次看诊是为谁登记？",
      },
      helper: {
        en: "Tap one answer to proceed.",
        id: "Cukup sentuh satu pilihan.",
        zh: "点击一个选项即可继续。",
      },
      options: [
        {
          value: "myself",
          label: { en: "Myself", id: "Untuk Diri Sendiri", zh: "本人" },
          score: 1,
          aliases: {
            en: ["myself", "me", "for myself"],
            id: ["diri sendiri", "saya sendiri", "saya"],
            zh: ["本人", "我自己"],
          },
        },
        {
          value: "family",
          label: { en: "Family member / Parent", id: "Orang Tua / Keluarga", zh: "父母 / 家人" },
          score: 2,
          aliases: {
            en: ["family", "parent", "mother", "father"],
            id: ["orang tua", "keluarga", "ibu", "ayah", "anak"],
            zh: ["父母", "家人", "长辈"],
          },
        },
      ],
    },
    {
      id: "q_np_complaint",
      type: "choice",
      prompt: {
        en: "What hurts or bothers you most?",
        id: "Keluhan apa yang paling dirasakan?",
        zh: "目前最主要的不适是什么？",
      },
      helper: {
        en: "Choose the main issue.",
        id: "Pilih keluhan utama Anda.",
        zh: "请选择最主要的症状。",
      },
      options: [
        {
          value: "knee-joint",
          label: { en: "Knee or Leg Pain", id: "Nyeri Lutut atau Kaki", zh: "膝盖或腿部疼痛" },
          score: 10,
          aliases: {
            en: ["knee", "leg", "knee pain"],
            id: ["lutut", "kaki", "nyeri lutut"],
            zh: ["膝盖", "腿痛", "膝痛"],
          },
        },
        {
          value: "back-spine",
          label: {
            en: "Back or Waist Pain",
            id: "Sakit Pinggang / Punggung",
            zh: "腰部或背部酸痛",
          },
          score: 10,
          aliases: {
            en: ["back", "waist", "spine"],
            id: ["pinggang", "punggung", "tulang belakang"],
            zh: ["腰痛", "背痛", "腰椎"],
          },
        },
        {
          value: "shoulder-arm",
          label: { en: "Shoulder or Arm Pain", id: "Nyeri Bahu / Lengan", zh: "肩膀或手臂疼痛" },
          score: 8,
          aliases: {
            en: ["shoulder", "arm"],
            id: ["bahu", "lengan", "tangan"],
            zh: ["肩膀", "手臂", "肩痛"],
          },
        },
        {
          value: "fall-injury",
          label: {
            en: "Recent Fall or Injury",
            id: "Baru Saja Jatuh / Cedera",
            zh: "近期跌倒或扭伤",
          },
          score: 15,
          aliases: {
            en: ["fall", "injury", "accident"],
            id: ["jatuh", "cedera", "keseleo", "terpeleset"],
            zh: ["摔倒", "跌倒", "受伤"],
          },
        },
      ],
    },
    {
      id: "q_np_mobility",
      type: "choice",
      prompt: {
        en: "How are you walking today?",
        id: "Bagaimana cara berjalan saat ini?",
        zh: "您今天行动自如吗？",
      },
      helper: {
        en: "We will prepare walking aid if needed.",
        id: "Kami siapkan kursi roda jika diperlukan.",
        zh: "如有需要我们将为您准备轮椅助行。",
      },
      options: [
        {
          value: "independent",
          label: { en: "Walk on my own", id: "Bisa jalan sendiri normal", zh: "可以自己正常走" },
          score: 0,
          aliases: {
            en: ["independent", "normal", "on my own"],
            id: ["sendiri", "normal", "bisa sendiri"],
            zh: ["自己走", "正常"],
          },
        },
        {
          value: "cane-assisted",
          label: {
            en: "Need a cane or someone helping",
            id: "Pakai tongkat / dipapah",
            zh: "需要拄拐或家人搀扶",
          },
          score: 10,
          aliases: {
            en: ["cane", "stick", "someone helping"],
            id: ["tongkat", "dipapah", "dibantu"],
            zh: ["拄拐", "搀扶", "拐杖"],
          },
        },
        {
          value: "wheelchair",
          label: { en: "Need wheelchair", id: "Perlu kursi roda", zh: "需要轮椅" },
          score: 18,
          aliases: { en: ["wheelchair"], id: ["kursi roda", "roda"], zh: ["轮椅"] },
        },
      ],
    },
    {
      id: "q_np_pain_level",
      type: "scale",
      prompt: {
        en: "How strong is the pain today?",
        id: "Seberapa berat rasa sakitnya saat ini?",
        zh: "今天的疼痛感有多强烈？",
      },
      helper: {
        en: "0 is no pain, 10 is very severe pain.",
        id: "0 tidak sakit, 10 sakit sekali.",
        zh: "0为完全不痛，10为剧烈疼痛。",
      },
      max: 10,
    },
    {
      id: "q_np_first_time",
      type: "yesno",
      prompt: {
        en: "Is this your first time at this clinic?",
        id: "Apakah ini pertama kali berobat di klinik kami?",
        zh: "这是您第一次来我们诊所吗？",
      },
      options: [
        {
          value: "yes",
          label: { en: "Yes, First Time", id: "Ya, Pertama Kali", zh: "是的，初次就诊" },
          score: 5,
          aliases: {
            en: ["yes", "first time"],
            id: ["ya", "pertama", "iya"],
            zh: ["是的", "对", "第一次"],
          },
        },
        {
          value: "no",
          label: { en: "No, Have Visited Before", id: "Bukan, Sudah Pernah", zh: "不是，曾来看过" },
          score: 0,
          aliases: {
            en: ["no", "visited before", "already"],
            id: ["bukan", "sudah pernah", "tidak"],
            zh: ["不是", "看过了", "复诊"],
          },
        },
      ],
    },
    {
      id: "q_np_name",
      type: "text",
      optional: true,
      prompt: {
        en: "What is your name?",
        id: "Siapa nama panggilan atau nama lengkap Anda?",
        zh: "请问您的姓名或称呼是？",
      },
      helper: {
        en: "Speak or type your name. You may also skip.",
        id: "Cukup ucapkan lewat suara atau ketik. Boleh dilewati.",
        zh: "可直接语音说出姓名，或输入，也可跳过。",
      },
    },
  ],
};

export const kneePainForm: AssessmentForm = {
  id: "knee-pain-assessment",
  title: {
    en: "Knee Pain Assessment",
    id: "Penilaian Nyeri Lutut",
    zh: "膝关节疼痛评估",
  },
  description: {
    en: "A short guided assessment to help Spring Hope prepare for your visit.",
    id: "Penilaian singkat untuk membantu Spring Hope mempersiapkan kunjungan Anda.",
    zh: "一份简短的引导式评估，帮助 Spring Hope 为您的就诊做好准备。",
  },
  status: "published",
  questions: [
    {
      id: "q_age",
      type: "choice",
      prompt: {
        en: "How old are you?",
        id: "Berapa usia Anda?",
        zh: "您的年龄是多少？",
      },
      helper: {
        en: "Choose the range that fits best.",
        id: "Pilih rentang usia yang paling sesuai.",
        zh: "请选择最符合您的年龄范围。",
      },
      options: [
        {
          value: "under-30",
          label: { en: "Under 30", id: "Di bawah 30", zh: "30岁以下" },
          score: 1,
          aliases: {
            en: ["under thirty", "below thirty"],
            id: ["di bawah tiga puluh"],
            zh: ["三十岁以下"],
          },
        },
        {
          value: "30-44",
          label: { en: "30–44", id: "30–44", zh: "30–44岁" },
          score: 2,
          aliases: {
            en: ["thirty to forty four"],
            id: ["tiga puluh sampai empat puluh empat"],
            zh: ["三十到四十四"],
          },
        },
        {
          value: "45-64",
          label: { en: "45–64", id: "45–64", zh: "45–64岁" },
          score: 3,
          aliases: {
            en: ["forty five to sixty four"],
            id: ["empat puluh lima sampai enam puluh empat"],
            zh: ["四十五到六十四"],
          },
        },
        {
          value: "65-plus",
          label: { en: "65 or older", id: "65 atau lebih", zh: "65岁或以上" },
          score: 4,
          aliases: {
            en: ["sixty five or older", "over sixty five"],
            id: ["enam puluh lima atau lebih"],
            zh: ["六十五岁以上"],
          },
        },
      ],
    },
    {
      id: "q_duration",
      type: "choice",
      prompt: {
        en: "How long have you had knee pain?",
        id: "Sudah berapa lama lutut Anda terasa nyeri?",
        zh: "您的膝盖疼痛多久了？",
      },
      helper: {
        en: "An estimate is completely fine.",
        id: "Perkiraan tidak masalah.",
        zh: "大概估计即可。",
      },
      options: [
        {
          value: "lt-1m",
          label: { en: "Less than 1 month", id: "Kurang dari 1 bulan", zh: "少于1个月" },
          score: 2,
          aliases: {
            en: ["less than one month"],
            id: ["kurang dari satu bulan"],
            zh: ["不到一个月"],
          },
        },
        {
          value: "1-3m",
          label: { en: "1–3 months", id: "1–3 bulan", zh: "1–3个月" },
          score: 5,
          aliases: {
            en: ["one to three months"],
            id: ["satu sampai tiga bulan"],
            zh: ["一到三个月"],
          },
        },
        {
          value: "3-6m",
          label: { en: "3–6 months", id: "3–6 bulan", zh: "3–6个月" },
          score: 8,
          aliases: {
            en: ["three to six months"],
            id: ["tiga sampai enam bulan"],
            zh: ["三到六个月"],
          },
        },
        {
          value: "gt-6m",
          label: { en: "More than 6 months", id: "Lebih dari 6 bulan", zh: "超过6个月" },
          score: 12,
          aliases: {
            en: ["more than six months", "over six months"],
            id: ["lebih dari enam bulan"],
            zh: ["六个月以上"],
          },
        },
      ],
    },
    {
      id: "q_pain",
      type: "scale",
      prompt: {
        en: "Rate your pain right now",
        id: "Nilai rasa nyeri Anda saat ini",
        zh: "请评价您现在的疼痛程度",
      },
      helper: {
        en: "0 means no pain. 10 means the worst pain you can imagine.",
        id: "0 berarti tidak nyeri. 10 berarti nyeri terberat yang dapat Anda bayangkan.",
        zh: "0表示无疼痛，10表示您能想象到的最严重疼痛。",
      },
      max: 10,
    },
    {
      id: "q_swelling",
      type: "yesno",
      prompt: {
        en: "Do you have swelling in your knee?",
        id: "Apakah lutut Anda bengkak?",
        zh: "您的膝盖有肿胀吗？",
      },
      options: [
        {
          value: "yes",
          label: { en: "Yes", id: "Ya", zh: "有" },
          score: 12,
          aliases: { en: ["yes", "yeah", "yep"], id: ["ya", "iya"], zh: ["有", "是", "有的"] },
        },
        {
          value: "no",
          label: { en: "No", id: "Tidak", zh: "没有" },
          score: 0,
          aliases: {
            en: ["no", "nope"],
            id: ["tidak", "nggak", "enggak"],
            zh: ["没有", "不是", "无"],
          },
        },
      ],
    },
    {
      id: "q_locking",
      type: "yesno",
      prompt: {
        en: "Does your knee ever lock or get stuck?",
        id: "Apakah lutut Anda pernah terkunci atau terasa macet?",
        zh: "您的膝盖会卡住或锁住吗？",
      },
      options: [
        {
          value: "yes",
          label: { en: "Yes", id: "Ya", zh: "会" },
          score: 16,
          aliases: { en: ["yes", "yeah", "yep"], id: ["ya", "iya"], zh: ["会", "是", "有"] },
        },
        {
          value: "no",
          label: { en: "No", id: "Tidak", zh: "不会" },
          score: 0,
          aliases: {
            en: ["no", "nope"],
            id: ["tidak", "nggak", "enggak"],
            zh: ["不会", "不是", "没有"],
          },
        },
      ],
    },
    {
      id: "q_instability",
      type: "yesno",
      prompt: {
        en: "Does your knee feel unstable or give way?",
        id: "Apakah lutut terasa tidak stabil atau seperti akan lepas?",
        zh: "您的膝盖会感觉不稳或突然无力吗？",
      },
      options: [
        {
          value: "yes",
          label: { en: "Yes", id: "Ya", zh: "会" },
          score: 16,
          aliases: { en: ["yes", "yeah", "yep"], id: ["ya", "iya"], zh: ["会", "是", "有"] },
        },
        {
          value: "no",
          label: { en: "No", id: "Tidak", zh: "不会" },
          score: 0,
          aliases: {
            en: ["no", "nope"],
            id: ["tidak", "nggak", "enggak"],
            zh: ["不会", "不是", "没有"],
          },
        },
      ],
    },
    {
      id: "q_notes",
      type: "text",
      optional: true,
      prompt: {
        en: "Anything else you'd like the clinic to know?",
        id: "Ada hal lain yang ingin Anda sampaikan ke klinik?",
        zh: "还有什么想告诉诊所的吗？",
      },
      helper: {
        en: "You can type or dictate a short note.",
        id: "Anda bisa mengetik atau mendikte catatan singkat.",
        zh: "您可以输入或语音记录一段简短说明。",
      },
    },
  ],
};

export const allForms: AssessmentForm[] = [newPatientForm, kneePainForm];

export function getFormById(id?: string | null): AssessmentForm {
  if (!id) return newPatientForm;
  return allForms.find((f) => f.id === id) ?? newPatientForm;
}

export const demoSubmissions: Submission[] = [
  {
    id: "sub-1029",
    formId: newPatientForm.id,
    patientName: "Opa Sutrisno",
    submittedAt: "2026-09-03T04:10:00.000Z",
    answers: {
      q_np_who: "myself",
      q_np_complaint: "knee-joint",
      q_np_mobility: "cane-assisted",
      q_np_pain_level: 7,
      q_np_first_time: "yes",
      q_np_name: "Opa Sutrisno",
    },
    score: 42,
    risk: "mod",
    triageStatus: "review",
  },
  {
    id: "sub-1028",
    formId: kneePainForm.id,
    patientName: "Tan Wei Ling",
    submittedAt: "2026-09-03T03:14:00.000Z",
    answers: {},
    score: 68,
    risk: "high",
    triageStatus: "review",
  },
  {
    id: "sub-1027",
    formId: kneePainForm.id,
    patientName: "Aisha Rahman",
    submittedAt: "2026-09-03T02:41:00.000Z",
    answers: {},
    score: 48,
    risk: "mod",
    triageStatus: "scheduled",
  },
  {
    id: "sub-1026",
    formId: kneePainForm.id,
    patientName: "Lim Jia Hao",
    submittedAt: "2026-09-02T09:22:00.000Z",
    answers: {},
    score: 21,
    risk: "low",
    triageStatus: "completed",
  },
  {
    id: "sub-1025",
    formId: kneePainForm.id,
    patientName: "Nur Aisyah",
    submittedAt: "2026-09-02T06:08:00.000Z",
    answers: {},
    score: 36,
    risk: "mod",
    triageStatus: "scheduled",
  },
];

export function getRisk(score: number): RiskLevel {
  if (score <= 30) return "low";
  if (score <= 60) return "mod";
  return "high";
}

export function calculateScore(answers: Answers, form = kneePainForm) {
  return form.questions.reduce((total, question) => {
    const value = answers[question.id];
    if (value === undefined || value === "") return total;
    if (question.type === "scale") return total + Number(value) * 3;
    if (question.type === "text") return total;
    const option = question.options?.find((item) => item.value === value);
    return total + (option?.score ?? 0);
  }, 0);
}

export function localeFor(language: Language) {
  return languages.find((item) => item.value === language)?.locale ?? "en-SG";
}

export function normalizeSpeech(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[.,!?，。！？]/g, "")
    .replace(/\s+/g, " ");
}

const spokenNumbers: Record<Language, Record<string, number>> = {
  en: {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
  },
  id: {
    nol: 0,
    satu: 1,
    dua: 2,
    tiga: 3,
    empat: 4,
    lima: 5,
    enam: 6,
    tujuh: 7,
    delapan: 8,
    sembilan: 9,
    sepuluh: 10,
  },
  zh: { 零: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 },
};

export function parseScaleTranscript(transcript: string, language: Language, max = 10) {
  const normalized = normalizeSpeech(transcript);

  // 1. Direct digit matching
  const digit = normalized.match(/\b(10|[0-9])\b/);
  if (digit) {
    const value = Number(digit[1]);
    return value >= 0 && value <= max ? value : null;
  }

  // 2. Spoken number words
  for (const [word, value] of Object.entries(spokenNumbers[language])) {
    if (normalized.includes(word) && value <= max) return value;
  }

  // 3. Natural descriptive pain levels for seniors
  if (/\b(tidak|nggak|bukan|bebas|sembuh|aman|normal|zero|none|无|不)\b/i.test(normalized))
    return 0;
  if (/\b(sedikit|ringan|agak|mild|slight|一点)\b/i.test(normalized)) return Math.min(2, max);
  if (/\b(sedang|lumayan|cukup|moderate|middle|中等)\b/i.test(normalized)) return Math.min(5, max);
  if (/\b(berat|parah|sangat|severe|bad|严重)\b/i.test(normalized)) return Math.min(8, max);
  if (/\b(tak tertahankan|maksimal|extreme|worst|剧痛)\b/i.test(normalized)) return max;

  return null;
}

export function matchOptionTranscript(question: Question, transcript: string, language: Language) {
  if (!question.options || !question.options.length) return [];
  const normalized = normalizeSpeech(transcript);
  const options = question.options;

  // 1. Direct whole word match with any candidate / alias
  for (const option of options) {
    const candidates = [
      option.label[language],
      option.label.en,
      ...(option.aliases?.[language] ?? []),
      ...(option.aliases?.en ?? []),
    ];
    for (const cand of candidates) {
      const c = normalizeSpeech(cand);
      if (normalized === c) return [option];
    }
  }

  // 2. Option Letter Matching (e.g. "A", "opsi A", "pilihan B", "jawaban C")
  // Only trigger if transcript is concise (<= 3 words) to avoid false positive on random letter 'a' in sentences
  const tokenCount = normalized.split(/\s+/).length;
  if (tokenCount <= 3) {
    const letterMatch = normalized.match(
      /^(?:opsi|pilihan|jawaban|huruf|yang|option)?\s*([a-e])$/i,
    );
    if (letterMatch) {
      const charCode = letterMatch[1].toLowerCase().charCodeAt(0) - 97;
      if (charCode >= 0 && charCode < options.length) {
        return [options[charCode]];
      }
    }
  }

  // 3. Ordinal / Index words (e.g. "pertama", "nomor satu", "dua", "kedua")
  const ordinalMap: Record<string, number> = {
    pertama: 0,
    kesatu: 0,
    satu: 0,
    first: 0,
    one: 0,
    kedua: 1,
    dua: 1,
    second: 1,
    two: 1,
    ketiga: 2,
    tiga: 2,
    third: 2,
    three: 2,
    keempat: 3,
    empat: 3,
    fourth: 3,
    four: 3,
  };
  for (const [phrase, idx] of Object.entries(ordinalMap)) {
    const regex = new RegExp(`\\b${phrase}\\b`, "i");
    if (regex.test(normalized) && idx < options.length) {
      if (
        normalized === phrase ||
        normalized.includes("pilihan") ||
        normalized.includes("opsi") ||
        normalized.includes("nomor") ||
        normalized.includes("ke-") ||
        normalized.includes("option") ||
        normalized.includes("number")
      ) {
        return [options[idx]];
      }
    }
  }

  // 4. Binary Yes / No Questions
  const hasYesOption = options.some((o) => o.value === "yes");
  const hasNoOption = options.some((o) => o.value === "no");
  if (hasYesOption && hasNoOption) {
    const noRegex =
      /\b(tidak|nggak|ngga|enggak|gak|ga|bukan|belum|tak|tanpa|aman|normal|lancar|no|nope|nah|never|none|without|没有|不是|不|否|无)\b/i;
    const yesRegex =
      /\b(ya|iya|iye|yoi|yep|yes|ada|pernah|betul|benar|tentu|jelas|bisa|sering|bengkak|kaku|macet|terkunci|lepas|goyang|jatuh|cedera|nyeri|sakit|butuh|perlu|mau|boleh|pasti|ok|oke|siap|会|有|是|是的|对|对的)\b/i;

    if (noRegex.test(normalized)) {
      const noOpt = options.find((o) => o.value === "no");
      if (noOpt) return [noOpt];
    }
    if (yesRegex.test(normalized)) {
      const yesOpt = options.find((o) => o.value === "yes");
      if (yesOpt) return [yesOpt];
    }
  }

  // 5. Age Questions (e.g. "q_age", or prompt asking for age/umur)
  const isAgeQuestion =
    question.id.includes("age") ||
    question.prompt.en.toLowerCase().includes("old") ||
    question.prompt.id.toLowerCase().includes("usia") ||
    question.prompt.id.toLowerCase().includes("umur");
  if (isAgeQuestion) {
    const ageNum = parseScaleTranscript(transcript, language, 120);
    if (ageNum !== null && ageNum > 0) {
      if (ageNum < 30) {
        const opt = options.find(
          (o) => o.value === "under-30" || o.value === "lt-30" || o.value.includes("30"),
        );
        if (opt) return [opt];
      } else if (ageNum <= 44) {
        const opt = options.find((o) => o.value === "30-44");
        if (opt) return [opt];
      } else if (ageNum <= 64) {
        const opt = options.find((o) => o.value === "45-64");
        if (opt) return [opt];
      } else {
        const opt = options.find((o) => o.value === "65-plus" || o.value.includes("65"));
        if (opt) return [opt];
      }
    }
  }

  // 6. Duration Questions
  const isDurationQuestion =
    question.id.includes("duration") ||
    question.prompt.en.toLowerCase().includes("how long") ||
    question.prompt.id.toLowerCase().includes("lama");
  if (isDurationQuestion) {
    if (/tahun|years|lebih|over|gt/i.test(normalized)) {
      const opt = options.find((o) => o.value === "gt-6m" || o.value.includes("year"));
      if (opt) return [opt];
    } else if (
      /\b([456]|empat|lima|enam)\s*bulan\b/i.test(normalized) ||
      /setengah tahun/i.test(normalized)
    ) {
      const opt = options.find((o) => o.value === "3-6m");
      if (opt) return [opt];
    } else if (/\b([123]|satu|dua|tiga)\s*bulan\b/i.test(normalized)) {
      const opt = options.find((o) => o.value === "1-3m");
      if (opt) return [opt];
    } else if (/minggu|hari|kurang|sebulan|baru|less/i.test(normalized)) {
      const opt = options.find((o) => o.value === "lt-1m");
      if (opt) return [opt];
    }
  }

  // 7. Robust Fuzzy/Substring Scoring across all Option Labels & Aliases
  const words = normalized.split(/\s+/).filter((w) => w.length > 1);
  let bestScore = 0;
  let bestOption = options[0];

  options.forEach((option) => {
    let score = 0;
    const candidates = [
      option.label[language],
      option.label.en,
      ...(option.aliases?.[language] ?? []),
      ...(option.aliases?.en ?? []),
    ];

    candidates.forEach((cand) => {
      const c = normalizeSpeech(cand);
      if (normalized === c) score += 12;
      else if (normalized.includes(c) && c.length >= 3) score += 8;
      else if (c.includes(normalized) && normalized.length >= 3) score += 6;

      words.forEach((w) => {
        if (c.split(/\s+/).some((cw) => cw === w)) score += 4;
        else if (c.includes(w) && w.length >= 3) score += 2;
      });
    });

    if (score > bestScore) {
      bestScore = score;
      bestOption = option;
    }
  });

  if (bestScore >= 2) {
    return [bestOption];
  }

  return [];
}

const STORAGE = {
  language: "pf_lang",
  name: "pf_patient_name",
  answers: "pf_answers_vnext",
  questionIndex: "pf_question_index_vnext",
  submissions: "pf_submissions",
  pendingPapers: "pf_pending_papers",
  formId: "pf_active_form_id",
  voiceAuto: "pf_voice_auto_mode",
};

export function getActiveFormId(): string {
  if (typeof window === "undefined") return newPatientForm.id;
  return window.localStorage.getItem(STORAGE.formId) || newPatientForm.id;
}

export function setActiveFormId(formId: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE.formId, formId);
  }
}

export function isVoiceAutoMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE.voiceAuto) === "true";
}

export function setVoiceAutoMode(active: boolean) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE.voiceAuto, active ? "true" : "false");
  }
}

type LanguageListener = (lang: Language) => void;
const languageListeners = new Set<LanguageListener>();

export function onLanguageChange(fn: LanguageListener) {
  languageListeners.add(fn);
  return () => {
    languageListeners.delete(fn);
  };
}

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const value = window.localStorage.getItem(STORAGE.language);
  return value === "id" || value === "zh" ? value : "en";
}

export function setStoredLanguage(language: Language) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE.language, language);
    languageListeners.forEach((fn) => fn(language));
  }
}

export function getPatientName() {
  if (typeof window === "undefined") return "";
  const val = window.localStorage.getItem(STORAGE.name) ?? "";
  if (val.trim().toLowerCase() === "tes" || val.trim().toLowerCase() === "test") {
    window.localStorage.removeItem(STORAGE.name);
    return "";
  }
  return val;
}

export function setPatientName(name: string) {
  if (typeof window !== "undefined") {
    if (!name || name.trim().toLowerCase() === "tes" || name.trim().toLowerCase() === "test") {
      window.localStorage.removeItem(STORAGE.name);
    } else {
      window.localStorage.setItem(STORAGE.name, name);
    }
  }
}

export function getStoredAnswers(): Answers {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE.answers) ?? "{}") as Answers;
  } catch {
    return {};
  }
}

export function setStoredAnswers(answers: Answers) {
  if (typeof window !== "undefined")
    window.localStorage.setItem(STORAGE.answers, JSON.stringify(answers));
}

export function getStoredQuestionIndex() {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(STORAGE.questionIndex) ?? 0) || 0;
}

export function setStoredQuestionIndex(index: number) {
  if (typeof window !== "undefined")
    window.localStorage.setItem(STORAGE.questionIndex, String(index));
}

export function resetAssessment() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE.answers);
  window.localStorage.removeItem(STORAGE.questionIndex);
  window.localStorage.removeItem(STORAGE.name);
}

export function saveSubmission(submission: Submission) {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(
      window.localStorage.getItem(STORAGE.submissions) ?? "[]",
    ) as Submission[];
    const next = [submission, ...existing.filter((item) => item.id !== submission.id)];
    window.localStorage.setItem(STORAGE.submissions, JSON.stringify(next));
  } catch {
    window.localStorage.setItem(STORAGE.submissions, JSON.stringify([submission]));
  }
}

export function deleteSubmission(id: string) {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(
      window.localStorage.getItem(STORAGE.submissions) ?? "[]",
    ) as Submission[];
    const next = existing.filter((item) => item.id !== id);
    window.localStorage.setItem(STORAGE.submissions, JSON.stringify(next));
  } catch {
    window.localStorage.setItem(STORAGE.submissions, "[]");
  }
}

export function updateTriageStatus(id: string, triageStatus: TriageStatus) {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(
      window.localStorage.getItem(STORAGE.submissions) ?? "[]",
    ) as Submission[];
    const next = existing.map((item) => (item.id === id ? { ...item, triageStatus } : item));
    window.localStorage.setItem(STORAGE.submissions, JSON.stringify(next));
  } catch {
    // silently fail
  }
}

export function renamePatient(oldName: string, newName: string) {
  if (typeof window === "undefined") return;
  if (!newName.trim() || oldName === newName) return;
  try {
    const existing = JSON.parse(
      window.localStorage.getItem(STORAGE.submissions) ?? "[]",
    ) as Submission[];
    const next = existing.map((item) =>
      item.patientName === oldName ? { ...item, patientName: newName.trim() } : item,
    );
    window.localStorage.setItem(STORAGE.submissions, JSON.stringify(next));
  } catch {
    // silently fail
  }
}

export function getSubmissions(): Submission[] {
  if (typeof window === "undefined") return demoSubmissions;
  try {
    const raw = window.localStorage.getItem(STORAGE.submissions);
    let stored: Submission[];
    if (!raw) {
      // First visit: seed localStorage with demo data so mutations work
      stored = [...demoSubmissions];
      window.localStorage.setItem(STORAGE.submissions, JSON.stringify(stored));
    } else {
      stored = JSON.parse(raw) as Submission[];
      // Ensure any new demo entries are merged in
      const merged = [
        ...stored,
        ...demoSubmissions.filter((demo) => !stored.some((item) => item.id === demo.id)),
      ];
      if (merged.length > stored.length) {
        window.localStorage.setItem(STORAGE.submissions, JSON.stringify(merged));
      }
      stored = merged;
    }
    return stored;
  } catch {
    return demoSubmissions;
  }
}

export function savePendingPaper(paper: {
  formId: string;
  timestamp: string;
  patientName: string;
}) {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORAGE.pendingPapers) ?? "[]") as {
      formId: string;
      timestamp: string;
      patientName: string;
    }[];
    window.localStorage.setItem(STORAGE.pendingPapers, JSON.stringify([paper, ...existing]));
  } catch {
    window.localStorage.setItem(STORAGE.pendingPapers, JSON.stringify([paper]));
  }
}

export function getPendingPapers() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE.pendingPapers) ?? "[]") as {
      formId: string;
      timestamp: string;
      patientName: string;
    }[];
  } catch {
    return [];
  }
}
