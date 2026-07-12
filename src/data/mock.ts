import { Questionnaire, Necessity, GalleryItem, Invoice, CalendarEvent, RecentActivity, Account } from "@/types";

export const mockQuestionnaire: Questionnaire = {
  brideName: "Aisyah",
  groomName: "Rizky",
  weddingDate: "2026-12-20",
  location: "Jakarta Convention Center",
  guestCount: 300,
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

export const mockAccounts: Account[] = [
  {
    id: "a1",
    username: "aisyahrizky",
    password: "wedding123",
    brideName: "Aisyah",
    groomName: "Rizky",
    weddingDate: "2026-12-20",
    location: "Jakarta Convention Center",
    budget: 350000000,
    budgetTier: "menengah-bawah",
    guestCount: 300,
    selectedNecessities: ["venue", "catering", "dokumentasi", "musik", "dekorasi", "wo", "prewedding"],
    status: "active",
  },
  {
    id: "a2",
    username: "sariadi",
    password: "wedding123",
    brideName: "Sari",
    groomName: "Adi",
    weddingDate: "2026-11-15",
    location: "Bandung",
    guestCount: 200,
    budget: 200000000,
    budgetTier: "murah",
    selectedNecessities: ["venue", "catering", "dokumentasi", "musik", "dekorasi"],
    status: "active",
  },
  {
    id: "a3",
    username: "dewiagus",
    password: "wedding123",
    brideName: "Dewi",
    groomName: "Agus",
    weddingDate: "2027-02-08",
    location: "Surabaya",
    guestCount: 500,
    budget: 500000000,
    budgetTier: "mewah",
    selectedNecessities: ["venue", "catering", "dokumentasi", "musik", "dekorasi", "wo", "prewedding", "mc", "hiburan"],
    status: "active",
  },
  {
    id: "a4",
    username: "ratnabayu",
    password: "wedding123",
    brideName: "Ratna",
    groomName: "Bayu",
    weddingDate: "2026-09-30",
    location: "Yogyakarta",
    guestCount: 250,
    budget: 275000000,
    budgetTier: "menengah-atas",
    selectedNecessities: ["venue", "catering", "dokumentasi", "musik", "dekorasi", "wo", "prewedding", "undangan-fisik"],
    status: "inactive",
  },
  {
    id: "a5",
    username: "meliacahya",
    password: "wedding123",
    brideName: "Melia",
    groomName: "Cahya",
    weddingDate: "2026-10-05",
    location: "Jakarta",
    guestCount: 150,
    budget: 125000000,
    budgetTier: "murah",
    selectedNecessities: ["venue", "catering", "dokumentasi", "dekorasi"],
    status: "active",
  },
];

export const mockNecessities: Necessity[] = [
  {
    id: "n1",
    name: "Venue",
    color: "orange",
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
        perPerson: 200000,
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
        perPerson: 150000,
        pros: ["Harga lebih terjangkau", "Dekat dengan hotel"],
        cons: ["Area parkir terbatas", "Dekorasi standar"],
        notes: "Alternatif jika JCC penuh",
        isRecommended: false,
      },
    ],
    selectedVendorId: "v2",
    vendorTasks: [
      { id: "vt1", title: "Kirim DP 50%", done: true },
      { id: "vt2", title: "Konfirmasi denah duduk", done: false },
      { id: "vt3", title: "Finalisasi menu", done: false },
    ],
    vendorActivity: [
      { id: "va1", action: "Dipilih sebagai vendor final", date: "2026-07-10T09:00:00" },
      { id: "va2", action: "Invoice DP ditambahkan — Rp25.000.000", date: "2026-07-11T14:30:00" },
      { id: "va3", action: "Task 'Kirim DP 50%' selesai", date: "2026-07-12T11:00:00" },
    ],
  },
  {
    id: "n2",
    name: "Catering",
    color: "pink",
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
        perPerson: 125000,
        pros: ["Menu nusantara lengkap", "Harga bersaing"],
        cons: ["Kurang variasi internasional"],
        notes: "Rekomendasi dari WO",
        isRecommended: true,
      },
      {
        id: "v8",
        necessityId: "n2",
        name: "Mawar Catering",
        socialLinks: [
          { platform: "Instagram", url: "https://instagram.com/mawarcatering" },
        ],
        priority: 1,
        budget: 65000000,
        perPerson: 100000,
        pros: ["Harga terjangkau", "Menu prasmanan lengkap"],
        cons: ["Kurang pengalaman untuk 500+ tamu"],
        notes: "Hasil food tasting cukup baik",
        isRecommended: false,
      },
    ],
  },
  {
    id: "n3",
    name: "Dokumentasi",
    color: "green",
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
    color: "gold",
    isDefault: true,
        todos: [],
    vendors: [],
  },
  {
    id: "n5",
    name: "Dekorasi",
    color: "orange",
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
      {
        id: "v9",
        necessityId: "n5",
        name: "Indah Decoration",
        socialLinks: [
          { platform: "Instagram", url: "https://instagram.com/indahdeco" },
        ],
        priority: 1,
        budget: 70000000,
        pros: ["Harga lebih murah", "Responsif", "Portfolio bagus"],
        cons: ["Tim lebih kecil"],
        notes: "Sudah survey lokasi, cocok dengan tema rustic",
        isRecommended: false,
      },
    ],
    selectedVendorId: "v9",
    vendorTasks: [
      { id: "vt6", title: "Finalisasi konsep warna", done: true },
      { id: "vt7", title: "Survey lokasi", done: false },
    ],
    vendorActivity: [
      { id: "va6", action: "Dipilih sebagai vendor final: Indah Decoration", date: "2026-07-13T08:00:00" },
      { id: "va7", action: "Task 'Finalisasi konsep warna' selesai", date: "2026-07-14T16:00:00" },
    ],
  },
  {
    id: "n6",
    name: "Wedding Organizer",
    color: "pink",
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
    selectedVendorId: "v6",
    vendorTasks: [
      { id: "vt4", title: "Kirim brief konsep", done: true },
      { id: "vt5", title: "Finalisasi rundown acara", done: false },
    ],
    vendorActivity: [
      { id: "va4", action: "Dipilih sebagai vendor final", date: "2026-07-05T10:00:00" },
      { id: "va5", action: "Task 'Kirim brief konsep' selesai", date: "2026-07-08T15:00:00" },
    ],
  },
  {
    id: "n7",
    name: "Prewedding",
    color: "green",
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
    color: "gold",
    isDefault: false,
        todos: [],
    vendors: [],
  },
  {
    id: "n9",
    name: "Photo Booth",
    color: "orange",
    isDefault: false,
        todos: [],
    vendors: [],
  },
  {
    id: "n10",
    name: "Undangan Fisik",
    color: "pink",
    isDefault: false,
        todos: [],
    vendors: [],
  },
  {
    id: "n11",
    name: "Undangan Online",
    color: "green",
    isDefault: false,
        todos: [],
    vendors: [],
  },
  {
    id: "n12",
    name: "Mobil Pengantin",
    color: "gold",
    isDefault: false,
        todos: [],
    vendors: [],
  },
  {
    id: "n13",
    name: "Souvenir",
    color: "orange",
    isDefault: false,
        todos: [],
    vendors: [],
  },
  {
    id: "n14",
    name: "Makeup & Hairdo",
    color: "pink",
    isDefault: false,
        todos: [],
    vendors: [],
  },
  {
    id: "n15",
    name: "Master of Ceremony",
    color: "green",
    isDefault: false,
        todos: [],
    vendors: [],
  },
  {
    id: "n16",
    name: "Live Streaming",
    color: "gold",
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
    description: "Gaya foto candid natural lighting",
    type: "image",
  },
  {
    id: "g6",
    necessityId: "n5",
    link: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Dekorasi panggung pernikahan",
    type: "youtube",
  },
  {
    id: "g7",
    necessityId: "n5",
    link: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Bunga & dekorasi meja resepsi",
    type: "youtube",
  },
  {
    id: "g8",
    necessityId: "n1",
    link: "https://image.com/venue2.jpg",
    description: "Ballroom hotel mewah",
    type: "image",
  },
  {
    id: "g9",
    necessityId: "n1",
    link: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Tour venue outdoor garden",
    type: "youtube",
  },
  {
    id: "g10",
    necessityId: "n3",
    link: "https://image.com/photo2.jpg",
    description: "Foto prewedding candid",
    type: "image",
  },
  {
    id: "g11",
    necessityId: "n6",
    link: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Tips memilih wedding organizer",
    type: "youtube",
  },
  {
    id: "g12",
    necessityId: "n6",
    link: "https://image.com/wo.jpg",
    description: "Contoh timeline acara pernikahan",
    type: "image",
  },
  {
    id: "g13",
    necessityId: "n7",
    link: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Ide lokasi prewedding outdoor",
    type: "youtube",
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: "i1",
    necessityId: "n6",
    necessityName: "Wedding Organizer",
    vendorName: "Dream Wedding Planner",
    photoUrl: "",
    amount: 25000000,
    notes: "DP 50% WO",
    date: "2026-03-01",
  },
  {
    id: "i2",
    necessityId: "n1",
    necessityName: "Venue",
    vendorName: "Balai Sidang Jakarta",
    photoUrl: "",
    amount: 10000000,
    notes: "DP booking venue",
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
