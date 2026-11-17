// public/js/svgMuscle.js
// Generator ilustrasi vektor orisinal anatomi tubuh manusia DEPAN dan BELAKANG
// 100% Mengikuti rancangan resmi "tampilan ke lima.png"
// Menghasilkan warna oranye (#ea580c) untuk otot utama dan peach (#fed7aa) untuk otot pendukung

const SvgMuscleRenderer = {
  /**
   * Menghasilkan elemen SVG tubuh manusia depan dan belakang berdampingan persis sesuai tampilan ke lima.png
   * @param {Object} options
   * @param {Array<string>} options.primaryMuscles - Nama-nama otot utama
   * @param {Array<string>} options.secondaryMuscles - Nama-nama otot pendukung
   * @param {number} [options.width=320]
   * @param {number} [options.height=320]
   * @param {boolean} [options.showBoth=true] - Menampilkan tampak DEPAN dan BELAKANG
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
      if (isPrimary(muscleName)) return '#ea580c'; // Oranye pekat (Otot utama sesuai mockup 5)
      if (isSecondary(muscleName)) return '#fed7aa'; // Peach lembut (Otot pendukung sesuai mockup 5)
      return '#eaedf0'; // Abu-abu netral terdefinisi
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

    const strokeColor = '#94a3b8';
    const strokeWidth = '1';

    // 1. Figur Tubuh Posisi DEPAN (Kiri)
    const frontSvg = `
      <g transform="translate(10, 10)">
        <!-- Kepala & Leher -->
        <ellipse cx="50" cy="22" rx="10" ry="12" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M46 33 L45 42 L55 42 L54 33 Z" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>

        <!-- Bahu Deltoid Kiri & Kanan -->
        <path d="M37 42 C29 42 22 47 21 56 C20 62 25 65 30 65 L35 52 Z" fill="${cShoulders}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M63 42 C71 42 78 47 79 56 C80 62 75 65 70 65 L65 52 Z" fill="${cShoulders}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>

        <!-- Dada Pectoralis Kiri & Kanan dengan Garis Serat (Striations) -->
        <path d="M37 44 C44 44 49 48 49 56 C49 64 41 67 34 67 C28 67 30 55 37 44 Z" fill="${cChest}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M63 44 C56 44 51 48 51 56 C51 64 59 67 66 67 C72 67 70 55 63 44 Z" fill="${cChest}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <line x1="37" y1="52" x2="48" y2="52" stroke="${strokeColor}" stroke-width="0.8" opacity="0.6"/>
        <line x1="36" y1="58" x2="48" y2="58" stroke="${strokeColor}" stroke-width="0.8" opacity="0.6"/>
        <line x1="63" y1="52" x2="52" y2="52" stroke="${strokeColor}" stroke-width="0.8" opacity="0.6"/>
        <line x1="64" y1="58" x2="52" y2="58" stroke="${strokeColor}" stroke-width="0.8" opacity="0.6"/>

        <!-- Lengan Atas Bisep -->
        <path d="M21 59 C17 65 16 75 20 83 L26 81 C27 74 27 66 24 59 Z" fill="${cBiceps}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M79 59 C83 65 84 75 80 83 L74 81 C73 74 73 66 76 59 Z" fill="${cBiceps}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>

        <!-- Lengan Bawah & Tangan -->
        <path d="M20 83 C16 91 15 102 18 111 L23 109 C25 101 26 91 26 83 Z" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M80 83 C84 91 85 102 82 111 L77 109 C75 101 74 91 74 83 Z" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <circle cx="19" cy="115" r="3.5" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <circle cx="81" cy="115" r="3.5" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>

        <!-- Otot Perut (Six-pack Abs Bersekat Sesuai Tampilan 5) -->
        <path d="M42 69 L58 69 L56 100 L44 100 Z" fill="${cAbs}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <line x1="50" y1="69" x2="50" y2="100" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <line x1="43" y1="78" x2="57" y2="78" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <line x1="43" y1="88" x2="57" y2="88" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>

        <!-- Paha Depan Quadriceps (Bersekat Anatomis Sesuai Mockup 5) -->
        <path d="M37 103 C31 118 30 138 35 158 C38 160 46 159 48 156 C49 137 48 117 46 103 Z" fill="${cQuads}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M63 103 C69 118 70 138 65 158 C62 160 54 159 52 156 C51 137 52 117 54 103 Z" fill="${cQuads}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <line x1="41" y1="108" x2="42" y2="152" stroke="${strokeColor}" stroke-width="0.8" opacity="0.6"/>
        <line x1="59" y1="108" x2="58" y2="152" stroke="${strokeColor}" stroke-width="0.8" opacity="0.6"/>

        <!-- Lutut -->
        <circle cx="41" cy="163" r="3.5" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <circle cx="59" cy="163" r="3.5" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>

        <!-- Betis Depan & Kaki -->
        <path d="M38 169 C33 180 34 198 38 208 L45 208 C46 198 46 181 44 169 Z" fill="${cCalves}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M62 169 C67 180 66 198 62 208 L55 208 C54 198 54 181 56 169 Z" fill="${cCalves}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M35 209 L46 209 C46 213 41 215 34 214 Z" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M65 209 L54 209 C54 213 59 215 66 214 Z" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>

        <!-- Label Teks DEPAN Sesuai Tampilan 5 -->
        <text x="50" y="235" font-size="9.5" fill="#64748b" font-weight="600" text-anchor="middle" letter-spacing="1">DEPAN</text>
      </g>
    `;

    // 2. Figur Tubuh Posisi BELAKANG (Kanan)
    const backSvg = `
      <g transform="translate(130, 10)">
        <!-- Kepala Belakang & Leher -->
        <ellipse cx="50" cy="22" rx="10" ry="12" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M46 33 L45 42 L55 42 L54 33 Z" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>

        <!-- Trapezius Punggung Atas -->
        <path d="M37 42 C44 45 56 45 63 42 L58 59 C54 60 46 60 42 59 Z" fill="${cTraps}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>

        <!-- Sayap Punggung Latissimus Dorsi (V-Taper) -->
        <path d="M34 49 C28 57 31 71 38 79 L47 79 L47 59 Z" fill="${cBack}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M66 49 C72 57 69 71 62 79 L53 79 L53 59 Z" fill="${cBack}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <line x1="50" y1="45" x2="50" y2="88" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>

        <!-- Bahu Belakang (Rear Delts) -->
        <path d="M34 42 C27 46 22 52 22 59 C27 63 32 58 34 51 Z" fill="${cShoulders}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M66 42 C73 46 78 52 78 59 C73 63 68 58 66 51 Z" fill="${cShoulders}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>

        <!-- Trisep Lengan Belakang -->
        <path d="M21 59 C17 67 17 77 21 83 L26 81 C26 73 26 65 24 59 Z" fill="${cTriceps}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M79 59 C83 67 83 77 79 83 L74 81 C74 73 74 65 76 59 Z" fill="${cTriceps}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>

        <!-- Lengan Bawah Belakang -->
        <path d="M20 83 C16 91 15 102 18 111 L23 109 C25 101 26 91 26 83 Z" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M80 83 C84 91 85 102 82 111 L77 109 C75 101 74 91 74 83 Z" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <circle cx="19" cy="115" r="3.5" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <circle cx="81" cy="115" r="3.5" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>

        <!-- Bokong Gluteus Maximus Kiri & Kanan -->
        <path d="M36 88 C30 96 32 109 48 109 L48 88 Z" fill="${cGlutes}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M64 88 C70 96 68 109 52 109 L52 88 Z" fill="${cGlutes}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>

        <!-- Paha Belakang Hamstrings (Bersekat Sesuai Tampilan 5) -->
        <path d="M35 111 C30 126 31 145 36 158 C40 160 46 158 47 155 C46 139 46 123 47 111 Z" fill="${cHamstrings}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M65 111 C70 126 69 145 64 158 C60 160 54 158 53 155 C54 139 54 123 53 111 Z" fill="${cHamstrings}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <line x1="41" y1="114" x2="42" y2="152" stroke="${strokeColor}" stroke-width="0.8" opacity="0.6"/>
        <line x1="59" y1="114" x2="58" y2="152" stroke="${strokeColor}" stroke-width="0.8" opacity="0.6"/>

        <!-- Betis Belakang Calves Gastrocnemius Berbentuk Khas -->
        <path d="M36 168 C29 178 30 198 37 208 L45 208 C46 197 46 180 44 168 Z" fill="${cCalves}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M64 168 C71 178 70 198 63 208 L55 208 C54 197 54 180 56 168 Z" fill="${cCalves}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>

        <!-- Tumit Kaki -->
        <path d="M36 209 L46 209 C46 213 42 215 37 214 Z" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <path d="M64 209 L54 209 C54 213 58 215 63 214 Z" fill="#eaedf0" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>

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
