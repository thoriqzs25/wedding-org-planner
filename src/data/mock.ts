import { Questionnaire, Necessity, GalleryItem, Invoice, CalendarEvent, RecentActivity } from "@/types";

export const mockQuestionnaire: Questionnaire = {
  brideName: "Aisyah",
  groomName: "Rizky",
  weddingDate: "2026-12-20",
  location: "Jakarta Convention Center",
  budget: 350000000,
  budgetTier: "menengah-bawah",
  selectedNecessities: [
    "venue",
    "catering",
    "dokumentasi",
    "musik",
    "dekorasi",
    "wo",
    "prewedding",
  ],
};

export const mockNecessities: Necessity[] = [
  {
    id: "n1",
    name: "Venue",
    isDefault: true,
    todos: [
      {
        id: "t1",
        necessityId: "n1",
        title: "Survey 3 lokasi venue",
        pic: "Aisyah",
        dueDate: "2026-03-15",
        status: "done",
        description: "Survey JCC, Balai Sidang, dan Hotel Indonesia",
        link: "",
      },
      {
        id: "t2",
        necessityId: "n1",
        title: "Booking venue",
        pic: "Rizky",
        dueDate: "2026-04-01",
        status: "in_progress",
        description: "Negosiasi harga dan tanda tangan kontrak",
        link: "",
      },
      {
        id: "t3",
        necessityId: "n1",
        title: "DP venue 50%",
        pic: "Rizky",
        dueDate: "2026-04-15",
        status: "pending",
        description: "Transfer DP ke pihak venue",
        link: "",
      },
    ],
    vendors: [
      {
        id: "v1",
        necessityId: "n1",
        name: "Jakarta Convention Center",
        socialLinks: [
          { platform: "Instagram", url: "https://instagram.com/jcc" },
          { platform: "Website", url: "https://jcc.com" },
        ],
        priority: 1,
        budget: 150000000,
        pros: ["Lokasi strategis", "Kapasitas besar", "Parkir luas"],
        cons: ["Harga mahal", "Booking penuh di akhir tahun"],
        notes: "Sudah survey lokasi, cocok untuk 500 undangan",
        isRecommended: true,
      },
      {
        id: "v2",
        necessityId: "n1",
        name: "Balai Sidang Jakarta",
        socialLinks: [
          { platform: "Instagram", url: "https://instagram.com/bsj" },
        ],
        priority: 2,
        budget: 120000000,
        pros: ["Harga lebih terjangkau", "Dekat dengan hotel"],
        cons: ["Area parkir terbatas", "Dekorasi standar"],
        notes: "Alternatif jika JCC penuh",
        isRecommended: false,
      },
    ],
  },
  {
    id: "n2",
    name: "Catering",
    isDefault: true,
    todos: [
      {
        id: "t4",
        necessityId: "n2",
        title: "Food tasting",
        pic: "Aisyah",
        dueDate: "2026-05-01",
        status: "pending",
        description: "Cicipi menu dari 3 vendor catering",
        link: "",
      },
    ],
    vendors: [
      {
        id: "v3",
        necessityId: "n2",
        name: "Dapur Bahari Catering",
        socialLinks: [
          { platform: "Instagram", url: "https://instagram.com/dapurbahari" },
        ],
        priority: 1,
        budget: 75000000,
        pros: ["Menu nusantara lengkap", "Harga bersaing"],
        cons: ["Kurang variasi internasional"],
        notes: "Rekomendasi dari WO",
        isRecommended: true,
      },
    ],
  },
  {
    id: "n3",
    name: "Dokumentasi",
    isDefault: true,
    todos: [
      {
        id: "t5",
        necessityId: "n3",
        title: "Cek portfolio fotografer",
        pic: "Aisyah",
        dueDate: "2026-04-20",
        status: "pending",
        description: "Review portofolio 3 fotografer",
        link: "",
      },
    ],
    vendors: [
      {
        id: "v4",
        necessityId: "n3",
        name: "Lens & Love Photography",
        socialLinks: [
          { platform: "Instagram", url: "https://instagram.com/lenslove" },
        ],
        priority: 1,
        budget: 35000000,
        pros: ["Foto candid bagus", "Cepat deliver"],
        cons: ["Harga sedikit di atas rata-rata"],
        notes: "Portfolio sangat sesuai dengan tema rustic",
        isRecommended: true,
      },
    ],
  },
  {
    id: "n4",
    name: "Musik",
    isDefault: true,
    todos: [],
    vendors: [],
  },
  {
    id: "n5",
    name: "Dekorasi",
    isDefault: true,
    todos: [
      {
        id: "t6",
        necessityId: "n5",
        title: "Konsultasi tema dekorasi",
        pic: "Aisyah & Rizky",
        dueDate: "2026-05-10",
        status: "pending",
        description: "Tentukan tema warna dan konsep",
        link: "",
      },
    ],
    vendors: [
      {
        id: "v5",
        necessityId: "n5",
        name: "Ratu Decoration",
        socialLinks: [
          { platform: "Instagram", url: "https://instagram.com/ratudeco" },
        ],
        priority: 1,
        budget: 85000000,
        pros: ["Konsep modern", "Banyak referensi"],
        cons: ["Sedikit mahal"],
        notes: "",
        isRecommended: true,
      },
    ],
  },
  {
    id: "n6",
    name: "Wedding Organizer",
    isDefault: true,
    todos: [
      {
        id: "t7",
        necessityId: "n6",
        title: "Meeting dengan WO",
        pic: "Aisyah & Rizky",
        dueDate: "2026-03-10",
        status: "done",
        description: "Diskusi timeline dan kebutuhan",
        link: "",
      },
    ],
    vendors: [
      {
        id: "v6",
        necessityId: "n6",
        name: "Dream Wedding Planner",
        socialLinks: [
          { platform: "Instagram", url: "https://instagram.com/dreamwedding" },
          { platform: "TikTok", url: "https://tiktok.com/@dreamwedding" },
        ],
        priority: 1,
        budget: 50000000,
        pros: ["Profesional", "Tim yang solid", " Network luas"],
        cons: [],
        notes: "Sudah deal, tinggal kontrak",
        isRecommended: true,
      },
    ],
  },
  {
    id: "n7",
    name: "Prewedding",
    isDefault: false,
    todos: [
      {
        id: "t8",
        necessityId: "n7",
        title: "Cari lokasi prewedding",
        pic: "Aisyah",
        dueDate: "2026-04-30",
        status: "in_progress",
        description: "Cari referensi lokasi outdoor",
        link: "https://pinterest.com/search/prewedding",
      },
    ],
    vendors: [
      {
        id: "v7",
        necessityId: "n7",
        name: "Golden Hour Photography",
        socialLinks: [
          { platform: "Instagram", url: "https://instagram.com/goldenhour" },
        ],
        priority: 1,
        budget: 15000000,
        pros: ["Hasil aesthetic", "Harga terjangkau"],
        cons: ["Booking padat"],
        notes: "Lihat portofolio di IG",
        isRecommended: true,
      },
    ],
  },
  {
    id: "n8",
    name: "Wedding Content Creator",
    isDefault: false,
    todos: [],
    vendors: [],
  },
  {
    id: "n9",
    name: "Photo Booth",
    isDefault: false,
    todos: [],
    vendors: [],
  },
  {
    id: "n10",
    name: "Undangan Fisik",
    isDefault: false,
    todos: [],
    vendors: [],
  },
  {
    id: "n11",
    name: "Undangan Online",
    isDefault: false,
    todos: [],
    vendors: [],
  },
  {
    id: "n12",
    name: "Mobil Pengantin",
    isDefault: false,
    todos: [],
    vendors: [],
  },
  {
    id: "n13",
    name: "Souvenir",
    isDefault: false,
    todos: [],
    vendors: [],
  },
  {
    id: "n14",
    name: "Makeup & Hairdo",
    isDefault: false,
    todos: [],
    vendors: [],
  },
  {
    id: "n15",
    name: "Master of Ceremony",
    isDefault: false,
    todos: [],
    vendors: [],
  },
  {
    id: "n16",
    name: "Live Streaming",
    isDefault: false,
    todos: [],
    vendors: [],
  },
];

