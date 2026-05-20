/**
 * rumus.js — Modul Rumus Selisih Maju (Forward Difference)
 * Referensi: Bab 7 Turunan Numerik (Metode Numerik)
 *
 * Notasi:
 *   f0 = f(x0), f1 = f(x0+h), f2 = f(x0+2h), dst.
 *   h  = jarak antar titik (step size)
 *   Δ  = operator beda maju (forward difference operator)
 *
 * Mahasiswa TI Semester 4 — setiap fungsi sudah diberi komentar rumus lengkap
 */

"use strict";

// ─── Daftar semua formula selisih maju ────────────────────────────────────────
const FORMULAS = {

  // ── Turunan Pertama ──────────────────────────────────────────────────────────

  /**
   * f'(x₀) = [f(x₀+h) - f(x₀)] / h
   * Orde galat: O(h) — galat proporsional dengan h
   * Butuh minimal 2 titik: f0, f1
   */
  d1_oh: {
    label:  "Turunan Pertama Orde O(h)",
    notasi: "f'(x₀) = [f₁ - f₀] / h",
    latexDisplay: "f'(x₀) = (f₁ − f₀) / h",
    order:  1,
    orde_galat: "O(h)",
    minPts: 2,
    /**
     * @param {number[]} f  - array nilai fungsi [f0, f1, ...]
     * @param {number}   h  - jarak antar titik
     * @returns {number}
     */
    hitung(f, h) {
      return (f[1] - f[0]) / h;
    },
    // Template substitusi untuk langkah pengerjaan
    substitusi(f, h, x0) {
      return `f'(${fmt(x0)}) = (${fmt(f[1])} − ${fmt(f[0])}) / ${fmt(h)}`;
    }
  },

  /**
   * f'(x₀) = [-3f(x₀) + 4f(x₀+h) - f(x₀+2h)] / (2h)
   * Orde galat: O(h²) — lebih teliti karena menggunakan 3 titik
   * Butuh minimal 3 titik: f0, f1, f2
   */
  d1_oh2: {
    label:  "Turunan Pertama Orde O(h²)",
    notasi: "f'(x₀) = [-3f₀ + 4f₁ - f₂] / (2h)",
    latexDisplay: "f'(x₀) = (−3f₀ + 4f₁ − f₂) / (2h)",
    order:  1,
    orde_galat: "O(h²)",
    minPts: 3,
    hitung(f, h) {
      return (-3 * f[0] + 4 * f[1] - f[2]) / (2 * h);
    },
    substitusi(f, h, x0) {
      return `f'(${fmt(x0)}) = (−3·${fmt(f[0])} + 4·${fmt(f[1])} − ${fmt(f[2])}) / (2·${fmt(h)})`;
    }
  },

  // ── Turunan Kedua ─────────────────────────────────────────────────────────────

  /**
   * f''(x₀) = [f(x₀+2h) - 2f(x₀+h) + f(x₀)] / h²
   * Orde galat: O(h)
   * Butuh minimal 3 titik: f0, f1, f2
   */
  d2_oh: {
    label:  "Turunan Kedua Orde O(h)",
    notasi: "f''(x₀) = [f₂ - 2f₁ + f₀] / h²",
    latexDisplay: "f''(x₀) = (f₂ − 2f₁ + f₀) / h²",
    order:  2,
    orde_galat: "O(h)",
    minPts: 3,
    hitung(f, h) {
      return (f[2] - 2 * f[1] + f[0]) / (h * h);
    },
    substitusi(f, h, x0) {
      return `f''(${fmt(x0)}) = (${fmt(f[2])} − 2·${fmt(f[1])} + ${fmt(f[0])}) / ${fmt(h)}²`;
    }
  },

  /**
   * f''(x₀) = [-f(x₀+3h) + 4f(x₀+2h) - 5f(x₀+h) + 2f(x₀)] / h²
   * Orde galat: O(h²)
   * Butuh minimal 4 titik: f0, f1, f2, f3
   */
  d2_oh2: {
    label:  "Turunan Kedua Orde O(h²)",
    notasi: "f''(x₀) = [-f₃ + 4f₂ - 5f₁ + 2f₀] / h²",
    latexDisplay: "f''(x₀) = (−f₃ + 4f₂ − 5f₁ + 2f₀) / h²",
    order:  2,
    orde_galat: "O(h²)",
    minPts: 4,
    hitung(f, h) {
      return (-f[3] + 4 * f[2] - 5 * f[1] + 2 * f[0]) / (h * h);
    },
    substitusi(f, h, x0) {
      return `f''(${fmt(x0)}) = (−${fmt(f[3])} + 4·${fmt(f[2])} − 5·${fmt(f[1])} + 2·${fmt(f[0])}) / ${fmt(h)}²`;
    }
  },

  // ── Turunan Ketiga ────────────────────────────────────────────────────────────

  /**
   * f'''(x₀) = [f(x₀+3h) - 3f(x₀+2h) + 3f(x₀+h) - f(x₀)] / h³
   * Orde galat: O(h)
   * Butuh minimal 4 titik: f0, f1, f2, f3
   */
  d3_oh: {
    label:  "Turunan Ketiga Selisih Maju",
    notasi: "f'''(x₀) = [f₃ - 3f₂ + 3f₁ - f₀] / h³",
    latexDisplay: "f'''(x₀) = (f₃ − 3f₂ + 3f₁ − f₀) / h³",
    order:  3,
    orde_galat: "O(h)",
    minPts: 4,
    hitung(f, h) {
      return (f[3] - 3 * f[2] + 3 * f[1] - f[0]) / (h * h * h);
    },
    substitusi(f, h, x0) {
      return `f'''(${fmt(x0)}) = (${fmt(f[3])} − 3·${fmt(f[2])} + 3·${fmt(f[1])} − ${fmt(f[0])}) / ${fmt(h)}³`;
    }
  },

  // ── Turunan Keempat ───────────────────────────────────────────────────────────

  /**
   * f''''(x₀) = [f(x₀+4h) - 4f(x₀+3h) + 6f(x₀+2h) - 4f(x₀+h) + f(x₀)] / h⁴
   * Orde galat: O(h)
   * Butuh minimal 5 titik: f0, f1, f2, f3, f4
   */
  d4_oh: {
    label:  "Turunan Keempat Selisih Maju",
    notasi: "f''''(x₀) = [f₄ - 4f₃ + 6f₂ - 4f₁ + f₀] / h⁴",
    latexDisplay: "f''''(x₀) = (f₄ − 4f₃ + 6f₂ − 4f₁ + f₀) / h⁴",
    order:  4,
    orde_galat: "O(h)",
    minPts: 5,
    hitung(f, h) {
      return (f[4] - 4 * f[3] + 6 * f[2] - 4 * f[1] + f[0]) / (h * h * h * h);
    },
    substitusi(f, h, x0) {
      return `f''''(${fmt(x0)}) = (${fmt(f[4])} − 4·${fmt(f[3])} + 6·${fmt(f[2])} − 4·${fmt(f[1])} + ${fmt(f[0])}) / ${fmt(h)}⁴`;
    }
  }
};

