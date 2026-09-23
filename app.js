import { BANDUNG_ZONES, CATEGORIES, INITIAL_LISTINGS } from './data.js';
import { calculateListingFee, formatRupiah, formatRelativeDate, SYSTEM_CONFIG } from './feeCalculator.js';

// State Utama Aplikasi
class FjbBandungApp {
  constructor() {
    this.storageKey = 'fjb_bandung_listings_v1';
    this.listings = this.loadListings();
    this.activeCategory = 'all';
    this.activeZone = 'semua';
    this.searchQuery = '';
    this.filterOnlyBarter = false;
    this.filterOnlyHighGrade = false;
    this.selectedListing = null;
    this.currentView = 'feed'; // 'feed', 'my-listings'
    this.forcePaidMode = false; // Toggle simulasi mode berbayar vs promo gratis

    this.init();
  }

  loadListings() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Gagal membaca dari localStorage", e);
    }
    return [...INITIAL_LISTINGS];
  }

  saveListings() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.listings));
    } catch (e) {
      console.error("Gagal menyimpan ke localStorage", e);
    }
  }

  init() {
    this.bindGlobalEvents();
    this.render();
  }

  bindGlobalEvents() {
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderListings();
      });
    }

    // Zone filter
    const zoneSelect = document.getElementById('zone-select');
    if (zoneSelect) {
      zoneSelect.addEventListener('change', (e) => {
        this.activeZone = e.target.value;
        this.renderListings();
      });
    }

    // Modal pasang iklan
    const btnOpenPost = document.getElementById('btn-open-post');
    if (btnOpenPost) {
      btnOpenPost.addEventListener('click', () => this.openPostModal());
    }

    // Modal simulasi fee
    const btnFeeInfo = document.getElementById('btn-fee-info');
    if (btnFeeInfo) {
      btnFeeInfo.addEventListener('click', () => this.openFeeSimulatorModal());
    }

    // Navigasi Iklan Saya
    const btnMyListings = document.getElementById('btn-my-listings');
    if (btnMyListings) {
      btnMyListings.addEventListener('click', () => {
        this.currentView = this.currentView === 'my-listings' ? 'feed' : 'my-listings';
        btnMyListings.classList.toggle('bg-teal-700', this.currentView === 'my-listings');
        btnMyListings.classList.toggle('text-white', this.currentView === 'my-listings');
        this.renderListings();
      });
    }

    // Reset data ke default (untuk testing)
    const btnResetData = document.getElementById('btn-reset-data');
    if (btnResetData) {
      btnResetData.addEventListener('click', () => {
        if (confirm("Kembalikan data ke listing awal FJB Bandung?")) {
          localStorage.removeItem(this.storageKey);
          this.listings = [...INITIAL_LISTINGS];
          this.saveListings();
          this.render();
        }
      });
    }
  }

  getFilteredListings() {
    return this.listings.filter(item => {
      // Filter tab iklan saya vs feed publik
      if (this.currentView === 'my-listings' && !item.isUserCreated) {
        return false;
      }

      // Filter Kategori
      if (this.activeCategory !== 'all' && item.category !== this.activeCategory) {
        return false;
      }

      // Filter Zona Wilayah Bandung
      if (this.activeZone !== 'semua' && item.zoneId !== this.activeZone) {
        return false;
      }

      // Filter Tuker Tambah (TT / BT)
      if (this.filterOnlyBarter && !item.isBarterAllowed) {
        return false;
      }

      // Filter Kondisi Mulus 90%+
      if (this.filterOnlyHighGrade && item.conditionGrade < 90) {
        return false;
      }

      // Filter Pencarian
      if (this.searchQuery) {
        const titleMatch = item.title.toLowerCase().includes(this.searchQuery);
        const descMatch = item.description.toLowerCase().includes(this.searchQuery);
        const districtMatch = item.district.toLowerCase().includes(this.searchQuery);
        if (!titleMatch && !descMatch && !districtMatch) {
          return false;
        }
      }

      return true;
    });
  }

  render() {
    this.renderCategoryPills();
    this.renderZoneOptions();
    this.renderListings();
    this.updateStats();
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderCategoryPills() {
    const container = document.getElementById('category-pills');
    if (!container) return;

    container.innerHTML = CATEGORIES.map(cat => {
      const isActive = this.activeCategory === cat.id;
      return `
        <button 
          data-category="${cat.id}"
          class="cat-pill whitespace-nowrap px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all flex items-center gap-1.5 ${
            isActive 
              ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20' 
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }"
        >
          <span>${cat.name}</span>
        </button>
      `;
    }).join('');

    container.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeCategory = e.currentTarget.dataset.category;
        this.renderCategoryPills();
        this.renderListings();
      });
    });
  }

  renderZoneOptions() {
    const select = document.getElementById('zone-select');
    if (!select) return;

    select.innerHTML = BANDUNG_ZONES.map(zone => {
      return `<option value="${zone.id}" ${this.activeZone === zone.id ? 'selected' : ''}>${zone.name}</option>`;
    }).join('');
  }

  renderListings() {
    const container = document.getElementById('listings-grid');
    const emptyState = document.getElementById('empty-state');
    const filtered = this.getFilteredListings();

    if (!container) return;

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    container.innerHTML = filtered.map(item => {
      const feeInfo = calculateListingFee(item.price);
      return `
        <div class="card-listing bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col relative group cursor-pointer" data-id="${item.id}">
          ${item.isSold ? '<div class="stamp-sold">TERJUAL</div>' : ''}
          
          <!-- Image Box -->
          <div class="relative aspect-[4/3] bg-slate-100 overflow-hidden">
            <img 
              src="${item.imageUrl}" 
              alt="${item.title}" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${item.isSold ? 'grayscale' : ''}"
              loading="lazy"
            />
            
            <!-- Badges top -->
            <div class="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
              <span class="bg-slate-900/80 backdrop-blur text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-teal-400"></i>
                Fisik ${item.conditionGrade}%
              </span>
              ${item.isBarterAllowed ? `
                <span class="badge-tt text-white text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                  <i data-lucide="repeat" class="w-3 h-3"></i>
                  Bisa TT
                </span>
              ` : ''}
            </div>

            <!-- Lokasi Bandung bottom badge -->
            <div class="absolute bottom-2.5 left-2.5">
              <span class="bg-black/60 backdrop-blur text-white text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1">
                <i data-lucide="map-pin" class="w-3 h-3 text-amber-400"></i>
                ${item.district}
              </span>
            </div>

            <div class="absolute bottom-2.5 right-2.5">
              <span class="bg-white/90 backdrop-blur text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md">
                ${formatRelativeDate(item.createdAt)}
              </span>
            </div>
          </div>

          <!-- Content Box -->
          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="font-bold text-slate-800 text-sm md:text-base line-clamp-2 leading-snug group-hover:text-teal-700 transition-colors">
                ${item.title}
              </h3>
              
              <div class="mt-2 text-lg md:text-xl font-extrabold text-teal-700">
                ${formatRupiah(item.price)}
              </div>

              <!-- Minus Snapshot -->
              <div class="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                <div class="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
                  <i data-lucide="info" class="w-3 h-3 text-amber-600"></i> Transparansi Minus:
                </div>
                <p class="truncate text-slate-700">${item.minusChecklist.join(', ') || 'Tidak ada minus (Fungsi normal)'}</p>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div class="flex items-center gap-1">
                <div class="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-[10px]">
                  ${item.sellerName.charAt(0)}
                </div>
                <span class="truncate max-w-[100px]">${item.sellerName}</span>
              </div>
              
              <button class="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-0.5">
                Lihat Detail <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Pasang listener klik pada setiap card
    container.querySelectorAll('.card-listing').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        this.openDetailModal(id);
      });
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  updateStats() {
    const countEl = document.getElementById('listing-count');
    if (countEl) {
      const activeCount = this.listings.filter(i => !i.isSold).length;
      countEl.innerText = `${activeCount} Barang Tayang`;
    }
  }

  openDetailModal(id) {
    const item = this.listings.find(l => l.id === id);
    if (!item) return;
    this.selectedListing = item;

    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-modal-content');
    if (!modal || !content) return;

    const zone = BANDUNG_ZONES.find(z => z.id === item.zoneId) || {};
    const safeSpots = zone.safeCodSpots || ["Area Minimarket / Kantor Polisi Terdekat"];

    // Format pesan WhatsApp khas Bandung
    const waText = encodeURIComponent(
      `Sampurasun Kang/Teh ${item.sellerName},\n\nSaya lihat iklan barang di FJB Bandung:\n📦 *${item.title}*\n💰 *Harga:* ${formatRupiah(item.price)}\n\nApakah barang masih tersedia dan bisa COD di sekitar *${item.safeCodSpot || item.district}*? Hatur nuhun!`
    );
    const waUrl = `https://wa.me/62${item.sellerPhone.replace(/^0/, '')}?text=${waText}`;

    content.innerHTML = `
      <div class="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <!-- Close Button -->
        <button id="btn-close-detail" class="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-slate-700 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <!-- Image Banner -->
        <div class="relative aspect-video bg-slate-900 overflow-hidden">
          <img src="${item.imageUrl}" alt="${item.title}" class="w-full h-full object-cover ${item.isSold ? 'grayscale' : ''}">
          ${item.isSold ? '<div class="stamp-sold">SUDAH TERJUAL</div>' : ''}
          <div class="absolute bottom-3 left-4 flex gap-2">
            <span class="bg-black/70 backdrop-blur text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-medium">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-amber-400"></i> ${item.district} (${zone.name || 'Bandung'})
            </span>
          </div>
        </div>

        <div class="p-6 md:p-8 space-y-6">
          <!-- Title & Price Section -->
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                ${CATEGORIES.find(c => c.id === item.category)?.name || 'Kategori'}
              </span>
              <span class="text-xs text-slate-500">• Diposting ${formatRelativeDate(item.createdAt)}</span>
              ${item.isSold ? '<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">Sold Out</span>' : '<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Tersedia</span>'}
            </div>

            <h2 class="text-xl md:text-2xl font-black text-slate-900 leading-tight">
              ${item.title}
            </h2>

            <!-- Price with Immutability Badge -->
            <div class="mt-3 flex items-baseline gap-3 flex-wrap">
              <span class="text-2xl md:text-3xl font-extrabold text-teal-700">
                ${formatRupiah(item.price)}
              </span>
              <span class="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200 flex items-center gap-1" title="Harga resmi saat iklan diterbitkan">
                <i data-lucide="lock" class="w-3 h-3 text-slate-500"></i> Harga Terkunci (Sistem Anti-Permainan)
              </span>
            </div>
          </div>

          <!-- KARTU TRANSPARANSI MINUS (ANTI-ZONK) -->
          <div class="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-bold text-amber-900 text-sm md:text-base flex items-center gap-2">
                <i data-lucide="file-check-2" class="w-4 h-4 text-amber-700"></i>
                Kartu Transparansi Kondisi & Minus
              </h3>
              <span class="bg-amber-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg">
                Fisik ${item.conditionGrade}%
              </span>
            </div>

            <p class="text-xs text-amber-800/90 mb-3">
              Penjual diwajibkan menuliskan semua kekurangan fisik/fungsi agar transaksi jujur dan aman bagi wargi Bandung:
            </p>

            <ul class="space-y-1.5 text-xs text-slate-700">
              ${item.minusChecklist.map(minus => `
                <li class="flex items-start gap-2">
                  <i data-lucide="alert-circle" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
                  <span>${minus}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- OPSI TUKER TAMBAH (TT / BT) -->
          ${item.isBarterAllowed ? `
            <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div class="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
                <i data-lucide="repeat" class="w-4 h-4"></i>
                Menerima Tuker Tambah (TT) / Barter (BT)
              </div>
              <p class="text-xs text-emerald-700">
                ${item.barterNote || 'Penjual terbuka untuk tawaran tuker tambah dengan barang sepadan.'}
              </p>
            </div>
          ` : ''}

          <!-- DESKRIPSI LENGKAP -->
          <div>
            <h4 class="font-bold text-slate-900 text-sm mb-2">Deskripsi Barang:</h4>
            <p class="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              ${item.description}
            </p>
          </div>

          <!-- REKOMENDASI TITIK COD AMAN -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 class="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1.5 mb-2">
              <i data-lucide="shield-check" class="w-4 h-4 text-teal-600"></i>
              Rekomendasi Titik COD Aman di ${item.district}:
            </h4>
            <div class="p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
              <i data-lucide="map-pin" class="w-4 h-4 text-teal-700"></i>
              ${item.safeCodSpot || safeSpots[0]}
            </div>
            <p class="text-[11px] text-slate-500 mt-2">
              💡 <em>Tips COD: Selalu ketemuan di tempat ramai/terang, cek fungsi barang bersama sebelum serah terima uang.</em>
            </p>
          </div>

          <!-- SELLER & CTA WHATSAPP -->
          <div class="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <div class="w-12 h-12 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center text-lg shadow-md shadow-teal-700/20">
                ${item.sellerName.charAt(0)}
              </div>
              <div>
                <div class="font-bold text-slate-900 text-sm">${item.sellerName}</div>
                <div class="text-xs text-slate-500">Wargi ${item.district}, Bandung</div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="w-full sm:w-auto flex items-center gap-2">
              ${item.isSold ? `
                <button disabled class="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-200 text-slate-500 font-bold text-sm cursor-not-allowed">
                  Barang Sudah Terjual
                </button>
              ` : `
                <a 
                  href="${waUrl}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-102"
                >
                  <i data-lucide="message-circle" class="w-4 h-4"></i>
                  Chat WhatsApp Sekarang
                </a>
              `}

              ${item.isUserCreated && !item.isSold ? `
                <button id="btn-mark-sold" class="px-3 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200" title="Tandai Sudah Terjual">
                  Tandai Laku
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    // Event listener tombol tutup
    document.getElementById('btn-close-detail').addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    // Mark as sold handler
    const markSoldBtn = document.getElementById('btn-mark-sold');
    if (markSoldBtn) {
      markSoldBtn.addEventListener('click', () => {
        if (confirm("Tandai barang ini sebagai sudah terjual? Iklan akan ditutup dan kontak tidak lagi aktif.")) {
          item.isSold = true;
          this.saveListings();
          this.openDetailModal(item.id);
          this.renderListings();
        }
      });
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  openPostModal() {
    const modal = document.getElementById('post-modal');
    if (!modal) return;

    modal.classList.remove('hidden');
    this.setupPostFormEvents();
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  setupPostFormEvents() {
    const form = document.getElementById('post-ad-form');
    const priceInput = document.getElementById('form-price');
    const feeDisplay = document.getElementById('fee-calculator-display');
    const zoneSelect = document.getElementById('form-zone');
    const codSpotSelect = document.getElementById('form-cod-spot');
    const sliderGrade = document.getElementById('form-grade');
    const labelGrade = document.getElementById('form-grade-val');
    const barterCheck = document.getElementById('form-barter-check');
    const barterNoteBox = document.getElementById('form-barter-note-box');

    // Populate zones in form
    if (zoneSelect) {
      zoneSelect.innerHTML = BANDUNG_ZONES.filter(z => z.id !== 'semua').map(z => {
        return `<option value="${z.id}">${z.name}</option>`;
      }).join('');

      const updateCodSpots = () => {
        const selectedZone = BANDUNG_ZONES.find(z => z.id === zoneSelect.value);
        if (selectedZone && codSpotSelect) {
          codSpotSelect.innerHTML = selectedZone.safeCodSpots.map(s => {
            return `<option value="${s}">${s}</option>`;
          }).join('');
        }
      };

      zoneSelect.addEventListener('change', updateCodSpots);
      updateCodSpots();
    }

    // Slider grade
    if (sliderGrade && labelGrade) {
      sliderGrade.addEventListener('input', (e) => {
        labelGrade.innerText = `${e.target.value}%`;
      });
    }

    // Barter toggle
    if (barterCheck && barterNoteBox) {
      barterCheck.addEventListener('change', (e) => {
        barterNoteBox.classList.toggle('hidden', !e.target.checked);
      });
    }

    // Live Fee Calculator as user types price!
    const updateFeeCalculator = () => {
      const priceVal = Number(priceInput.value) || 0;
      const fee = calculateListingFee(priceVal, this.forcePaidMode);

      feeDisplay.innerHTML = `
        <div class="p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
          <div class="flex items-center justify-between text-xs text-teal-900 font-semibold mb-2">
            <span>Kalkulator Biaya Listing:</span>
            <span class="px-2 py-0.5 rounded-full ${fee.isPromoActive ? 'bg-amber-100 text-amber-800' : 'bg-teal-700 text-white'}">
              ${fee.tierLabel}
            </span>
          </div>

          <div class="flex items-baseline justify-between pt-2 border-t border-teal-200/60">
            <div>
              <div class="text-[11px] text-slate-500">Tarif Standar: <span class="line-through ${fee.isPromoActive ? '' : 'hidden'}">${formatRupiah(fee.standardFee)}</span></div>
              <div class="text-base font-extrabold text-teal-800">
                ${fee.isPromoActive ? 'Rp 0 (100% Promo Launching)' : formatRupiah(fee.finalFee)}
              </div>
            </div>
            <div class="text-right">
              <span class="inline-block text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md">
                ${fee.durationText}
              </span>
            </div>
          </div>

          ${fee.isPromoActive ? `
            <div class="mt-2 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/60 flex items-center gap-1.5">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-600 shrink-0"></i>
              <span>Voucher <strong>${SYSTEM_CONFIG.PROMO_NAME}</strong> terpasang otomatis. Tidak perlu bayar sekarang!</span>
            </div>
          ` : `
            <div class="mt-2 text-[11px] text-teal-800 bg-white p-2 rounded-lg border border-teal-200 flex items-center gap-1.5">
              <i data-lucide="qr-code" class="w-3.5 h-3.5 text-teal-700 shrink-0"></i>
              <span>Pembayaran otomatis melalui QRIS instan terverifikasi.</span>
            </div>
          `}
        </div>
      `;

      if (window.lucide) {
        window.lucide.createIcons();
      }
    };

    if (priceInput) {
      priceInput.addEventListener('input', updateFeeCalculator);
      updateFeeCalculator();
    }

    // Submit handler
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('form-title').value.trim();
        const category = document.getElementById('form-category').value;
        const price = Number(document.getElementById('form-price').value);
        const zoneId = document.getElementById('form-zone').value;
        const district = document.getElementById('form-district').value.trim() || 'Bandung';
        const conditionGrade = Number(document.getElementById('form-grade').value);
        const minusInput = document.getElementById('form-minus').value.trim();
        const isBarterAllowed = document.getElementById('form-barter-check').checked;
        const barterNote = document.getElementById('form-barter-note').value.trim();
        const safeCodSpot = document.getElementById('form-cod-spot').value;
        const sellerName = document.getElementById('form-seller-name').value.trim() || 'Wargi Bandung';
        const sellerPhone = document.getElementById('form-seller-phone').value.trim() || '08123456789';
        const description = document.getElementById('form-desc').value.trim();
        const imageUrlInput = document.getElementById('form-image-url').value.trim();

        const minusChecklist = minusInput 
          ? minusInput.split(',').map(m => m.trim()).filter(Boolean)
          : ["Kondisi normal pemakaian wajar"];

        const newListing = {
          id: `fjb-user-${Date.now()}`,
          title,
          category,
          price,
          zoneId,
          district,
          conditionGrade,
          minusChecklist,
          isBarterAllowed,
          barterNote,
          safeCodSpot,
          sellerName,
          sellerPhone,
          description,
          imageUrl: imageUrlInput || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
          isSold: false,
          isUserCreated: true,
          createdAt: new Date().toISOString()
        };

        // Simpan ke daftar
        this.listings.unshift(newListing);
        this.saveListings();

        // Tutup modal & bersihkan form
        modal.classList.add('hidden');
        form.reset();

        // Tampilkan pesan sukses
        alert("🎉 Hatur nuhun! Iklan berhasil diterbitkan di FJB Bandung dan aktif selamanya sampai laku.");
        this.render();
      };
    }

    // Tombol close modal
    const closeBtn = document.getElementById('btn-close-post');
    if (closeBtn) {
      closeBtn.onclick = () => modal.classList.add('hidden');
    }
  }

  openFeeSimulatorModal() {
    const modal = document.getElementById('fee-modal');
    if (!modal) return;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('btn-close-fee');
    if (closeBtn) {
      closeBtn.onclick = () => modal.classList.add('hidden');
    }

    const testInput = document.getElementById('test-price-input');
    const resultBox = document.getElementById('test-price-result');
    const togglePaid = document.getElementById('toggle-paid-simulation');

    const updateSim = () => {
      const p = Number(testInput.value) || 0;
      const fee = calculateListingFee(p, this.forcePaidMode);
      
      resultBox.innerHTML = `
        <div class="space-y-3">
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-600">Tier Terpilih:</span>
            <span class="font-bold text-teal-800">${fee.tierLabel}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-600">Biaya Standar:</span>
            <span class="font-bold text-slate-800">${formatRupiah(fee.standardFee)}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-600">Diskon Soft Launching:</span>
            <span class="font-bold text-emerald-600">${fee.isPromoActive ? '- ' + formatRupiah(fee.discountAmount) + ' (100% OFF)' : 'Rp 0'}</span>
          </div>
          <div class="pt-3 border-t border-slate-200 flex justify-between items-center">
            <span class="font-bold text-slate-900">Total Wajib Dibayar:</span>
            <span class="text-xl font-extrabold text-teal-700">${formatRupiah(fee.finalFee)}</span>
          </div>
          <div class="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 text-center">
            Masa Tayang: <strong>${fee.durationText}</strong>
          </div>
        </div>
      `;
    };

    if (testInput) {
      testInput.oninput = updateSim;
      updateSim();
    }

    if (togglePaid) {
      togglePaid.checked = this.forcePaidMode;
      togglePaid.onchange = (e) => {
        this.forcePaidMode = e.target.checked;
        updateSim();
      };
    }
  }
}

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  window.fjbApp = new FjbBandungApp();
});