export const mockGalleryItems: GalleryItem[] = [
  {
    id: "g1",
    necessityId: "n5",
    link: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Inspirasi dekorasi rustic outdoor",
    type: "youtube",
  },
  {
    id: "g2",
    necessityId: "n5",
    link: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Dekorasi pelaminan modern minimalis",
    type: "youtube",
  },
  {
    id: "g3",
    necessityId: "n2",
    link: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Inspirasi prasmanan prasmanan",
    type: "youtube",
  },
  {
    id: "g4",
    necessityId: "n1",
    link: "https://image.com/venue.jpg",
    description: "Venue JCC ballroom",
    type: "image",
  },
  {
    id: "g5",
    necessityId: "n3",
    link: "https://image.com/photo.jpg",
    description: "Gaya foto candid",
    type: "image",
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: "i1",
    vendorId: "v6",
    vendorName: "Dream Wedding Planner",
    photoUrl: "",
    amount: 25000000,
    notes: "DP 50% WO",
    date: "2026-03-01",
  },
  {
    id: "i2",
    vendorId: "v5",
    vendorName: "Ratu Decoration",
    photoUrl: "",
    amount: 10000000,
    notes: "DP booking dekorasi",
    date: "2026-03-05",
  },
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "Meeting WO",
    date: "2026-07-15",
    necessityId: "n6",
    necessityName: "Wedding Organizer",
    description: "Diskusi detail acara",
  },
  {
    id: "e2",
    title: "Food Testing",
    date: "2026-07-20",
    necessityId: "n2",
    necessityName: "Catering",
    description: "Cicipi menu di Dapur Bahari",
  },
  {
    id: "e3",
    title: "Survey Dekorasi",
    date: "2026-07-25",
    necessityId: "n5",
    necessityName: "Dekorasi",
    description: "Lihat langsung konsep di workshop",
  },
  {
    id: "e4",
    title: "Pre-wedding Shoot",
    date: "2026-08-10",
    necessityId: "n7",
    necessityName: "Prewedding",
    description: "Lokasi: Taman Safari",
  },
];

