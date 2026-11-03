/**
 * NexaCell Web App Logic
 * Handle:
 * - Mobile Menu
 * - Order Tabs
 * - Prefix-based Phone Operator Detection
 * - Real-time Price Update
 * - WhatsApp Form Auto-Formatting
 * - Product Catalog & Filtering
 * - Mock Service Tracking
 * - Accordion FAQ
 */

// ==========================================
// 1. DATA PRODUK & KONFIGURASI
// ==========================================
const WHATSAPP_NUMBER = "6282247548011"; // Ganti dengan nomor WA konter Anda

const productsData = [
    {
        id: 1,
        nama: "Kabel Data Fast Charging 65W Type-C",
        kategori: "charger",
        harga: 45000,
        badge: "Best Seller",
        gambar: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 2,
        nama: "Adaptor Batok Charger 33W Turbo",
        kategori: "charger",
        harga: 75000,
        badge: "Original",
        gambar: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 3,
        nama: "TWS Wireless Earbuds Bluetooth 5.3",
        kategori: "audio",
        harga: 120000,
        badge: "Super Bass",
        gambar: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 4,
        nama: "Headset Gaming Bass + Mic Fleksibel",
        kategori: "audio",
        harga: 85000,
        badge: "Gaming",
        gambar: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 5,
        nama: "Tempered Glass Anti-Spy (Privasi)",
        kategori: "proteksi",
        harga: 25000,
        badge: "Gratis Pasang",
        gambar: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 6,
        nama: "Case Magnetic Shockproof Transparan",
        kategori: "proteksi",
        harga: 35000,
        badge: "Tahan Bentur",
        gambar: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&auto=format&fit=crop&q=60"
    }
];

// Mock Database Nota Servis
const mockServiceNotes = {
    "SRV-001": {
        nama: "Budi Santoso",
        tipe: "Redmi Note 10 Pro",
        kerusakan: "Ganti LCD & Tombol Power",
        status: "Selesai",
        statusClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        biaya: "Rp 320.000",
        keterangan: "Ponsel sudah ditest QC, siap diambil di konter membawa nota fisik."
    },
    "SRV-002": {
        nama: "Siti Rahma",
        tipe: "Samsung Galaxy A52",
        kerusakan: "Ganti Baterai Original",
        status: "Sedang Dikerjakan",
        statusClass: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        biaya: "Rp 210.000",
        keterangan: "Suku cadang baterai baru tiba, teknisi sedang melakukan pemasangan."
    }
};

// ==========================================
// 2. HELPER UTILITIES
// ==========================================
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

function openWhatsApp(message) {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
}

// ==========================================
// 3. EVENT LISTENERS SETUP
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupOrderTabs();
    setupOperatorDetector();
    setupPriceWatchers();
    setupForms();
    renderProductGrid("all");
    setupCategoryFilters();
    setupTrackingSystem();
    setupAccordionFAQ();
});

// Mobile Menu Handler
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const menuIcon = document.getElementById("menuIcon");
    const navLinks = document.querySelectorAll(".mobile-nav-link");

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            const isHidden = mobileMenu.classList.toggle("hidden");
            menuIcon.className = isHidden ? "fa-solid fa-bars text-lg" : "fa-solid fa-xmark text-lg";
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.add("hidden");
                menuIcon.className = "fa-solid fa-bars text-lg";
            });
        });
    }
}

// Tab Switcher
function setupOrderTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");

            // Update Tab Button Styles
            tabBtns.forEach(b => {
                b.classList.remove("text-white", "bg-brand-600");
                b.classList.add("text-slate-600", "hover:text-slate-900", "hover:bg-slate-100");
            });
            btn.classList.add("text-white", "bg-brand-600");
            btn.classList.remove("text-slate-600", "hover:text-slate-900", "hover:bg-slate-100");

            // Show Content
            tabContents.forEach(content => {
                if (content.id === targetId) {
                    content.classList.remove("hidden");
                } else {
                    content.classList.add("hidden");
                }
            });
        });
    });
}

