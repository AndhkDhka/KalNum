/**
 * validator.js — Modul Validasi Input
 * Memvalidasi semua input sebelum perhitungan dilakukan
 * Menampilkan pesan error matematis yang jelas dan informatif
 */

"use strict";

const Validator = (() => {

  /**
   * Validasi mode fungsi f(x)
   * @param {string} exprStr  - ekspresi fungsi
   * @param {number} x0       - titik awal
   * @param {number} h        - step size
   * @param {object} formula  - objek formula dari rumus.js
   * @returns {{ valid: boolean, pesan: string }}
   */
  function validasiFungsi(exprStr, x0, h, formula) {
    if (!exprStr || exprStr.trim() === "") {
      return { valid: false, pesan: "Masukkan ekspresi fungsi f(x) terlebih dahulu." };
    }
    if (isNaN(x0)) {
      return { valid: false, pesan: "Nilai x₀ tidak valid. Masukkan angka yang benar." };
    }
    if (isNaN(h) || h === 0) {
      return { valid: false, pesan: "Nilai h tidak boleh 0. Masukkan nilai langkah (step size) yang valid." };
    }
    if (Math.abs(h) < 1e-15) {
      return { valid: false, pesan: "Nilai h terlalu kecil. Gunakan h ≥ 1×10⁻¹⁰ untuk menghindari galat pembulatan." };
    }
    // Coba evaluasi ekspresi
    try {
      math.evaluate(exprStr, { x: x0 });
    } catch (e) {
      return { valid: false, pesan: `Ekspresi fungsi tidak valid: "${e.message}". Periksa penulisan f(x).` };
    }
    return { valid: true, pesan: "" };
  }

  /**
   * Validasi mode tabel data
   * @param {number[]} xArr   - array nilai x
   * @param {number[]} fxArr  - array nilai f(x)
   * @param {object}   formula - objek formula dari rumus.js
   * @returns {{ valid: boolean, pesan: string }}
   */
  function validasiTabel(xArr, fxArr, formula) {
    if (xArr.length === 0 || fxArr.length === 0) {
      return { valid: false, pesan: "Tabel data kosong. Masukkan minimal 2 pasangan titik (x, f(x))." };
    }
    if (xArr.length !== fxArr.length) {
      return { valid: false, pesan: `Jumlah nilai x (${xArr.length}) harus sama dengan jumlah nilai f(x) (${fxArr.length}).` };
    }
    if (xArr.some(isNaN)) {
      return { valid: false, pesan: "Terdapat nilai x yang tidak valid. Pastikan semua x adalah angka." };
    }
    if (fxArr.some(isNaN)) {
      return { valid: false, pesan: "Terdapat nilai f(x) yang tidak valid. Pastikan semua f(x) adalah angka." };
    }
    if (xArr.length < formula.minPts) {
      return {
        valid: false,
        pesan: `Formula "${formula.label}" membutuhkan minimal ${formula.minPts} titik data. Saat ini hanya ada ${xArr.length} titik.`
      };
    }
    // Cek apakah jarak antar titik konsisten (uniform spacing)
    const hVals = [];
    for (let i = 1; i < xArr.length; i++) {
      hVals.push(parseFloat((xArr[i] - xArr[i - 1]).toFixed(10)));
    }
    const h0 = hVals[0];
    const tidakUniform = hVals.some(hi => Math.abs(hi - h0) > 1e-8);
    if (tidakUniform) {
      return { valid: false, pesan: "Jarak antar titik x harus seragam (uniform spacing). Periksa kembali nilai x." };
    }
    if (Math.abs(h0) < 1e-12) {
      return { valid: false, pesan: "Nilai h (jarak antar x) terlalu kecil atau titik-titik x memiliki nilai yang sama." };
    }
    return { valid: true, pesan: "", h: h0 };
  }

  return { validasiFungsi, validasiTabel };
})();