export const mockRecentActivities: RecentActivity[] = [
  {
    id: "r1",
    necessityId: "n1",
    necessityName: "Venue",
    action: "Survey 3 lokasi venue — selesai",
    createdAt: "2026-07-09T10:30:00",
  },
  {
    id: "r2",
    necessityId: "n6",
    necessityName: "Wedding Organizer",
    action: "Meeting dengan WO — selesai",
    createdAt: "2026-07-08T14:00:00",
  },
  {
    id: "r3",
    necessityId: "n1",
    necessityName: "Venue",
    action: "Booking venue — sedang diproses",
    createdAt: "2026-07-07T09:15:00",
  },
  {
    id: "r4",
    necessityId: "n7",
    necessityName: "Prewedding",
    action: "Cari lokasi prewedding — sedang diproses",
    createdAt: "2026-07-06T16:45:00",
  },
  {
    id: "r5",
    necessityId: "n2",
    necessityName: "Catering",
    action: "Food tasting — masih pending",
    createdAt: "2026-07-05T11:00:00",
  },
];

export function getNecessityById(id: string) {
  return mockNecessities.find((n) => n.id === id);
}

export function getVendorById(id: string) {
  return mockNecessities.flatMap((n) => n.vendors).find((v) => v.id === id);
}

export function getTotalBudget() {
  return mockNecessities.reduce((sum, n) => {
    return sum + n.vendors.reduce((vs, v) => vs + v.budget, 0);
  }, 0);
}

export function getTotalSpent() {
  return mockInvoices.reduce((sum, i) => sum + i.amount, 0);
}

export function getTodoProgress() {
  const allTodos = mockNecessities.flatMap((n) => n.todos);
  const done = allTodos.filter((t) => t.status === "done").length;
  return { done, total: allTodos.length };
}

export function getOverdueTodos() {
  const today = new Date().toISOString().split("T")[0];
  return mockNecessities
    .flatMap((n) => n.todos)
    .filter((t) => t.dueDate < today && t.status !== "done");
}
