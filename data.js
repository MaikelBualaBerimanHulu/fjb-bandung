// Data Wilayah & Titik COD Aman di Kota Bandung & Sekitarnya
export const BANDUNG_ZONES = [
  {
    id: "semua",
    name: "Semua Wilayah",
    districts: []
  },
  {
    id: "utara",
    name: "Bandung Utara",
    districts: ["Coblong", "Dago", "Dipatiukur", "Cidadap", "Setiabudi", "Sukasari", "Ciumbuleuit"],
    safeCodSpots: [
      "Indomaret Point Dipatiukur (Depan Kampus Unpad)",
      "Lobby Ciwalk Mall (Cihampelas Walk)",
      "Kopi Toko Djawa Dago",
      "SPBU Shell Dago (Area Terang & CCTV)"
    ]
  },
  {
    id: "tengah",
    name: "Bandung Tengah",
    districts: ["Sumur Bandung", "Riau / LLRE Martadinata", "Merdeka", "Braga", "Asia Afrika"],
    safeCodSpots: [
      "Lobby Utama Bandung Indah Plaza (BIP)",
      "Area Taman Balai Kota Bandung",
      "Kawasan Braga Citywalk",
      "Pos Polisi Simpang Lima Asia Afrika"
    ]
  },
  {
    id: "timur",
    name: "Bandung Timur",
    districts: ["Antapani", "Arcamanik", "Cibiru", "Ujungberung", "Cinambo", "Gedebage"],
    safeCodSpots: [
      "Ubertos Mall (Ujungberung Town Square)",
      "Griya Grand Antapani",
      "Stasiun Tegalluar / KCIC",
      "Metro Indah Mall (MIM) Soekarno Hatta"
    ]
  },
  {
    id: "selatan",
    name: "Bandung Selatan",
    districts: ["Buah Batu", "Lengkong", "Batununggal", "Kopo", "Bojongloa", "Moh. Toha"],
    safeCodSpots: [
      "Trans Studio Mall (TSM) Bandung",
      "Griya Buah Batu",
      "Miko Mall Kopo",
      "Area Parkir RS Muhammadiyah KH Ahmad Dahlan"
    ]
  },
  {
    id: "barat_cimahi",
    name: "Cimahi & Bandung Barat",
    districts: ["Cimahi Tengah", "Cimahi Utara", "Cimahi Selatan", "Padalarang", "Pasteur", "Lembang"],
    safeCodSpots: [
      "Alun-alun Kota Cimahi",
      "BTC Fashion Mall (Pasteur)",
      "IKEA Kota Baru Parahyangan Padalarang",
      "Toserba Borma Cimahi"
    ]
  }
];

export const CATEGORIES = [
  { id: "all", name: "Semua Kategori", icon: "layout-grid" },
  { id: "elektronik", name: "Elektronik & Gadget", icon: "smartphone" },
  { id: "otomotif", name: "Motor, Mobil & Part", icon: "car" },
  { id: "thrift", name: "Thrift & Streetwear", icon: "shirt" },
  { id: "musik_hobi", name: "Alat Musik & Audio", icon: "music" },
  { id: "kamera", name: "Kamera & Fotografi", icon: "camera" },
  { id: "antik", name: "Koleksi & Barang Antik", icon: "watch" }
];

