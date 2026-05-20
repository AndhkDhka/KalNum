/**
 * langkah.js — Modul Renderer Langkah Pengerjaan
 * Menghasilkan langkah-langkah perhitungan yang runtut dan akademis
 * seperti di buku teks Metode Numerik
 */

"use strict";

const LangkahRenderer = (() => {

  /**
   * Buat HTML langkah-langkah pengerjaan lengkap
   * @param {object} param
   * @param {string}   param.mode        - 'fungsi' | 'tabel'
   * @param {object}   param.formula     - objek formula dari FORMULAS
   * @param {string}   param.formulaKey  - key formula (e.g. 'd1_oh2')
   * @param {number}   param.x0          - titik yang dihitung
   * @param {number}   param.h           - step size
   * @param {number[]} param.xArr        - array titik x yang dipakai
   * @param {number[]} param.fArr        - array nilai f di titik-titik tsb
   * @param {number}   param.hasil       - hasil perhitungan numerik
   * @param {number|null} param.hasilEksak - hasil eksak (jika ada)
   * @param {string}   param.exprStr     - ekspresi fungsi (mode fungsi)
   * @returns {string} HTML string
   */
  function render({ mode, formula, formulaKey, x0, h, xArr, fArr, hasil, hasilEksak, exprStr }) {

    const steps = [];

    // ── Langkah 0: Header info ─────────────────────────────────────
    steps.push({
      no: null,
      judul: "Informasi Metode",
      isi: `
        <div class="step-info-row"><span class="step-info-label">Metode:</span> <strong>Selisih Maju (Forward Difference)</strong></div>
        <div class="step-info-row"><span class="step-info-label">Formula:</span> <strong>${formula.label}</strong></div>
        <div class="step-info-row"><span class="step-info-label">Orde Galat:</span> <span class="badge-orde">${formula.orde_galat}</span></div>
        ${mode === 'fungsi' ? `<div class="step-info-row"><span class="step-info-label">f(x) =</span> <code>${exprStr}</code></div>` : ''}
        <div class="step-info-row"><span class="step-info-label">Rumus:</span> <code class="formula-code">${formula.notasi}</code></div>
      `
    });

    // ── Langkah 1: Menentukan h ────────────────────────────────────
    if (mode === 'fungsi') {
      steps.push({
        no: 1,
        judul: "Menentukan Nilai h",
        isi: `
          <p>Nilai <em>h</em> (step size) diberikan sebagai parameter input:</p>
          <div class="step-calc">h = ${fmt(h)}</div>
          <p class="step-note">💡 <em>h</em> adalah jarak yang digunakan untuk mendekati titik di sekitar x₀. Semakin kecil h, semakin akurat hasil (hingga batas presisi komputer).</p>
        `
      });
    } else {
      // Mode tabel — hitung h dari data
      steps.push({
        no: 1,
        judul: "Menentukan Nilai h dari Tabel Data",
        isi: `
          <p>Nilai <em>h</em> dihitung dari selisih antar titik x yang berurutan:</p>
          <div class="step-calc">
            h = x₁ − x₀<br>
            h = ${fmt(xArr[1])} − ${fmt(xArr[0])}<br>
            <strong>h = ${fmt(h)}</strong>
          </div>
          <p class="step-note">💡 Pada mode tabel, titik-titik x harus berjarak seragam (<em>uniform spacing</em>) agar rumus selisih maju berlaku.</p>
        `
      });
    }

    // ── Langkah 2: Tabel titik yang digunakan ─────────────────────
    const tabelRows = fArr.map((fi, i) => {
      const xi = xArr[i];
      return `<tr>
        <td><strong>f<sub>${i}</sub></strong> = f(x<sub>${i}</sub>)</td>
        <td>${fmt(xi)}</td>
        <td class="cell-accent">${fmt(fi)}</td>
      </tr>`;
    }).join('');

    steps.push({
      no: 2,
      judul: "Titik Data yang Digunakan",
      isi: `
        <p>Rumus <strong>${formula.label}</strong> membutuhkan <strong>${formula.minPts} titik</strong>:</p>
        <table class="step-table">
          <thead>
            <tr><th>Notasi</th><th>x<sub>i</sub></th><th>f(x<sub>i</sub>)</th></tr>
          </thead>
          <tbody>${tabelRows}</tbody>
        </table>
      `
    });

    // ── Langkah 3: Rumus ───────────────────────────────────────────
    steps.push({
      no: 3,
      judul: `Menggunakan Rumus ${formula.label}`,
      isi: `
        <div class="step-formula-box">
          <div class="step-formula-main">${formula.latexDisplay}</div>
        </div>
        ${penjelasanRumus(formulaKey)}
      `
    });

    // ── Langkah 4: Substitusi ──────────────────────────────────────
    const subsStr = formula.substitusi(fArr, h, x0);
    steps.push({
      no: 4,
      judul: "Substitusi Nilai",
      isi: `
        <p>Masukkan nilai yang telah diketahui ke dalam rumus:</p>
        <div class="step-calc">${subsStr}</div>
      `
    });

    // ── Langkah 5: Hasil ───────────────────────────────────────────
    // Hitung langkah numerasi antara
    const penghitungan = hitungDetail(formula, formulaKey, fArr, h);

    steps.push({
      no: 5,
      judul: "Perhitungan Numerik",
      isi: `
        <p>Menghitung nilai numerator dan denominator:</p>
        <div class="step-calc">${penghitungan}</div>
        <div class="step-result-final">
          <span class="step-result-label">${labelHasil(formula.order)} = </span>
          <span class="step-result-val">${fmt6(hasil)}</span>
        </div>
      `
    });

    // ── Langkah 6: Perbandingan eksak (jika tersedia) ─────────────
    if (hasilEksak !== null) {
      const galat = Math.abs((hasil - hasilEksak) / hasilEksak) * 100;
      steps.push({
        no: 6,
        judul: "Analisis Galat",
        isi: `
          <div class="step-galat-grid">
            <div class="step-galat-box">
              <div class="galat-label">Nilai Numerik (Selisih Maju)</div>
              <div class="galat-val accent">${fmt6(hasil)}</div>
            </div>
            <div class="step-galat-box">
              <div class="galat-label">Nilai Eksak (Turunan Analitik)</div>
              <div class="galat-val">${fmt6(hasilEksak)}</div>
            </div>
          </div>
          <div class="step-calc" style="margin-top:10px">
            ε<sub>t</sub> = |f'<sub>eksak</sub> − f'<sub>numerik</sub>| / |f'<sub>eksak</sub>| × 100%<br>
            ε<sub>t</sub> = |${fmt6(hasilEksak)} − ${fmt6(hasil)}| / |${fmt6(hasilEksak)}| × 100%<br>
            <strong>ε<sub>t</sub> = ${galat.toExponential(4)} %</strong>
          </div>
          ${analisisGalat(formula.orde_galat, galat)}
        `
      });
    } else {
      // Mode tabel — tidak ada nilai eksak
      steps.push({
        no: 6,
        judul: "Analisis Galat",
        isi: `
          <p>Pada mode tabel data, nilai eksak tidak tersedia untuk perhitungan galat.</p>
          ${analisisGalat(formula.orde_galat, null)}
        `
      });
    }

    // ── Render semua langkah ke HTML ───────────────────────────────
    return steps.map(renderStep).join('');
  }

  // ─── Fungsi pembantu ──────────────────────────────────────────────

  function renderStep({ no, judul, isi }) {
    if (no === null) {
      // Header info — tanpa nomor langkah
      return `
        <div class="step-block step-header">
          <div class="step-title">${judul}</div>
          <div class="step-body">${isi}</div>
        </div>
      `;
    }
    return `
      <div class="step-block">
        <div class="step-title">
          <span class="step-no">Langkah ${no}</span>
          <span class="step-judul">${judul}</span>
        </div>
        <div class="step-body">${isi}</div>
      </div>
    `;
  }

  function labelHasil(order) {
    const map = { 1: "f'(x₀)", 2: "f''(x₀)", 3: "f'''(x₀)", 4: "f''''(x₀)" };
    return map[order] || "f(ⁿ)(x₀)";
  }

  function penjelasanRumus(key) {
    const penj = {
      d1_oh:  `<p class="step-note">📌 Rumus ini menggunakan <strong>2 titik</strong> (f₀ dan f₁). Galat orde <em>O(h)</em> artinya jika h diperkecil 2×, galat turun sekitar 2×.</p>`,
      d1_oh2: `<p class="step-note">📌 Rumus ini menggunakan <strong>3 titik</strong> (f₀, f₁, f₂). Galat orde <em>O(h²)</em> artinya jika h diperkecil 2×, galat turun sekitar 4×. <strong>Lebih teliti dari orde O(h).</strong></p>`,
      d2_oh:  `<p class="step-note">📌 Rumus turunan kedua menggunakan beda maju dua kali. Galat <em>O(h)</em>.</p>`,
      d2_oh2: `<p class="step-note">📌 Rumus turunan kedua orde tinggi. Menggunakan 4 titik. Galat <em>O(h²)</em>.</p>`,
      d3_oh:  `<p class="step-note">📌 Turunan ketiga dengan beda maju. Koefisien diturunkan dari segitiga Pascal. Galat <em>O(h)</em>.</p>`,
      d4_oh:  `<p class="step-note">📌 Turunan keempat. Koefisien: 1, −4, 6, −4, 1 (baris ke-4 segitiga Pascal). Galat <em>O(h)</em>.</p>`,
    };
    return penj[key] || '';
  }

  function hitungDetail(formula, key, fArr, h) {
    // Rincian numerator dan denominator
    const lines = [];
    if (key === 'd1_oh') {
      const num = fArr[1] - fArr[0];
      lines.push(`Numerator = f₁ − f₀ = ${fmt(fArr[1])} − ${fmt(fArr[0])} = ${fmt(num)}`);
      lines.push(`Denominator = h = ${fmt(h)}`);
      lines.push(`Hasil = ${fmt(num)} / ${fmt(h)} = <strong>${fmt6(num / h)}</strong>`);
    } else if (key === 'd1_oh2') {
      const num = -3 * fArr[0] + 4 * fArr[1] - fArr[2];
      const den = 2 * h;
      lines.push(`Numerator = −3(${fmt(fArr[0])}) + 4(${fmt(fArr[1])}) − ${fmt(fArr[2])}`);
      lines.push(`         = ${fmt(-3*fArr[0])} + ${fmt(4*fArr[1])} − ${fmt(fArr[2])}`);
      lines.push(`         = ${fmt(num)}`);
      lines.push(`Denominator = 2h = 2 × ${fmt(h)} = ${fmt(den)}`);
      lines.push(`Hasil = ${fmt(num)} / ${fmt(den)} = <strong>${fmt6(num/den)}</strong>`);
    } else if (key === 'd2_oh') {
      const num = fArr[2] - 2*fArr[1] + fArr[0];
      const den = h*h;
      lines.push(`Numerator = f₂ − 2f₁ + f₀ = ${fmt(fArr[2])} − ${fmt(2*fArr[1])} + ${fmt(fArr[0])} = ${fmt(num)}`);
      lines.push(`Denominator = h² = ${fmt(h)}² = ${fmt(den)}`);
      lines.push(`Hasil = ${fmt(num)} / ${fmt(den)} = <strong>${fmt6(num/den)}</strong>`);
    } else if (key === 'd2_oh2') {
      const num = -fArr[3] + 4*fArr[2] - 5*fArr[1] + 2*fArr[0];
      const den = h*h;
      lines.push(`Numerator = −f₃ + 4f₂ − 5f₁ + 2f₀`);
      lines.push(`         = −${fmt(fArr[3])} + ${fmt(4*fArr[2])} − ${fmt(5*fArr[1])} + ${fmt(2*fArr[0])}`);
      lines.push(`         = ${fmt(num)}`);
      lines.push(`Denominator = h² = ${fmt(den)}`);
      lines.push(`Hasil = ${fmt(num)} / ${fmt(den)} = <strong>${fmt6(num/den)}</strong>`);
    } else if (key === 'd3_oh') {
      const num = fArr[3] - 3*fArr[2] + 3*fArr[1] - fArr[0];
      const den = h*h*h;
      lines.push(`Numerator = f₃ − 3f₂ + 3f₁ − f₀`);
      lines.push(`         = ${fmt(fArr[3])} − ${fmt(3*fArr[2])} + ${fmt(3*fArr[1])} − ${fmt(fArr[0])}`);
      lines.push(`         = ${fmt(num)}`);
      lines.push(`Denominator = h³ = ${fmt(den)}`);
      lines.push(`Hasil = <strong>${fmt6(num/den)}</strong>`);
    } else if (key === 'd4_oh') {
      const num = fArr[4] - 4*fArr[3] + 6*fArr[2] - 4*fArr[1] + fArr[0];
      const den = h*h*h*h;
      lines.push(`Numerator = f₄ − 4f₃ + 6f₂ − 4f₁ + f₀`);
      lines.push(`         = ${fmt(fArr[4])} − ${fmt(4*fArr[3])} + ${fmt(6*fArr[2])} − ${fmt(4*fArr[1])} + ${fmt(fArr[0])}`);
      lines.push(`         = ${fmt(num)}`);
      lines.push(`Denominator = h⁴ = ${fmt(den)}`);
      lines.push(`Hasil = <strong>${fmt6(num/den)}</strong>`);
    }
    return lines.join('<br>');
  }

  function analisisGalat(orde, galat) {
    const mapPenj = {
      "O(h)":  "Metode ini memiliki galat <strong>orde O(h)</strong>. Jika nilai h diperkecil 2 kali, maka galat akan berkurang sekitar 2 kali. Cocok untuk kalkulasi cepat dengan ketelitian sedang.",
      "O(h²)": "Metode ini memiliki galat <strong>orde O(h²)</strong>. Jika nilai h diperkecil 2 kali, maka galat akan berkurang sekitar <em>4 kali</em>. Lebih teliti dibandingkan orde O(h) dengan h yang sama.",
      "O(h⁴)": "Metode ini memiliki galat <strong>orde O(h⁴)</strong>. Sangat teliti — jika h diperkecil 2×, galat turun 16×."
    };
    const penj = mapPenj[orde] || `Orde galat: ${orde}`;
    const galatInfo = galat !== null
      ? `<div class="step-info-row" style="margin-top:8px"><span class="step-info-label">Galat Relatif Aktual:</span> <strong>${galat.toExponential(4)} %</strong></div>`
      : '';
    return `
      <div class="analisis-galat-box">
        <div class="step-info-row">📊 ${penj}</div>
        ${galatInfo}
        <div class="step-info-row" style="margin-top:6px;font-size:11px;color:var(--text-dim)">
          Kapan metode selisih maju digunakan? Saat kita hanya memiliki nilai fungsi di sebelah kanan titik x₀, 
          atau saat data dimulai dari titik awal tabel.
        </div>
      </div>
    `;
  }

  function fmt(n, d = 4) {
    if (n === undefined || n === null || isNaN(n)) return "?";
    const abs = Math.abs(n);
    if (abs >= 1e8 || (abs < 1e-4 && abs > 0)) return n.toExponential(d);
    return parseFloat(n.toPrecision(6)).toString();
  }

  function fmt6(n) {
    if (n === undefined || n === null || isNaN(n)) return "?";
    const abs = Math.abs(n);
    if (abs >= 1e8 || (abs < 1e-4 && abs > 0)) return n.toExponential(6);
    return parseFloat(n.toPrecision(8)).toString();
  }

  return { render };
})();