// Operator Detection via Prefixes
function setupOperatorDetector() {
    const nomorHpInput = document.getElementById("nomorHp");
    const operatorBadge = document.getElementById("operatorBadge");

    if (!nomorHpInput || !operatorBadge) return;

    nomorHpInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = val;

        if (val.length >= 4) {
            const prefix = val.substring(0, 4);
            let operator = null;
            let badgeClass = "bg-slate-100 text-slate-700";

            if (["0811", "0812", "0813", "0821", "0822", "0823", "0851", "0852", "0853"].includes(prefix)) {
                operator = "Telkomsel";
                badgeClass = "bg-red-100 text-red-700 border border-red-200";
            } else if (["0814", "0815", "0816", "0855", "0856", "0857", "0858"].includes(prefix)) {
                operator = "Indosat Ooredoo";
                badgeClass = "bg-yellow-100 text-yellow-800 border border-yellow-200";
            } else if (["0817", "0818", "0819", "0859", "0877", "0878"].includes(prefix)) {
                operator = "XL Axiata";
                badgeClass = "bg-blue-100 text-blue-700 border border-blue-200";
            } else if (["0831", "0832", "0833", "0838"].includes(prefix)) {
                operator = "Axis";
                badgeClass = "bg-purple-100 text-purple-700 border border-purple-200";
            } else if (["0895", "0896", "0897", "0898", "0899"].includes(prefix)) {
                operator = "Tri (3)";
                badgeClass = "bg-violet-100 text-violet-700 border border-violet-200";
            } else if (["0881", "0882", "0883", "0884", "0885", "0886", "0887", "0888", "0889"].includes(prefix)) {
                operator = "Smartfren";
                badgeClass = "bg-rose-100 text-rose-700 border border-rose-200";
            }

            if (operator) {
                operatorBadge.textContent = operator;
                operatorBadge.className = `absolute right-3 top-3 px-2.5 py-1 text-xs font-bold rounded-md ${badgeClass}`;
                operatorBadge.classList.remove("hidden");
            } else {
                operatorBadge.classList.add("hidden");
            }
        } else {
            operatorBadge.classList.add("hidden");
        }
    });
}

// Watch Select changes for real-time prices
function setupPriceWatchers() {
    const nominalPulsa = document.getElementById("nominalPulsa");
    const totalHargaPulsa = document.getElementById("totalHargaPulsa");
    if (nominalPulsa && totalHargaPulsa) {
        nominalPulsa.addEventListener("change", (e) => {
            const selected = e.target.options[e.target.selectedIndex];
            const harga = selected.getAttribute("data-harga");
            totalHargaPulsa.textContent = `Rp ${harga}`;
        });
    }

    const nominalTopup = document.getElementById("nominalTopup");
    const totalHargaTopup = document.getElementById("totalHargaTopup");
    if (nominalTopup && totalHargaTopup) {
        nominalTopup.addEventListener("change", (e) => {
            const selected = e.target.options[e.target.selectedIndex];
            const harga = selected.getAttribute("data-harga");
            totalHargaTopup.textContent = `Rp ${harga}`;
        });
    }

    const jenisKerusakan = document.getElementById("jenisKerusakan");
    const estimasiBiaya = document.getElementById("estimasiBiaya");
    if (jenisKerusakan && estimasiBiaya) {
        jenisKerusakan.addEventListener("change", (e) => {
            const selected = e.target.options[e.target.selectedIndex];
            const range = selected.getAttribute("data-range");
            estimasiBiaya.textContent = range;
        });
    }
}

// WhatsApp Order Forms
function setupForms() {
    // 1. Form Pulsa
    const formPulsa = document.getElementById("formPulsa");
    if (formPulsa) {
        formPulsa.addEventListener("submit", (e) => {
            e.preventDefault();
            const noHp = document.getElementById("nomorHp").value.trim();
            const operator = document.getElementById("operatorBadge").textContent.trim() || "All Operator";
            const jenis = document.getElementById("jenisProduk").value;
            const nominal = document.getElementById("nominalPulsa").value;
            const total = document.getElementById("totalHargaPulsa").textContent;

            const text = `Halo NexaCell, saya ingin order isi pulsa/kuota:\n\n` +
                         `📱 Nomor HP: ${noHp}\n` +
                         `📡 Provider: ${operator}\n` +
                         `📦 Layanan: ${jenis}\n` +
                         `🏷️ Nominal/Paket: ${nominal}\n` +
                         `💰 Total Bayar: ${total}\n\n` +
                         `Mohon info rekening/QRIS untuk pembayarannya. Terima kasih!`;
            openWhatsApp(text);
        });
    }

    // 2. Form Topup
    const formTopup = document.getElementById("formTopup");
    if (formTopup) {
        formTopup.addEventListener("submit", (e) => {
            e.preventDefault();
            const platform = document.getElementById("platformSelect").value;
            const akun = document.getElementById("akunId").value.trim();
            const nominal = document.getElementById("nominalTopup").value;
            const total = document.getElementById("totalHargaTopup").textContent;

            const text = `Halo NexaCell, mau top up saldo/voucher game:\n\n` +
                         `🎮 Platform: ${platform}\n` +
                         `🆔 ID Akun / No HP: ${akun}\n` +
                         `🏷️ Paket: ${nominal}\n` +
                         `💰 Total Transfer: ${total}\n\n` +
                         `Apakah ready? Mohon kirimkan QRIS pembayarannya.`;
            openWhatsApp(text);
        });
    }

    // 3. Form Servis
    const formServis = document.getElementById("formServis");
    if (formServis) {
        formServis.addEventListener("submit", (e) => {
            e.preventDefault();
            const brand = document.getElementById("brandHp").value;
            const tipe = document.getElementById("tipeHp").value.trim();
            const kerusakan = document.getElementById("jenisKerusakan").value;
            const estimasi = document.getElementById("estimasiBiaya").textContent;

            const text = `Halo Teknisi NexaCell, mau tanya konsultasi servis smartphone:\n\n` +
                         `📱 Merek & Model: ${brand} - ${tipe}\n` +
                         `🛠️ Keluhan Kerusakan: ${kerusakan}\n` +
                         `📊 Estimasi Awal Web: ${estimasi}\n\n` +
                         `Apakah suku cadangnya tersedia dan bisa ditunggu pengerjaannya?`;
            openWhatsApp(text);
        });
    }
}