export const INITIAL_LISTINGS = [
  {
    id: "fjb-001",
    title: "Vespa Sprint 150 3V 2017 Rosso Dragon Full Paper Pajak On",
    category: "otomotif",
    price: 32500000,
    zoneId: "utara",
    district: "Dago",
    conditionGrade: 92,
    minusChecklist: ["Lecet halus standar parkiran", "Ban belakang 75%"],
    isBarterAllowed: true,
    barterNote: "Bisa TT sama Vespa Primavera atau Aerox Connected + nambah",
    safeCodSpot: "SPBU Shell Dago (Area Terang & CCTV)",
    sellerName: "Kang Farhan",
    sellerPhone: "081234567890",
    isSold: false,
    createdAt: "2026-09-21T10:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1596707323869-7eeefba0e495?auto=format&fit=crop&w=800&q=80",
    description: "Dijual motor kesayangan wargi, Vespa Sprint 3V warna merah Rosso Dragon tahun 2017. Mesin halus kering, CVT baru servis ganti roller Malossi, kelistrikan normal, kunci cokelat & biru lengkap. Surat lengkap BPKB STNK plat D Kota Bandung pajak hidup panjang."
  },
  {
    id: "fjb-002",
    title: "iPhone 13 128GB Starlight iBox Mulus No Dent Batre 86%",
    category: "elektronik",
    price: 7800000,
    zoneId: "utara",
    district: "Dipatiukur",
    conditionGrade: 96,
    minusChecklist: ["Battery Health 86% (Original belum pernah ganti)", "Kabel charger pemakaian normal"],
    isBarterAllowed: true,
    barterNote: "Open TT dengan iPhone 12 Pro atau Samsung S22 Ultra",
    safeCodSpot: "Indomaret Point Dipatiukur (Depan Kampus Unpad)",
    sellerName: "Rizky Ramadhan",
    sellerPhone: "082198765432",
    isSold: false,
    createdAt: "2026-09-22T14:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    description: "Pemakaian pribadi tangan pertama ex garansi resmi iBox Indonesia (PA/A). True Tone on, Face ID ngebut, layar dan body terpasang hydrogel + case sejak beli. Kelengkapan fullset original bawaan box."
  },
  {
    id: "fjb-003",
    title: "Sony A6400 Body Only Shutter Count 4.200 Sensor Kinclong",
    category: "kamera",
    price: 8600000,
    zoneId: "tengah",
    district: "Merdeka",
    conditionGrade: 95,
    minusChecklist: ["Karet grip ada bekas kuku tipis", "Dus agak kusam kena simpan"],
    isBarterAllowed: false,
    barterNote: "",
    safeCodSpot: "Lobby Utama Bandung Indah Plaza (BIP)",
    sellerName: "Kang Agun",
    sellerPhone: "085712344321",
    isSold: false,
    createdAt: "2026-09-22T09:15:00Z",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    description: "Kamera mirrorless favorit konten kreator Bandung. Shutter count rendah baru 4.2xx jepretan, jarang dipakai outdoor lebih sering di studio buat video podcast. Layar flip aman, sensor bersih selalu di dry box."
  },
  {
    id: "fjb-004",
    title: "Gitar Akustik Yamaha FG800 Solid Top Suara Gurih Legit",
    category: "musik_hobi",
    price: 1550000,
    zoneId: "selatan",
    district: "Buah Batu",
    conditionGrade: 90,
    minusChecklist: ["Senar bawaan agak berkarat (bonus senar D'Addario baru)", "Ada scratch halus di pickguard"],
    isBarterAllowed: true,
    barterNote: "Mau TT sama efek gitar stompbox / audio interface Scarlett",
    safeCodSpot: "Griya Buah Batu",
    sellerName: "Bagus Prasetyo",
    sellerPhone: "081399887766",
    isSold: false,
    createdAt: "2026-09-20T16:45:00Z",
    imageUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80",
    description: "Gitar akustik andalan Solid Spruce top asli Yamaha. Action senar ceper nyaman di jari teu nyeri ramo. Cocok buat nongkrong atau main panggung. Sudah include softcase tebal Yamaha."
  },
  {
    id: "fjb-005",
    title: "Jaket Vintage Carhartt Detroit Jacket J97 Moss Green Sz L",
    category: "thrift",
    price: 1850000,
    zoneId: "timur",
    district: "Antapani",
    conditionGrade: 88,
    minusChecklist: ["Fading natural vintage di bagian siku", "Zipper tarikan gantian YKK asli"],
    isBarterAllowed: true,
    barterNote: "Bisa barter sama sepatu Red Wing 875 size 42 / Barbour jacket",
    safeCodSpot: "Griya Grand Antapani",
    sellerName: "Arip Gedebage Thrift",
    sellerPhone: "087811223344",
    isSold: false,
    createdAt: "2026-09-21T18:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    description: "Barang koleksi pribadi dapet hunting di Pasar Gedebage. Warna Moss Green vintage patina sangat cakep ala workwear vintage. Bahan canvas tebal blanket lined hangat khas Bandung tiis."
  },
  {
    id: "fjb-006",
    title: "Helm KYT TT Course Dalla Porta Replica Size L Visor Dark Smoke",
    category: "otomotif",
    price: 4800000,
    zoneId: "barat_cimahi",
    district: "Cimahi Tengah",
    conditionGrade: 94,
    minusChecklist: ["Busa pipi agak rapat (masih kencang)", "Visor clear aslinya hilang, cuma ada dark smoke"],
    isBarterAllowed: false,
    barterNote: "",
    safeCodSpot: "Alun-alun Kota Cimahi",
    sellerName: "Deden Ridwan",
    sellerPhone: "089612345678",
    isSold: false,
    createdAt: "2026-09-23T06:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
    description: "KYT TTC motif Dalla Porta juara dunia Moto3. Busa masih wangi dan tebal, terpasang spoiler GPR 3D print kokoh. Ventilasi aktif semua. Jarang dipakai turing."
  },
  {
    id: "fjb-007",
    title: "Mechanical Keyboard Keychron K2 V2 Wireless RGB Gateron Brown",
    category: "elektronik",
    price: 850000,
    zoneId: "utara",
    district: "Ciumbuleuit",
    conditionGrade: 93,
    minusChecklist: ["Dus box sedikit penyok", "Keycap puller bawaan hilang"],
    isBarterAllowed: true,
    barterNote: "Boleh TT sama mouse Logitech MX Master 2s/3",
    safeCodSpot: "Kopi Toko Djawa Dago",
    sellerName: "Gilang Ramadhan",
    sellerPhone: "081900112233",
    isSold: false,
    createdAt: "2026-09-23T07:10:00Z",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    description: "Keychron K2 versi 2 Bluetooth + kabel USB-C. Switch Gateron Brown empuk tactile pas buat ngetik koding atau ngerjain skripsi. Baterai awet tahan 2 minggu."
  },
  {
    id: "fjb-008",
    title: "Jam Tangan Seiko 5 Automatic 7S26 Dial White Sunburst Vintage",
    category: "antik",
    price: 490000,
    zoneId: "tengah",
    district: "Riau / LLRE Martadinata",
    conditionGrade: 85,
    minusChecklist: ["Scratch pemakaian di rantai dan caseback", "No box (jam batangan original)"],
    isBarterAllowed: false,
    barterNote: "",
    safeCodSpot: "Area Taman Balai Kota Bandung",
    sellerName: "Mang Oded Antik",
    sellerPhone: "081288776655",
    isSold: false,
    createdAt: "2026-09-20T11:20:00Z",
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    description: "Koleksi vintage hunting Cikapundung. Mesin automatic 7S26 legendaris tanpa baterai goyang langsung jalan. Akurasi masih jos untuk jam seusianya. Dial putih bersih rantai masih panjang."
  }
];