// ─── Contoh Soal Buku ─────────────────────────────────────────────────────────
// Data dari PDF Bab 7 Turunan Numerik
const CONTOH_SOAL = {
  xArr:  [1.3, 1.5, 1.7, 1.9, 2.1, 2.3, 2.5],
  fxArr: [3.669, 4.482, 5.474, 6.686, 8.166, 9.974, 12.182],
  keterangan: "Data dari buku: f(x) = e^x (nilai dibulatkan), x₀ = 1.3, h = 0.2"
};

// ─── Helper: format angka ─────────────────────────────────────────────────────
function fmt(n, digits = 4) {
  if (n === undefined || n === null || isNaN(n)) return "?";
  // Tampilkan angka dengan presisi yang baik, hindari notasi ilmiah untuk angka kecil normal
  const abs = Math.abs(n);
  if (abs >= 1e8 || (abs < 1e-4 && abs > 0)) return n.toExponential(digits);
  return parseFloat(n.toPrecision(6)).toString();
}

// ─── Helper: hitung galat relatif ─────────────────────────────────────────────
function hitungGalat(nilaiNumerik, nilaiEksak) {
  if (nilaiEksak === null || nilaiEksak === 0) return null;
  return Math.abs((nilaiNumerik - nilaiEksak) / nilaiEksak) * 100;
}
