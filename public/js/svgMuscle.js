// public/js/svgMuscle.js
// Generator ilustrasi vektor orisinal anatomi tubuh manusia atletik tampak DEPAN dan BELAKANG
// Serta generator ilustrasi dinamis untuk gerakan kardio
// Sesuai aturan AGENTS.md: "Ilustrasi otot adalah SVG buatan sendiri"
// Menghasilkan warna oranye (#ea580c) untuk otot utama dan peach (#fed7aa) untuk pendukung

const SvgMuscleRenderer = {
  /**
   * Menghasilkan elemen SVG tubuh manusia depan dan belakang dengan kontur atletik modern
   * @param {Object} options
   * @param {Array<string>} options.primaryMuscles - Nama-nama otot utama
   * @param {Array<string>} options.secondaryMuscles - Nama-nama otot pendukung
   * @param {number} [options.width=240]
   * @param {number} [options.height=260]
   * @param {boolean} [options.showBoth=true] - Jika false, hanya tampilkan tampak depan
   * @returns {string} string HTML SVG
   */
  renderBodyDiagram({ primaryMuscles = [], secondaryMuscles = [], width = 240, height = 260, showBoth = true }) {
    const isPrimary = (muscleName) => {
      const lower = muscleName.toLowerCase();
      return primaryMuscles.some(m => m.toLowerCase().includes(lower) || lower.includes(m.toLowerCase()));
    };

    const isSecondary = (muscleName) => {
      const lower = muscleName.toLowerCase();
      return secondaryMuscles.some(m => m.toLowerCase().includes(lower) || lower.includes(m.toLowerCase()));
    };

    const getColor = (muscleName) => {
      if (isPrimary(muscleName)) return '#ea580c'; // Oranye pekat (Otot utama)
      if (isSecondary(muscleName)) return '#fed7aa'; // Peach muda (Otot pendukung)
      return '#e2e8f0'; // Abu-abu netral terdefinisi
    };

    // Warna masing-masing kelompok otot
    const cChest = getColor('dada');
    const cShoulders = getColor('bahu');
    const cBiceps = getColor('bisep') !== '#e2e8f0' ? getColor('bisep') : getColor('lengan');
    const cTriceps = getColor('trisep') !== '#e2e8f0' ? getColor('trisep') : getColor('lengan');
    const cAbs = getColor('perut');
    const cBack = getColor('punggung');
    const cTraps = getColor('trapezius') !== '#e2e8f0' ? getColor('trapezius') : getColor('punggung');
    const cQuads = getColor('paha depan');
    const cHamstrings = getColor('paha belakang');
    const cGlutes = getColor('bokong');
    const cCalves = getColor('betis');

    // Diagram Tubuh Atletik Tampak Depan
    const frontSvg = `
      <g transform="translate(10, 8)">
        <!-- Bayangan Dasar Kaki -->
        <ellipse cx="50" cy="216" rx="28" ry="4" fill="#cbd5e1" opacity="0.4"/>

        <!-- Kepala & Leher Atletik -->
        <path d="M46 31 C46 38 43 40 43 43 L57 43 C57 40 54 38 54 31 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="1.2"/>
        <ellipse cx="50" cy="18" rx="11" ry="13" fill="#f8fafc" stroke="#64748b" stroke-width="1.2"/>
        
        <!-- Bahu Atletik (Deltoid Kiri & Kanan - Lekukan 3 Dimensi) -->
        <path d="M36 39 C29 39 21 44 20 54 C19 60 23 64 28 64 C32 64 34 56 36 49 Z" fill="${cShoulders}" stroke="#64748b" stroke-width="1.2"/>
        <path d="M64 39 C71 39 79 44 80 54 C81 60 77 64 72 64 C68 64 66 56 64 49 Z" fill="${cShoulders}" stroke="#64748b" stroke-width="1.2"/>
        
        <!-- Dada Atletik (Pectoralis Major & Minor Berlekuk) -->
        <path d="M37 42 C44 42 49 46 50 54 C50 63 42 66 35 66 C29 66 31 53 37 42 Z" fill="${cChest}" stroke="#64748b" stroke-width="1.2"/>
        <path d="M63 42 C56 42 51 46 50 54 C50 63 58 66 65 66 C71 66 69 53 63 42 Z" fill="${cChest}" stroke="#64748b" stroke-width="1.2"/>
        
        <!-- Lengan Atas (Bisep Atletik Menonjol) -->
        <path d="M21 57 C16 63 15 74 19 82 C22 83 26 81 27 77 C28 69 27 61 23 57 Z" fill="${cBiceps}" stroke="#64748b" stroke-width="1.2"/>
        <path d="M79 57 C84 63 85 74 81 82 C78 83 74 81 73 77 C72 69 73 61 77 57 Z" fill="${cBiceps}" stroke="#64748b" stroke-width="1.2"/>

        <!-- Lengan Bawah (Forearms Berotot) -->
        <path d="M19 82 C15 90 14 102 18 111 L23 108 C25 99 26 89 27 82 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="1.2"/>
        <path d="M81 82 C85 90 86 102 82 111 L77 108 C75 99 74 89 73 82 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="1.2"/>

        <!-- Otot Perut (Six-pack Abs Berdefinisi Tinggi & Serratus) -->
        <path d="M43 68 C43 68 47 67 50 67 C53 67 57 68 57 68 L55 98 C53 100 50 100 50 100 C50 100 47 100 45 98 Z" fill="${cAbs}" stroke="#64748b" stroke-width="1.2"/>
        <!-- Garis Definisi Sixpack -->
        <line x1="50" y1="67" x2="50" y2="99" stroke="#64748b" stroke-width="1" stroke-linecap="round"/>
        <line x1="43" y1="77" x2="57" y2="77" stroke="#64748b" stroke-width="1" stroke-linecap="round"/>
        <line x1="43" y1="87" x2="57" y2="87" stroke="#64748b" stroke-width="1" stroke-linecap="round"/>

        <!-- Paha Depan (Quadriceps Berdefinisi - Vastus Medialis & Lateralis) -->
        <path d="M37 101 C31 116 30 138 35 156 C38 158 45 157 47 154 C48 136 47 116 46 101 Z" fill="${cQuads}" stroke="#64748b" stroke-width="1.2"/>
        <path d="M63 101 C69 116 70 138 65 156 C62 158 55 157 53 154 C52 136 53 116 54 101 Z" fill="${cQuads}" stroke="#64748b" stroke-width="1.2"/>

        <!-- Tempurung Lutut -->
        <ellipse cx="41" cy="161" rx="4" ry="4" fill="#f1f5f9" stroke="#64748b" stroke-width="1.2"/>
        <ellipse cx="59" cy="161" rx="4" ry="4" fill="#f1f5f9" stroke="#64748b" stroke-width="1.2"/>

        <!-- Betis Depan Atletik (Tibialis & Gastrocnemius tampak samping) -->
        <path d="M38 167 C33 178 34 196 38 206 C42 208 45 206 46 206 C47 196 46 179 44 167 Z" fill="${cCalves}" stroke="#64748b" stroke-width="1.2"/>
        <path d="M62 167 C67 178 66 196 62 206 C58 208 55 206 54 206 C53 196 54 179 56 167 Z" fill="${cCalves}" stroke="#64748b" stroke-width="1.2"/>
        
        <!-- Telapak Kaki -->
        <path d="M35 207 L46 207 C46 211 41 213 34 212 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="1.2"/>
        <path d="M65 207 L54 207 C54 211 59 213 66 212 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="1.2"/>

        <!-- Label Tampak Depan -->
        <rect x="26" y="222" width="48" height="15" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="0.8"/>
        <text x="50" y="233" font-size="9" fill="#475569" font-weight="700" text-anchor="middle" letter-spacing="0.5">DEPAN</text>
      </g>
    `;

    // Diagram Tubuh Atletik Tampak Belakang
    const backSvg = `
      <g transform="translate(125, 8)">
        <!-- Bayangan Dasar Kaki -->
        <ellipse cx="50" cy="216" rx="28" ry="4" fill="#cbd5e1" opacity="0.4"/>

        <!-- Kepala Belakang & Leher -->
        <ellipse cx="50" cy="18" rx="11" ry="13" fill="#f8fafc" stroke="#64748b" stroke-width="1.2"/>
        <path d="M45 31 C45 37 43 40 43 42 L57 42 C57 40 55 37 55 31 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="1.2"/>

        <!-- Trapezius & Punggung Atas (V-Taper Mantap) -->
        <path d="M38 39 C44 42 56 42 62 39 L57 58 C53 59 47 59 43 58 Z" fill="${cTraps}" stroke="#64748b" stroke-width="1.2"/>
        
        <!-- Punggung (Latissimus Dorsi Atletik Kiri & Kanan - V-Taper) -->
        <path d="M34 47 C28 55 31 70 38 78 L47 78 L48 57 Z" fill="${cBack}" stroke="#64748b" stroke-width="1.2"/>
        <path d="M66 47 C72 55 69 70 62 78 L53 78 L52 57 Z" fill="${cBack}" stroke="#64748b" stroke-width="1.2"/>

        <!-- Bahu Belakang (Rear Delts) -->
        <path d="M34 40 C27 44 23 51 23 58 C28 62 33 57 34 50 Z" fill="${cShoulders}" stroke="#64748b" stroke-width="1.2"/>
        <path d="M66 40 C73 44 77 51 77 58 C72 62 67 57 66 50 Z" fill="${cShoulders}" stroke="#64748b" stroke-width="1.2"/>

        <!-- Lengan Atas Belakang (Trisep Atletik Tapak Kuda / Horseshoe) -->
        <path d="M22 58 C18 66 17 76 21 82 C25 83 28 80 28 77 C28 71 27 63 24 58 Z" fill="${cTriceps}" stroke="#64748b" stroke-width="1.2"/>
        <path d="M78 58 C82 66 83 76 79 82 C75 83 72 80 72 77 C72 71 73 63 76 58 Z" fill="${cTriceps}" stroke="#64748b" stroke-width="1.2"/>

        <!-- Lengan Bawah Belakang -->
        <path d="M20 82 C16 90 15 102 19 111 L24 108 C26 99 26 89 27 82 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="1.2"/>
        <path d="M80 82 C84 90 85 102 81 111 L76 108 C74 99 74 89 73 82 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="1.2"/>

        <!-- Bokong (Gluteus Maximus Atletik & Kuat) -->
        <path d="M36 88 C30 96 32 109 46 109 L48 88 Z" fill="${cGlutes}" stroke="#64748b" stroke-width="1.2"/>
        <path d="M64 88 C70 96 68 109 54 109 L52 88 Z" fill="${cGlutes}" stroke="#64748b" stroke-width="1.2"/>

        <!-- Paha Belakang (Hamstrings Atletik & Padat) -->
        <path d="M35 110 C30 125 31 144 36 156 C40 158 46 156 47 153 C46 138 46 122 47 110 Z" fill="${cHamstrings}" stroke="#64748b" stroke-width="1.2"/>
        <path d="M65 110 C70 125 69 144 64 156 C60 158 54 156 53 153 C54 138 54 122 53 110 Z" fill="${cHamstrings}" stroke="#64748b" stroke-width="1.2"/>

        <!-- Betis Belakang (Calves / Gastrocnemius Berbentuk Hati Khas Atlet) -->
        <path d="M36 166 C29 176 30 196 37 206 C41 207 45 205 46 205 C47 195 47 178 45 166 Z" fill="${cCalves}" stroke="#64748b" stroke-width="1.2"/>
        <path d="M64 166 C71 176 70 196 63 206 C59 207 55 205 54 205 C53 195 53 178 55 166 Z" fill="${cCalves}" stroke="#64748b" stroke-width="1.2"/>

        <!-- Tumit Kaki -->
        <path d="M36 207 L46 207 C46 211 42 213 37 212 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="1.2"/>
        <path d="M64 207 L54 207 C54 211 58 213 63 212 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="1.2"/>

        <!-- Label Tampak Belakang -->
        <rect x="21" y="222" width="58" height="15" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="0.8"/>
        <text x="50" y="233" font-size="9" fill="#475569" font-weight="700" text-anchor="middle" letter-spacing="0.5">BELAKANG</text>
      </g>
    `;

    const viewBox = showBoth ? "0 0 240 248" : "0 0 110 248";
    const innerContent = showBoth ? `${frontSvg}${backSvg}` : frontSvg;

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}" style="display:block; margin: 0 auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.04));">
        <defs>
          <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ea580c"/>
            <stop offset="100%" stop-color="#f97316"/>
          </linearGradient>
        </defs>
        ${innerContent}
      </svg>
    `;
  },

  /**
   * Menghasilkan ilustrasi vektor dinamis untuk gerakan kardio
   * @param {string} cardioName - Nama aktivitas (Lari, Sepeda, Renang, dll.)
   * @param {number} [width=68]
   * @param {number} [height=68]
   */
  renderCardioIllustration(cardioName = 'Lari', width = 68, height = 68) {
    const nameLower = (cardioName || '').toLowerCase();

    // 1. Bersepeda
    if (nameLower.includes('sepeda') || nameLower.includes('bike')) {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${width}" height="${height}">
          <circle cx="32" cy="32" r="30" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5"/>
          <!-- Roda Belakang & Depan -->
          <circle cx="20" cy="42" r="9" fill="none" stroke="#16a34a" stroke-width="2.5"/>
          <circle cx="44" cy="42" r="9" fill="none" stroke="#16a34a" stroke-width="2.5"/>
          <!-- Frame Sepeda -->
          <path d="M20 42 L29 28 L40 28 L44 42 M29 28 L32 42 L20 42 M32 42 L42 32" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Stang & Dudukan -->
          <path d="M38 24 L42 24 M27 25 L31 25" stroke="#15803d" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Pengendara Siluet -->
          <circle cx="33" cy="18" r="3.5" fill="#ea580c"/>
        </svg>
      `;
    }

    // 2. Renang
    if (nameLower.includes('renang') || nameLower.includes('swim')) {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${width}" height="${height}">
          <circle cx="32" cy="32" r="30" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.5"/>
          <!-- Gelombang Air -->
          <path d="M12 40 C18 37 24 43 30 40 C36 37 42 43 48 40 C51 38.5 53 40 55 41" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M10 47 C16 44 22 50 28 47 C34 44 40 50 46 47 C50 45 53 47 55 48" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
          <!-- Perenang Siluet -->
          <circle cx="44" cy="24" r="3.5" fill="#ea580c"/>
          <path d="M18 34 L28 30 L38 27 L44 28 M30 30 L36 21 L43 23" fill="none" stroke="#ea580c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    }

    // 3. Lari (Default Runner)
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${width}" height="${height}">
        <circle cx="32" cy="32" r="30" fill="#fff7ed" stroke="#fed7aa" stroke-width="1.5"/>
        <!-- Siluet Pelari Cepat Oranye Antigravity -->
        <circle cx="38" cy="16" r="4" fill="#ea580c"/>
        <!-- Badan & Tangan -->
        <path d="M35 22 L29 33 L21 37 M29 33 L35 30 L43 27 M35 30 L41 38" fill="none" stroke="#ea580c" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Kaki Melangkah Cepat -->
        <path d="M29 33 L26 44 L16 48 M29 33 L36 41 L47 45" fill="none" stroke="#f97316" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Garis Kecepatan -->
        <line x1="14" y1="26" x2="21" y2="26" stroke="#fb923c" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
        <line x1="11" y1="32" x2="19" y2="32" stroke="#fb923c" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
        <line x1="15" y1="38" x2="23" y2="38" stroke="#fb923c" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
      </svg>
    `;
  },

  /**
   * Menghasilkan thumbnail untuk kartu katalog gerakan
   */
  renderThumbnail({ primaryMuscles = [], secondaryMuscles = [], isCardio = false, cardioName = '' }) {
    if (isCardio) {
      return this.renderCardioIllustration(cardioName, 64, 64);
    }
    return this.renderBodyDiagram({
      primaryMuscles,
      secondaryMuscles,
      width: 62,
      height: 76,
      showBoth: false
    });
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SvgMuscleRenderer;
}
