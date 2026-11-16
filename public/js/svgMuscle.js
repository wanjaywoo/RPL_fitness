// public/js/svgMuscle.js
// Generator ilustrasi vektor orisinal anatomi tubuh manusia tampak DEPAN dan BELAKANG
// Sesuai aturan AGENTS.md: "Ilustrasi otot adalah SVG buatan sendiri"
// Menghasilkan warna oranye (#ea580c) untuk otot utama dan peach (#fed7aa) untuk pendukung

const SvgMuscleRenderer = {
  /**
   * Menghasilkan elemen SVG tubuh manusia depan dan belakang
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
      return '#e2e8f0'; // Abu-abu netral
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

    // Diagram Tubuh Tampak Depan
    const frontSvg = `
      <g transform="translate(10, 10)">
        <!-- Kepala & Leher -->
        <ellipse cx="50" cy="20" rx="12" ry="14" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M44 32 L44 38 L56 38 L56 32 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.2"/>
        
        <!-- Bahu (Deltoid Kiri & Kanan) -->
        <path d="M36 38 C30 38 24 44 24 52 C24 58 28 62 32 62 L36 50 Z" fill="${cShoulders}" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M64 38 C70 38 76 44 76 52 C76 58 72 62 68 62 L64 50 Z" fill="${cShoulders}" stroke="#94a3b8" stroke-width="1.2"/>
        
        <!-- Dada (Pectoralis Kiri & Kanan) -->
        <path d="M37 42 C42 42 48 45 49 52 C49 60 42 64 36 64 C32 64 33 54 37 42 Z" fill="${cChest}" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M63 42 C58 42 52 45 51 52 C51 60 58 64 64 64 C68 64 67 54 63 42 Z" fill="${cChest}" stroke="#94a3b8" stroke-width="1.2"/>
        
        <!-- Lengan Atas (Bisep Kiri & Kanan) -->
        <path d="M24 56 C20 62 19 72 23 80 L29 78 C31 70 30 62 26 56 Z" fill="${cBiceps}" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M76 56 C80 62 81 72 77 80 L71 78 C69 70 70 62 74 56 Z" fill="${cBiceps}" stroke="#94a3b8" stroke-width="1.2"/>

        <!-- Lengan Bawah -->
        <path d="M22 80 C18 88 17 100 20 108 L25 106 C27 98 27 88 28 80 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M78 80 C82 88 83 100 80 108 L75 106 C73 98 73 88 72 80 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.2"/>

        <!-- Otot Perut (Abs / Core) -->
        <path d="M43 66 L57 66 L55 96 L45 96 Z" fill="${cAbs}" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="50" y1="66" x2="50" y2="96" stroke="#94a3b8" stroke-width="1"/>
        <line x1="44" y1="76" x2="56" y2="76" stroke="#94a3b8" stroke-width="1"/>
        <line x1="44" y1="86" x2="56" y2="86" stroke="#94a3b8" stroke-width="1"/>

        <!-- Paha Depan (Quadriceps Kiri & Kanan) -->
        <path d="M38 100 C34 115 33 138 37 155 L48 153 C49 135 48 115 47 100 Z" fill="${cQuads}" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M62 100 C66 115 67 138 63 155 L52 153 C51 135 52 115 53 100 Z" fill="${cQuads}" stroke="#94a3b8" stroke-width="1.2"/>

        <!-- Lutut & Betis Depan -->
        <circle cx="42" cy="160" r="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.2"/>
        <circle cx="58" cy="160" r="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M39 166 C36 178 37 195 40 205 L46 205 C47 195 47 178 45 166 Z" fill="${cCalves}" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M61 166 C64 178 63 195 60 205 L54 205 C53 195 53 178 55 166 Z" fill="${cCalves}" stroke="#94a3b8" stroke-width="1.2"/>
        
        <!-- Label Tampak Depan -->
        <text x="50" y="222" font-size="9" fill="#94a3b8" font-weight="700" text-anchor="middle">DEPAN</text>
      </g>
    `;

    // Diagram Tubuh Tampak Belakang
    const backSvg = `
      <g transform="translate(125, 10)">
        <!-- Kepala Belakang -->
        <ellipse cx="50" cy="20" rx="12" ry="14" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M44 32 L44 38 L56 38 L56 32 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.2"/>

        <!-- Trapezius & Punggung Atas -->
        <path d="M38 38 L62 38 L56 56 L44 56 Z" fill="${cTraps}" stroke="#94a3b8" stroke-width="1.2"/>
        
        <!-- Punggung (Latissimus Dorsi Kiri & Kanan) -->
        <path d="M34 46 C30 54 34 68 40 76 L48 76 L48 56 Z" fill="${cBack}" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M66 46 C70 54 66 68 60 76 L52 76 L52 56 Z" fill="${cBack}" stroke="#94a3b8" stroke-width="1.2"/>

        <!-- Bahu Belakang (Rear Delts) -->
        <path d="M34 40 C28 44 26 50 26 56 L34 50 Z" fill="${cShoulders}" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M66 40 C72 44 74 50 74 56 L66 50 Z" fill="${cShoulders}" stroke="#94a3b8" stroke-width="1.2"/>

        <!-- Lengan Atas Belakang (Trisep Kiri & Kanan) -->
        <path d="M25 56 C21 64 21 74 24 80 L29 78 C28 72 29 64 31 56 Z" fill="${cTriceps}" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M75 56 C79 64 79 74 76 80 L71 78 C72 72 71 64 69 56 Z" fill="${cTriceps}" stroke="#94a3b8" stroke-width="1.2"/>

        <!-- Lengan Bawah -->
        <path d="M22 80 C18 88 17 100 20 108 L25 106 C27 98 27 88 28 80 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M78 80 C82 88 83 100 80 108 L75 106 C73 98 73 88 72 80 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.2"/>

        <!-- Bokong (Glutes Kiri & Kanan) -->
        <path d="M38 90 C34 98 36 108 48 108 L48 90 Z" fill="${cGlutes}" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M62 90 C66 98 64 108 52 108 L52 90 Z" fill="${cGlutes}" stroke="#94a3b8" stroke-width="1.2"/>

        <!-- Paha Belakang (Hamstrings Kiri & Kanan) -->
        <path d="M37 110 C34 125 35 142 39 155 L47 153 C46 138 46 122 47 110 Z" fill="${cHamstrings}" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M63 110 C66 125 65 142 61 155 L53 153 C54 138 54 122 53 110 Z" fill="${cHamstrings}" stroke="#94a3b8" stroke-width="1.2"/>

        <!-- Betis Belakang (Calves Gastrocnemius Kiri & Kanan) -->
        <path d="M38 165 C34 175 35 195 40 205 L46 205 C47 195 48 178 46 165 Z" fill="${cCalves}" stroke="#94a3b8" stroke-width="1.2"/>
        <path d="M62 165 C66 175 65 195 60 205 L54 205 C53 195 52 178 54 165 Z" fill="${cCalves}" stroke="#94a3b8" stroke-width="1.2"/>

        <!-- Label Tampak Belakang -->
        <text x="50" y="222" font-size="9" fill="#94a3b8" font-weight="700" text-anchor="middle">BELAKANG</text>
      </g>
    `;

    const viewBox = showBoth ? "0 0 240 240" : "0 0 110 240";
    const innerContent = showBoth ? `${frontSvg}${backSvg}` : frontSvg;

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}" style="display:block; margin: 0 auto;">
        ${innerContent}
      </svg>
    `;
  },

  /**
   * Menghasilkan thumbnail kecil tampak depan untuk kartu katalog
   */
  renderThumbnail({ primaryMuscles = [], secondaryMuscles = [] }) {
    return this.renderBodyDiagram({
      primaryMuscles,
      secondaryMuscles,
      width: 58,
      height: 72,
      showBoth: false
    });
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SvgMuscleRenderer;
}