// Render Katalog Produk
function renderProductGrid(filterCategory = "all") {
    const container = document.getElementById("productGrid");
    if (!container) return;

    const filtered = filterCategory === "all" 
        ? productsData 
        : productsData.filter(item => item.kategori === filterCategory);

    container.innerHTML = filtered.map(item => `
        <div class="product-card bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
            <div>
                <div class="relative overflow-hidden aspect-square bg-slate-100">
                    <img src="${item.gambar}" alt="${item.nama}" class="w-full h-full object-cover">
                    <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 backdrop-blur-sm text-white">
                        ${item.badge}
                    </span>
                </div>
                <div class="p-3.5">
                    <p class="text-[10px] font-bold uppercase tracking-wider text-brand-600 mb-0.5">${item.kategori}</p>
                    <h4 class="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">${item.nama}</h4>
                    <p class="text-sm sm:text-base font-extrabold text-slate-900 mt-2">${formatRupiah(item.harga)}</p>
                </div>
            </div>
            <div class="p-3.5 pt-0">
                <button type="button" onclick="pesanAksesoris('${item.nama}', ${item.harga})" class="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-brand-600 hover:text-white text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors">
                    <i class="fa-brands fa-whatsapp"></i> Beli Sekarang
                </button>
            </div>
        </div>
    `).join('');
}

function pesanAksesoris(nama, harga) {
    const text = `Halo NexaCell, saya ingin memesan aksesoris ini:\n\n` +
                 `📦 Produk: ${nama}\n` +
                 `💰 Harga: ${formatRupiah(harga)}\n\n` +
                 `Apakah stok barangnya tersedia?`;
    openWhatsApp(text);
}

// Filter Buttons Handler
function setupCategoryFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const cat = btn.getAttribute("data-category");

            filterBtns.forEach(b => {
                b.classList.remove("bg-slate-900", "text-white");
                b.classList.add("bg-slate-100", "text-slate-600");
            });

            btn.classList.add("bg-slate-900", "text-white");
            btn.classList.remove("bg-slate-100", "text-slate-600");

            renderProductGrid(cat);
        });
    });
}

// Tracking Status Servis HP
function setupTrackingSystem() {
    const form = document.getElementById("trackingForm");
    const input = document.getElementById("notaInput");
    const resultBox = document.getElementById("trackingResult");

    if (!form || !input || !resultBox) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = input.value.trim().toUpperCase();

        if (mockServiceNotes[query]) {
            const data = mockServiceNotes[query];
            resultBox.innerHTML = `
                <div class="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
                    <div>
                        <span class="text-[10px] text-slate-400 font-mono">NO. NOTA: ${query}</span>
                        <h4 class="font-bold text-white text-base">${data.tipe}</h4>
                    </div>
                    <span class="px-2.5 py-1 text-xs font-bold rounded-lg border ${data.statusClass}">
                        ${data.status}
                    </span>
                </div>
                <div class="space-y-1.5 text-xs text-slate-300">
                    <p><strong class="text-slate-400">Pemilik:</strong> ${data.nama}</p>
                    <p><strong class="text-slate-400">Tindakan:</strong> ${data.kerusakan}</p>
                    <p><strong class="text-slate-400">Estimasi Biaya:</strong> <span class="text-emerald-400 font-bold">${data.biaya}</span></p>
                    <p class="pt-2 text-slate-400 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/60">
                        "${data.keterangan}"
                    </p>
                </div>
            `;
            resultBox.classList.remove("hidden");
        } else {
            // Nota acak / tidak terdaftar
            resultBox.innerHTML = `
                <div class="text-center py-3">
                    <i class="fa-solid fa-circle-exclamation text-amber-400 text-2xl mb-2"></i>
                    <h4 class="font-bold text-white text-sm">Nomor Nota [${query}] Belum Terdaftar</h4>
                    <p class="text-xs text-slate-400 mt-1">Periksa kembali penulisan nomor nota pada bukti fisik servis Anda atau hubungi admin jika baru mendaftar hari ini.</p>
                </div>
            `;
            resultBox.classList.remove("hidden");
        }
    });
}

// Accordion FAQ Handler
function setupAccordionFAQ() {
    const faqToggles = document.querySelectorAll(".faq-toggle");
    faqToggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            const answer = toggle.nextElementSibling;
            const isOpen = !answer.classList.contains("hidden");

            // Close all first
            document.querySelectorAll(".faq-answer").forEach(a => a.classList.add("hidden"));
            document.querySelectorAll(".faq-toggle").forEach(t => t.classList.remove("active"));

            // Toggle selected
            if (!isOpen) {
                answer.classList.remove("hidden");
                toggle.classList.add("active");
            }
        });
    });
}