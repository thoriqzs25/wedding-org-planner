"use client";

import { useState } from "react";
import Tooltip from "@/components/Tooltip";
import Icon from "@/components/Icon";

const faqCategories = [
  {
    title: "Persyaratan & Administrasi",
    icon: "description",
    items: [
      {
        q: "Apa saja syarat administrasi untuk menikah di Indonesia?",
        a: "Dokumen yang diperlukan: KTP, Kartu Keluarga (KK), Akta Kelahiran, pas foto 2x3 & 3x4 masing-masing 6 lembar, surat pengantar dari kelurahan/desa, dan NPWP (jika ada). Untuk yang pernah menikah sebelumnya, diperlukan akta cerai atau akta kematian pasangan.",
      },
      {
        q: "Bagaimana cara mendaftar nikah di KUA?",
        a: "Pendaftaran dilakukan di KUA kecamatan tempat tinggal calon pengantin. Datang langsung dengan membawa dokumen asli dan fotokopi. Pendaftaran minimal 10 hari kerja sebelum hari akad. Kedua calon pengantin harus hadir.",
      },
      {
        q: "Berapa biaya nikah di KUA?",
        a: "Pencatatan nikah di KUA gratis (Rp 0) sesuai dengan PP No. 48/2014. Namun jika akad nikah dilaksanakan di luar KUA (misal di gedung atau hotel), dikenakan biaya hingga Rp 600rb tergantung kebijakan daerah masing-masing.",
      },
      {
        q: "Apa itu surat rekomendasi nikah?",
        a: "Surat rekomendasi dari KUA asal untuk menikah di luar kecamatan tempat tinggal. Jika akad dilaksanakan di KUA lain, calon pengantin perlu mengurus surat pindah rekomendasi dari KUA asal ke KUA tujuan.",
      },
    ],
  },
  {
    title: "Rukun & Syarat Nikah",
    icon: "gavel",
    items: [
      {
        q: "Apa saja rukun nikah dalam Islam?",
        a: "Rukun nikah ada 5: (1) Calon suami, (2) Calon istri, (3) Wali nikah (dari pihak calon istri), (4) Dua saksi laki-laki muslim yang adil, (5) Ijab kabul (sighat) — pernyataan serah terima antara wali dan mempelai pria.",
      },
      {
        q: "Siapa yang boleh menjadi wali nikah?",
        a: "Wali nikah adalah ayah kandung dari calon pengantin wanita. Jika ayah sudah meninggal atau tidak memenuhi syarat, maka wali bisa digantikan oleh kakek, saudara laki-laki kandung, paman, atau wali hakim dari KUA.",
      },
      {
        q: "Apakah wajib ada mas kawin/mahar?",
        a: "Ya, mahar atau mas kawin adalah wajib dalam pernikahan Islam. Mahar bisa berupa uang, emas, barang, atau jasa (misal: mengajarkan Al-Qur'an). Tidak ada batasan minimal atau maksimal, tergantung kesepakatan.",
      },
    ],
  },
  {
    title: "Tradisi & Adat",
    icon: "diversity",
    items: [
      {
        q: "Apa itu seserahan?",
        a: "Seserahan adalah pemberian dari pihak calon suami kepada calon istri sebelum akad nikah. Isinya bisa berupa barang-barang kebutuhan sehari-hari seperti pakaian, sepatu, tas, kosmetik, perhiasan, dan perlengkapan lainnya. Jumlah seserahan biasanya ganjil (3, 5, atau 7 macam).",
      },
      {
        q: "Apa perbedaan akad nikah dan resepsi?",
        a: "Akad nikah adalah prosesi ijab kabul yang menandai sahnya pernikahan secara agama dan hukum. Resepsi (walimah) adalah acara syukuran setelah akad yang sifatnya tidak wajib tapi dianjurkan. Akad bisa dihadiri sedikit orang, resepsi biasanya lebih meriah.",
      },
      {
        q: "Apakah tradisi sungkeman wajib?",
        a: "Sungkeman bukanlah kewajiban agama, melainkan tradisi budaya Indonesia. Sungkeman dilakukan sebagai bentuk bakti dan permohonan maaf kedua mempelai kepada orang tua. Hampir semua adat di Indonesia menyertakan tradisi ini dalam rangkaian acara pernikahan.",
      },
    ],
  },
  {
    title: "Kursus Pranikah (BP4)",
    icon: "school",
    items: [
      {
        q: "Apakah kursus pranikah wajib?",
        a: "Ya, berdasarkan Peraturan Dirjen Bimas Islam No. DJ.II/491/2019, sertifikat kursus pranikah (BP4) kini menjadi syarat wajib pendaftaran pernikahan di KUA. Kursus ini bertujuan membekali calon pengantin dengan pengetahuan tentang rumah tangga.",
      },
      {
        q: "Di mana bisa mengikuti kursus pranikah?",
        a: "Kursus pranikah diselenggarakan oleh KUA kecamatan, BP4 (Badan Penasihatan Pembinaan dan Pelestarian Perkawinan), atau lembaga yang ditunjuk Kemenag. Kursus bisa dilakukan secara offline atau online. Biaya kursus bervariasi, ada yang gratis hingga Rp 100-200rb.",
      },
      {
        q: "Berapa lama kursus pranikah?",
        a: "Kursus pranikah biasanya dilaksanakan selama 2 hari (minimal 16 jam pelajaran) dengan materi meliputi: manajemen rumah tangga, kesehatan reproduksi, keuangan keluarga, dan hukum pernikahan.",
      },
    ],
  },
  {
    title: "Tips Persiapan Nikah",
    icon: "lightbulb",
    items: [
      {
        q: "Kapan waktu ideal mulai persiapan pernikahan?",
        a: "Idealnya mulai persiapan 6-12 bulan sebelum hari H. Mulai dari menentukan budget, venue, WO, vendor, hingga undangan. Untuk pernikahan di musim ramai (Juni-September atau Desember), disarankan mulai persiapan lebih awal karena vendor cepat penuh.",
      },
      {
        q: "Bagaimana cara menentukan budget pernikahan?",
        a: "Tentukan total budget, lalu alokasikan dengan proporsi umum: venue & dekorasi (30-40%), katering (25-35%), dokumentasi (5-10%), busana & makeup (5-10%), undangan & souvenir (5-10%), dan cadangan (10%). Sesuaikan jumlah tamu karena sangat mempengaruhi biaya makanan dan venue.",
      },
      {
        q: "Apa yang perlu disiapkan 1 bulan sebelum nikah?",
        a: "Finalisasi jumlah tamu, konfirmasi vendor, fitting baju terakhir, cek lisensi dokumen (surat nikah sudah jadi?), briefing dengan WO, persiapan akomodasi untuk keluarga jauh, dan pastikan semua pembayaran tahap akhir sudah diselesaikan.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  let globalIdx = 0;

  return (
    <div id="faq-page" className="max-w-4xl space-y-6">
      <div id="faq-header">
        <Tooltip content="Pertanyaan yang sering diajukan tentang pernikahan" position="bottom">
          <h1 id="faq-title" className="text-2xl font-bold text-amber-900 flex items-center gap-2">
            <Icon name="help" size={24} className="text-orange" />
            FAQ Seputar Pernikahan
          </h1>
        </Tooltip>
        <p id="faq-subtitle" className="text-amber-800/60 mt-1">
          Pertanyaan dan pengetahuan umum tentang pernikahan di Indonesia
        </p>
      </div>

      {faqCategories.map((cat, ci) => (
        <div key={ci} id={`faq-category-${ci}`} className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <div id={`faq-category-header-${ci}`} className="flex items-center gap-2 mb-3">
            <Icon name={cat.icon as any} size={20} className="text-orange" />
            <Tooltip content="Kategori pertanyaan seputar pernikahan">
              <h2 id={`faq-category-title-${ci}`} className="text-lg font-semibold text-amber-900">{cat.title}</h2>
            </Tooltip>
          </div>
          <div id={`faq-category-items-${ci}`} className="space-y-1">
            {cat.items.map((item) => {
              const idx = globalIdx++;
              return (
                <div key={idx} id={`faq-item-${idx}`}
                  className="rounded-xl border border-gold/20 overflow-hidden transition-colors">
                  <button
                    id={`faq-item-toggle-${idx}`}
                    onClick={() => toggle(idx)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors cursor-pointer ${
                      openIdx === idx ? "bg-orange/5" : "hover:bg-cream/50"
                    }`}
                  >
                    <span id={`faq-item-question-${idx}`} className="text-sm font-medium text-amber-900 pr-4">{item.q}</span>
                    <Icon
                      name={openIdx === idx ? "expand_less" : "expand_more"}
                      size={18}
                      className={`shrink-0 transition-colors ${
                        openIdx === idx ? "text-orange" : "text-amber-800/30"
                      }`}
                    />
                  </button>
                  {openIdx === idx && (
                    <div id={`faq-item-answer-${idx}`} className="px-4 pb-3.5">
                      <p id={`faq-item-answer-text-${idx}`} className="text-sm text-amber-800/70 leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div id="faq-footer" className="text-center py-4">
        <p id="faq-disclaimer" className="text-xs text-amber-800/40">
          Informasi ini bersifat umum dan dapat berubah sesuai kebijakan pemerintah daerah masing-masing.
          Disarankan untuk mengonfirmasi langsung ke KUA setempat.
        </p>
      </div>
    </div>
  );
}
