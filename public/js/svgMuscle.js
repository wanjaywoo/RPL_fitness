// public/js/svgMuscle.js
// Generator ilustrasi vektor orisinal anatomi tubuh manusia DEPAN dan BELAKANG
// Memiliki garis siluet kulit tubuh luar yang utuh (skin contour outline) dan otot terdefinisi di dalamnya
// 100% Mengikuti rancangan resmi "tampilan ke lima.png"

const SvgMuscleRenderer = {
  /**
   * Menghasilkan elemen SVG tubuh manusia lengkap dengan garis siluet kulit luar tampak DEPAN dan BELAKANG
   * @param {Object} options
   * @param {Array<string>} options.primaryMuscles - Nama-nama otot utama (Oranye #ea580c)
   * @param {Array<string>} options.secondaryMuscles - Nama-nama otot pendukung (Peach #fed7aa)
   * @param {number} [options.width=320]
   * @param {number} [options.height=320]
   * @param {boolean} [options.showBoth=true]
   * @returns {string} string HTML SVG
   */
  renderBodyDiagram({ primaryMuscles = [], secondaryMuscles = [], width = 320, height = 320, showBoth = true }) {
    const isPrimary = (muscleName) => {
      const lower = muscleName.toLowerCase();
      return primaryMuscles.some(m => m.toLowerCase().includes(lower) || lower.includes(m.toLowerCase()));
    };

    const isSecondary = (muscleName) => {
      const lower = muscleName.toLowerCase();
      return secondaryMuscles.some(m => m.toLowerCase().includes(lower) || lower.includes(m.toLowerCase()));
    };

    const getColor = (muscleName) => {
      if (isPrimary(muscleName)) return '#ea580c'; // Oranye pekat (Otot utama sesuai tampilan ke lima)
      if (isSecondary(muscleName)) return '#fed7aa'; // Peach lembut (Otot pendukung sesuai tampilan ke lima)
      return '#eaedf0'; // Abu-abu serat otot netral
    };

    // Warna masing-masing kelompok otot
    const cChest = getColor('dada');
    const cShoulders = getColor('bahu');
    const cBiceps = getColor('bisep') !== '#eaedf0' ? getColor('bisep') : getColor('lengan');
    const cTriceps = getColor('trisep') !== '#eaedf0' ? getColor('trisep') : getColor('lengan');
    const cAbs = getColor('perut');
    const cBack = getColor('punggung');
    const cTraps = getColor('trapezius') !== '#eaedf0' ? getColor('trapezius') : getColor('punggung');
    const cQuads = getColor('paha depan') !== '#eaedf0' ? getColor('paha depan') : getColor('kaki');
    const cHamstrings = getColor('paha belakang') !== '#eaedf0' ? getColor('paha belakang') : getColor('kaki');
    const cGlutes = getColor('bokong');
    const cCalves = getColor('betis') !== '#eaedf0' ? getColor('betis') : getColor('kaki');

    const skinOutlineColor = '#94a3b8'; // Garis luar siluet kulit
    const skinFill = '#f8fafc'; // Warna dasar kulit manusia
    const muscleLineColor = '#94a3b8'; // Garis sekat anatomi otot

    // 1. FIGUR TAMPAK DEPAN (Dengan Garis Kulit Luar Utuh & Otot di Dalamnya)
    const frontSvg = `
      <g transform="translate(10, 10)">
        <!-- LAPISAN 1: GARIS SILUET KULIT TUBUH LUAR UTUH (DEPAN) -->
        <!-- Garis Kulit Lengan Kiri Luar & Dalam -->
        <path d="M 36 40 C 26 40 18 46 17 56 C 16 66 14 80 14 96 C 14 104 16 112 18 116 C 19 118 22 118 23 116 C 25 111 25 104 25 96 C 26 84 27 74 29 65 C 30 60 32 58 35 56 Z" 
              fill="${skinFill}" stroke="${skinOutlineColor}" stroke-width="1.2" stroke-linejoin="round"/>
        
        <!-- Garis Kulit Lengan Kanan Luar & Dalam -->
        <path d="M 64 40 C 74 40 82 46 83 56 C 84 66 86 80 86 96 C 86 104 84 112 82 116 C 81 118 78 118 77 116 C 75 111 75 104 75 96 C 74 84 73 74 71 65 C 70 60 68 58 65 56 Z" 
              fill="${skinFill}" stroke="${skinOutlineColor}" stroke-width="1.2" stroke-linejoin="round"/>

        <!-- Garis Kulit Batang Tubuh, Pinggang, Selangkangan, dan Kedua Kaki Luar & Dalam -->
        <path d="M 44 32 L 44 40 C 37 40 33 46 32 58 C 31 70 33 82 31 98 C 29 112 28 132 30 156 C 31 166 31 180 32 196 C 32 204 33 210 29 214 C 28 215 31 216 35 216 C 41 216 43 214 43 208 C 44 196 44 182 44 168 C 45 156 46 140 46 122 C 46 112 47 106 50 102 C 53 106 54 112 54 122 C 54 140 55 156 56 168 C 56 182 56 196 57 208 C 57 214 59 216 65 216 C 69 216 72 215 71 214 C 67 210 68 204 68 196 C 69 180 69 166 70 156 C 72 132 71 112 69 98 C 67 82 69 70 68 58 C 67 46 63 40 56 40 L 56 32 Z" 
              fill="${skinFill}" stroke="${skinOutlineColor}" stroke-width="1.2" stroke-linejoin="round"/>

        <!-- Garis Kulit Kepala & Leher -->
        <ellipse cx="50" cy="19" rx="10.5" ry="12.5" fill="${skinFill}" stroke="${skinOutlineColor}" stroke-width="1.2"/>
        <line x1="45" y1="31" x2="45" y2="39" stroke="${skinOutlineColor}" stroke-width="1.2"/>
        <line x1="55" y1="31" x2="55" y2="39" stroke="${skinOutlineColor}" stroke-width="1.2"/>

        <!-- LAPISAN 2: BLOK ANATOMI OTOT DI DALAM GARIS KULIT (DEPAN) -->
        <!-- Bahu Deltoid Kiri & Kanan -->
        <path d="M 36 41 C 28 41 21 46 20 54 C 20 59 24 63 28 63 L 34 51 Z" 
              fill="${cShoulders}" stroke="${muscleLineColor}" stroke-width="1"/>
        <path d="M 64 41 C 72 41 79 46 80 54 C 80 59 76 63 72 63 L 66 51 Z" 
              fill="${cShoulders}" stroke="${muscleLineColor}" stroke-width="1"/>

        <!-- Dada Pectoralis Kiri & Kanan Bersekat Serat -->
        <path d="M 37 43 C 44 43 49 47 49 55 C 49 63 42 66 35 66 C 29 66 31 54 37 43 Z" 
              fill="${cChest}" stroke="${muscleLineColor}" stroke-width="1"/>
        <path d="M 63 43 C 56 43 51 47 51 55 C 51 63 58 66 65 66 C 71 66 69 54 63 43 Z" 
              fill="${cChest}" stroke="${muscleLineColor}" stroke-width="1"/>
        <line x1="38" y1="51" x2="48" y2="51" stroke="${muscleLineColor}" stroke-width="0.8" opacity="0.5"/>
        <line x1="37" y1="57" x2="48" y2="57" stroke="${muscleLineColor}" stroke-width="0.8" opacity="0.5"/>
        <line x1="62" y1="51" x2="52" y2="51" stroke="${muscleLineColor}" stroke-width="0.8" opacity="0.5"/>
        <line x1="63" y1="57" x2="52" y2="57" stroke="${muscleLineColor}" stroke-width="0.8" opacity="0.5"/>

        <!-- Lengan Atas Bisep -->
        <path d="M 21 58 C 17 64 16 73 19 80 L 25 78 C 26 71 26 64 24 58 Z" 
              fill="${cBiceps}" stroke="${muscleLineColor}" stroke-width="1"/>
        <path d="M 79 58 C 83 64 84 73 81 80 L 75 78 C 74 71 74 64 76 58 Z" 
              fill="${cBiceps}" stroke="${muscleLineColor}" stroke-width="1"/>

        <!-- Otot Perut (Six-pack Abs Bersekat Sesuai Tampilan 5) -->
        <path d="M 43 68 L 57 68 L 55 98 L 45 98 Z" 
              fill="${cAbs}" stroke="${muscleLineColor}" stroke-width="1"/>
        <line x1="50" y1="68" x2="50" y2="98" stroke="${muscleLineColor}" stroke-width="1"/>
        <line x1="44" y1="78" x2="56" y2="78" stroke="${muscleLineColor}" stroke-width="1"/>
        <line x1="44" y1="88" x2="56" y2="88" stroke="${muscleLineColor}" stroke-width="1"/>

        <!-- Paha Depan Quadriceps (Bersekat Anatomis Sesuai Mockup 5) -->
        <path d="M 36 102 C 31 117 31 137 34 154 C 38 156 45 155 47 152 C 48 135 47 116 45 102 Z" 
              fill="${cQuads}" stroke="${muscleLineColor}" stroke-width="1"/>
        <path d="M 64 102 C 69 117 69 137 66 154 C 62 156 55 155 53 152 C 52 135 53 116 55 102 Z" 
              fill="${cQuads}" stroke="${muscleLineColor}" stroke-width="1"/>
        <line x1="40" y1="108" x2="41" y2="150" stroke="${muscleLineColor}" stroke-width="0.8" opacity="0.6"/>
        <line x1="60" y1="108" x2="59" y2="150" stroke="${muscleLineColor}" stroke-width="0.8" opacity="0.6"/>

        <!-- Tempurung Lutut -->
        <circle cx="41" cy="159" r="3.2" fill="${skinFill}" stroke="${muscleLineColor}" stroke-width="1"/>
        <circle cx="59" cy="159" r="3.2" fill="${skinFill}" stroke="${muscleLineColor}" stroke-width="1"/>

        <!-- Betis Depan -->
        <path d="M 37 165 C 33 176 34 194 37 204 L 43 204 C 44 194 44 177 42 165 Z" 
              fill="${cCalves}" stroke="${muscleLineColor}" stroke-width="1"/>
        <path d="M 63 165 C 67 176 66 194 63 204 L 57 204 C 56 194 56 177 58 165 Z" 
              fill="${cCalves}" stroke="${muscleLineColor}" stroke-width="1"/>

        <!-- Label Teks DEPAN Sesuai Tampilan 5 -->
        <text x="50" y="235" font-size="9.5" fill="#64748b" font-weight="600" text-anchor="middle" letter-spacing="1">DEPAN</text>
      </g>
    `;

    // 2. FIGUR TAMPAK BELAKANG (Dengan Garis Kulit Luar Utuh & Otot di Dalamnya)
    const backSvg = `
      <g transform="translate(130, 10)">
        <!-- LAPISAN 1: GARIS SILUET KULIT TUBUH LUAR UTUH (BELAKANG) -->
        <!-- Garis Kulit Lengan Kiri Luar & Dalam -->
        <path d="M 36 40 C 26 40 18 46 17 56 C 16 66 14 80 14 96 C 14 104 16 112 18 116 C 19 118 22 118 23 116 C 25 111 25 104 25 96 C 26 84 27 74 29 65 C 30 60 32 58 35 56 Z" 
              fill="${skinFill}" stroke="${skinOutlineColor}" stroke-width="1.2" stroke-linejoin="round"/>
        
        <!-- Garis Kulit Lengan Kanan Luar & Dalam -->
        <path d="M 64 40 C 74 40 82 46 83 56 C 84 66 86 80 86 96 C 86 104 84 112 82 116 C 81 118 78 118 77 116 C 75 111 75 104 75 96 C 74 84 73 74 71 65 C 70 60 68 58 65 56 Z" 
              fill="${skinFill}" stroke="${skinOutlineColor}" stroke-width="1.2" stroke-linejoin="round"/>

        <!-- Garis Kulit Batang Tubuh, Bokong, dan Kaki Belakang -->
        <path d="M 44 32 L 44 40 C 37 40 33 46 32 58 C 31 70 33 82 31 98 C 29 112 28 132 30 156 C 31 166 31 180 32 196 C 32 204 33 210 29 214 C 28 215 31 216 35 216 C 41 216 43 214 43 208 C 44 196 44 182 44 168 C 45 156 46 140 46 122 C 46 112 47 106 50 102 C 53 106 54 112 54 122 C 54 140 55 156 56 168 C 56 182 56 196 57 208 C 57 214 59 216 65 216 C 69 216 72 215 71 214 C 67 210 68 204 68 196 C 69 180 69 166 70 156 C 72 132 71 112 69 98 C 67 82 69 70 68 58 C 67 46 63 40 56 40 L 56 32 Z" 
              fill="${skinFill}" stroke="${skinOutlineColor}" stroke-width="1.2" stroke-linejoin="round"/>

        <!-- Garis Kulit Kepala Belakang & Leher -->
        <ellipse cx="50" cy="19" rx="10.5" ry="12.5" fill="${skinFill}" stroke="${skinOutlineColor}" stroke-width="1.2"/>
        <line x1="45" y1="31" x2="45" y2="39" stroke="${skinOutlineColor}" stroke-width="1.2"/>
        <line x1="55" y1="31" x2="55" y2="39" stroke="${skinOutlineColor}" stroke-width="1.2"/>

        <!-- LAPISAN 2: BLOK ANATOMI OTOT DI DALAM GARIS KULIT (BELAKANG) -->
        <!-- Trapezius Punggung Atas -->
        <path d="M 37 41 C 44 44 56 44 63 41 L 58 58 C 54 59 46 59 42 58 Z" 
              fill="${cTraps}" stroke="${muscleLineColor}" stroke-width="1"/>

        <!-- Sayap Punggung Latissimus Dorsi (V-Taper) -->
        <path d="M 34 48 C 28 56 31 70 38 78 L 47 78 L 47 58 Z" 
              fill="${cBack}" stroke="${muscleLineColor}" stroke-width="1"/>
        <path d="M 66 48 C 72 56 69 70 62 78 L 53 78 L 53 58 Z" 
              fill="${cBack}" stroke="${muscleLineColor}" stroke-width="1"/>
        <line x1="50" y1="44" x2="50" y2="86" stroke="${muscleLineColor}" stroke-width="1"/>

        <!-- Bahu Belakang (Rear Delts) -->
        <path d="M 34 41 C 27 45 22 51 22 58 C 27 62 32 57 34 50 Z" 
              fill="${cShoulders}" stroke="${muscleLineColor}" stroke-width="1"/>
        <path d="M 66 41 C 73 45 78 51 78 58 C 73 62 68 57 66 50 Z" 
              fill="${cShoulders}" stroke="${muscleLineColor}" stroke-width="1"/>

        <!-- Trisep Lengan Belakang -->
        <path d="M 21 58 C 17 66 17 76 21 82 L 26 80 C 26 72 26 64 24 58 Z" 
              fill="${cTriceps}" stroke="${muscleLineColor}" stroke-width="1"/>
        <path d="M 79 58 C 83 66 83 76 79 82 L 74 80 C 74 72 74 64 76 58 Z" 
              fill="${cTriceps}" stroke="${muscleLineColor}" stroke-width="1"/>

        <!-- Bokong Gluteus Maximus Kiri & Kanan -->
        <path d="M 35 87 C 30 95 32 108 48 108 L 48 87 Z" 
              fill="${cGlutes}" stroke="${muscleLineColor}" stroke-width="1"/>
        <path d="M 65 87 C 70 95 68 108 52 108 L 52 87 Z" 
              fill="${cGlutes}" stroke="${muscleLineColor}" stroke-width="1"/>

        <!-- Paha Belakang Hamstrings (Bersekat Sesuai Tampilan 5) -->
        <path d="M 35 110 C 30 125 31 144 36 156 C 40 158 46 156 47 153 C 46 137 46 121 47 110 Z" 
              fill="${cHamstrings}" stroke="${muscleLineColor}" stroke-width="1"/>
        <path d="M 65 110 C 70 125 69 144 64 156 C 60 158 54 156 53 153 C 54 137 54 121 53 110 Z" 
              fill="${cHamstrings}" stroke="${muscleLineColor}" stroke-width="1"/>
        <line x1="41" y1="113" x2="42" y2="150" stroke="${muscleLineColor}" stroke-width="0.8" opacity="0.6"/>
        <line x1="59" y1="113" x2="58" y2="150" stroke="${muscleLineColor}" stroke-width="0.8" opacity="0.6"/>

        <!-- Betis Belakang Calves Gastrocnemius Berbentuk Khas -->
        <path d="M 36 166 C 29 176 30 196 37 206 L 43 206 C 44 195 44 178 42 166 Z" 
              fill="${cCalves}" stroke="${muscleLineColor}" stroke-width="1"/>
        <path d="M 64 166 C 71 176 70 196 63 206 L 57 206 C 56 195 56 178 58 166 Z" 
              fill="${cCalves}" stroke="${muscleLineColor}" stroke-width="1"/>

        <!-- Label Teks BELAKANG Sesuai Tampilan 5 -->
        <text x="50" y="235" font-size="9.5" fill="#64748b" font-weight="600" text-anchor="middle" letter-spacing="1">BELAKANG</text>
      </g>
    `;

    const viewBox = showBoth ? "0 0 240 250" : "0 0 110 250";
    const innerContent = showBoth ? `${frontSvg}${backSvg}` : frontSvg;

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}" style="display:block; margin: 0 auto; max-width: 100%; height: auto;">
        ${innerContent}
      </svg>
    `;
  },

  /**
   * Menghasilkan thumbnail anatomi tubuh tampak DEPAN dan BELAKANG untuk kartu katalog gerakan
   */
  renderThumbnail({ primaryMuscles = [], secondaryMuscles = [] }) {
    return this.renderBodyDiagram({
      primaryMuscles,
      secondaryMuscles,
      width: 86,
      height: 72,
      showBoth: true
    });
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SvgMuscleRenderer;
}
