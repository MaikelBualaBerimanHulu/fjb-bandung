// Logika Kalkulator Biaya Listing & Pengelolaan Mode Promo FJB Bandung

// Konfigurasi Global Sistem
export const SYSTEM_CONFIG = {
  // Mode Peluncuran: jika true, semua postingan gratis (diskon 100%)
  LAUNCH_PROMO_MODE: true,
  PROMO_NAME: "Promo Wargi Baru 100% Gratis",
  
  // Tier Tarif Resmi
  TIERS: {
    HIGH: {
      minPrice: 1000000,
      fee: 25000,
      label: "Tier 1 (High Value > Rp 1 Jt)",
      duration: "Aktif Selamanya Sampai Laku (Lifetime)"
    },
    MID: {
      minPrice: 500000,
      maxPrice: 1000000,
      fee: 15000,
      label: "Tier 2 (Mid Value Rp 500rb - Rp 1 Jt)",
      duration: "Aktif Selamanya Sampai Laku (Lifetime)"
    },
    BUDGET: {
      maxPrice: 499999,
      fee: 10000,
      label: "Tier 3 (Budget < Rp 500rb)",
      duration: "Aktif Selamanya Sampai Laku (Lifetime)"
    }
  }
};

/**
 * Menghitung biaya posting iklan berdasarkan harga barang
 * @param {number} itemPrice - Harga barang yang diinput penjual
 * @param {boolean} forcePaidMode - Override untuk simulasi pembayaran normal
 * @returns {object} Detail kalkulasi biaya
 */
export function calculateListingFee(itemPrice, forcePaidMode = false) {
  const price = Number(itemPrice) || 0;
  let standardFee = 10000;
  let tierInfo = SYSTEM_CONFIG.TIERS.BUDGET;

  if (price > 1000000) {
    standardFee = 25000;
    tierInfo = SYSTEM_CONFIG.TIERS.HIGH;
  } else if (price >= 500000) {
    standardFee = 15000;
    tierInfo = SYSTEM_CONFIG.TIERS.MID;
  }

  const isPromoActive = SYSTEM_CONFIG.LAUNCH_PROMO_MODE && !forcePaidMode;
  const finalFee = isPromoActive ? 0 : standardFee;
  const discountAmount = isPromoActive ? standardFee : 0;

  return {
    itemPrice: price,
    standardFee,
    discountAmount,
    finalFee,
    isPromoActive,
    promoName: isPromoActive ? SYSTEM_CONFIG.PROMO_NAME : null,
    tierLabel: tierInfo.label,
    durationText: tierInfo.duration
  };
}

/**
 * Format angka ke format mata uang Rupiah
 * @param {number} amount 
 * @returns {string} Contoh: "Rp 32.500.000"
 */
export function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount || 0);
}

/**
 * Format tanggal relatif ramah pengguna (contoh: "Hari ini", "2 hari lalu")
 * @param {string|Date} dateString 
 * @returns {string}
 */
export function formatRelativeDate(dateString) {
  if (!dateString) return "Baru saja";
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Baru saja";
  if (diffInHours < 24) return `${diffInHours} jam lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Kemarin";
  if (diffInDays < 30) return `${diffInDays} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}
