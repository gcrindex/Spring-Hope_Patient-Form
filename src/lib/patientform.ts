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

export type Submission = {
  id: string;
  formId: string;
  patientName: string;
  submittedAt: string;
  answers: Answers;
  score: number;
  risk: RiskLevel;
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

export const demoSubmissions: Submission[] = [
  {
    id: "sub-1028",
    formId: kneePainForm.id,
    patientName: "Tan Wei Ling",
    submittedAt: "2026-09-03T03:14:00.000Z",
    answers: {},
    score: 68,
    risk: "high",
  },
  {
    id: "sub-1027",
    formId: kneePainForm.id,
    patientName: "Aisha Rahman",
    submittedAt: "2026-09-03T02:41:00.000Z",
    answers: {},
    score: 48,
    risk: "mod",
  },
  {
    id: "sub-1026",
    formId: kneePainForm.id,
    patientName: "Lim Jia Hao",
    submittedAt: "2026-09-02T09:22:00.000Z",
    answers: {},
    score: 21,
    risk: "low",
  },
  {
    id: "sub-1025",
    formId: kneePainForm.id,
    patientName: "Nur Aisyah",
    submittedAt: "2026-09-02T06:08:00.000Z",
    answers: {},
    score: 36,
    risk: "mod",
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
  const digit = normalized.match(/\b(10|[0-9])\b/);
  if (digit) {
    const value = Number(digit[1]);
    return value >= 0 && value <= max ? value : null;
  }
  for (const [word, value] of Object.entries(spokenNumbers[language])) {
    if (normalized.includes(word) && value <= max) return value;
  }
  return null;
}

export function matchOptionTranscript(question: Question, transcript: string, language: Language) {
  const normalized = normalizeSpeech(transcript);
  const matches =
    question.options?.filter((option) => {
      const candidates = [option.label[language], ...(option.aliases?.[language] ?? [])];
      return candidates.some((candidate) => {
        const c = normalizeSpeech(candidate);
        return normalized === c || normalized.includes(c) || c.includes(normalized);
      });
    }) ?? [];
  return matches;
}

const STORAGE = {
  language: "pf_lang",
  name: "pf_patient_name",
  answers: "pf_answers_vnext",
  questionIndex: "pf_question_index_vnext",
  submissions: "pf_submissions",
  pendingPapers: "pf_pending_papers",
};

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const value = window.localStorage.getItem(STORAGE.language);
  return value === "id" || value === "zh" ? value : "en";
}

export function setStoredLanguage(language: Language) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE.language, language);
}

export function getPatientName() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE.name) ?? "";
}

export function setPatientName(name: string) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE.name, name);
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

export function getSubmissions() {
  if (typeof window === "undefined") return demoSubmissions;
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(STORAGE.submissions) ?? "[]",
    ) as Submission[];
    return [
      ...stored,
      ...demoSubmissions.filter((demo) => !stored.some((item) => item.id === demo.id)),
    ];
  } catch {
    return demoSubmissions;
  }
}

export function savePendingPaper(paper: { formId: string; timestamp: string; patientName: string }) {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(
      window.localStorage.getItem(STORAGE.pendingPapers) ?? "[]",
    ) as { formId: string; timestamp: string; patientName: string }[];
    window.localStorage.setItem(STORAGE.pendingPapers, JSON.stringify([paper, ...existing]));
  } catch {
    window.localStorage.setItem(STORAGE.pendingPapers, JSON.stringify([paper]));
  }
}

export function getPendingPapers() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE.pendingPapers) ?? "[]") as {
      formId: string; timestamp: string; patientName: string;
    }[];
  } catch {
    return [];
  }
}
