// public/js/svgMuscle.js
// Generator ilustrasi vektor orisinal anatomi tubuh manusia DEPAN dan BELAKANG
// Memiliki garis siluet kulit tubuh luar yang utuh (skin contour outline) dan otot terdefinisi luwes di dalamnya
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

    const skinOutline = '#94a3b8'; // Garis luar siluet kulit
    const skinFill = '#f8fafc'; // Warna dasar kulit manusia
    const mStroke = '#64748b'; // Garis kontur serat otot halus

    // 1. FIGUR TAMPAK DEPAN (DEPAN) - Detail Tinggi Sesuai Tampilan ke-5
    const frontSvg = `
      <g transform="translate(10, 10)">
        <!-- ========================================== -->
        <!-- LAPISAN 1: GARIS KULIT SILUET TUBUH LUAR UTUH -->
        <!-- ========================================== -->
        <!-- Lengan Kiri Luar & Dalam -->
        <path d="M 35 41 C 25 41 18 47 17 56 C 16 67 14 81 14 96 C 14 104 16 112 18 116 C 19 118 22 118 23 116 C 25 111 25 104 25 96 C 26 84 27 74 29 65 C 30 60 32 58 35 56 Z" 
              fill="${skinFill}" stroke="${skinOutline}" stroke-width="1.2" stroke-linejoin="round"/>
        
        <!-- Lengan Kanan Luar & Dalam -->
        <path d="M 65 41 C 75 41 82 47 83 56 C 84 67 86 81 86 96 C 86 104 84 112 82 116 C 81 118 78 118 77 116 C 75 111 75 104 75 96 C 74 84 73 74 71 65 C 70 60 68 58 65 56 Z" 
              fill="${skinFill}" stroke="${skinOutline}" stroke-width="1.2" stroke-linejoin="round"/>

        <!-- Batang Tubuh, Pinggang, Selangkangan, dan Kedua Kaki Luar & Dalam -->
        <path d="M 44 32 L 44 40 C 37 40 33 46 32 58 C 31 70 33 82 31 98 C 29 112 28 132 30 156 C 31 166 31 180 32 196 C 32 204 33 210 29 214 C 28 215 31 216 35 216 C 41 216 43 214 43 208 C 44 196 44 182 44 168 C 45 156 46 140 46 122 C 46 112 47 106 50 102 C 53 106 54 112 54 122 C 54 140 55 156 56 168 C 56 182 56 196 57 208 C 57 214 59 216 65 216 C 69 216 72 215 71 214 C 67 210 68 204 68 196 C 69 180 69 166 70 156 C 72 132 71 112 69 98 C 67 82 69 70 68 58 C 67 46 63 40 56 40 L 56 32 Z" 
              fill="${skinFill}" stroke="${skinOutline}" stroke-width="1.2" stroke-linejoin="round"/>

        <!-- Kepala & Leher -->
        <ellipse cx="50" cy="19" rx="10" ry="12" fill="${skinFill}" stroke="${skinOutline}" stroke-width="1.2"/>
        <line x1="45" y1="31" x2="45" y2="40" stroke="${skinOutline}" stroke-width="1.1"/>
        <line x1="55" y1="31" x2="55" y2="40" stroke="${skinOutline}" stroke-width="1.1"/>

        <!-- ========================================== -->
        <!-- LAPISAN 2: STRUKTUR OTOT ANATOMIS LUWES (DEPAN) -->
        <!-- ========================================== -->
        <!-- Klavikula (Tulang Selangka) -->
        <path d="M 50 41 C 45 40 39 39 34 41 M 50 41 C 55 40 61 39 66 41" stroke="${mStroke}" stroke-width="1.1" stroke-linecap="round" fill="none"/>

        <!-- Bahu Deltoid Kiri & Kanan (Luwes Membungkus Sendi) -->
        <path d="M 34 42 C 26 42 20 47 18 56 C 17 63 22 66 28 66 C 32 64 34 56 35 48 Z" 
              fill="${cShoulders}" stroke="${mStroke}" stroke-width="0.9"/>
        <path d="M 66 42 C 74 42 80 47 82 56 C 83 63 78 66 72 66 C 68 64 66 56 65 48 Z" 
              fill="${cShoulders}" stroke="${mStroke}" stroke-width="0.9"/>

        <!-- Dada Pectoralis Major Kiri & Kanan dengan 3 Garis Serat Melengkung -->
        <path d="M 36 43 C 44 43 49 46 49 55 C 49 63 42 66 35 66 C 29 66 30 53 36 43 Z" 
              fill="${cChest}" stroke="${mStroke}" stroke-width="0.9"/>
        <path d="M 64 43 C 56 43 51 46 51 55 C 51 63 58 66 65 66 C 71 66 70 53 64 43 Z" 
              fill="${cChest}" stroke="${mStroke}" stroke-width="0.9"/>
        <!-- Garis Serat Dada Kiri -->
        <path d="M 37 49 C 41 49 45 50 48 53" stroke="${mStroke}" stroke-width="0.75" fill="none" opacity="0.6"/>
        <path d="M 36 55 C 40 55 44 56 48 58" stroke="${mStroke}" stroke-width="0.75" fill="none" opacity="0.6"/>
        <path d="M 36 61 C 40 61 43 62 46 64" stroke="${mStroke}" stroke-width="0.75" fill="none" opacity="0.6"/>
        <!-- Garis Serat Dada Kanan -->
        <path d="M 63 49 C 59 49 55 50 52 53" stroke="${mStroke}" stroke-width="0.75" fill="none" opacity="0.6"/>
        <path d="M 64 55 C 60 55 56 56 52 58" stroke="${mStroke}" stroke-width="0.75" fill="none" opacity="0.6"/>
        <path d="M 64 61 C 60 61 57 62 54 64" stroke="${mStroke}" stroke-width="0.75" fill="none" opacity="0.6"/>

        <!-- Lengan Bisep & Lengan Bawah -->
        <path d="M 20 59 C 16 65 15 75 19 82 C 22 83 26 81 27 77 C 28 69 27 61 23 58 Z" 
              fill="${cBiceps}" stroke="${mStroke}" stroke-width="0.9"/>
        <path d="M 80 59 C 84 65 85 75 81 82 C 78 83 74 81 73 77 C 72 69 73 61 77 58 Z" 
              fill="${cBiceps}" stroke="${mStroke}" stroke-width="0.9"/>
        <line x1="20" y1="84" x2="23" y2="108" stroke="${mStroke}" stroke-width="0.7" opacity="0.5"/>
        <line x1="80" y1="84" x2="77" y2="108" stroke="${mStroke}" stroke-width="0.7" opacity="0.5"/>

        <!-- Serratus Anterior (Gerigi Samping Rusuk Sesuai Tampilan 5) -->
        <path d="M 32 63 C 35 63 37 65 39 67 M 32 68 C 35 68 37 70 39 72 M 32 73 C 35 73 37 75 39 77" 
              stroke="${mStroke}" stroke-width="0.8" fill="none"/>
        <path d="M 68 63 C 65 63 63 65 61 67 M 68 68 C 65 68 63 70 61 72 M 68 73 C 65 73 63 75 61 77" 
              stroke="${mStroke}" stroke-width="0.8" fill="none"/>

        <!-- Obliques & V-Line Menuju Selangkangan -->
        <path d="M 32 78 C 34 88 36 94 40 98" stroke="${mStroke}" stroke-width="0.8" fill="none"/>
        <path d="M 68 78 C 66 88 64 94 60 98" stroke="${mStroke}" stroke-width="0.8" fill="none"/>
        <path d="M 40 98 C 45 101 48 102 50 102 C 52 102 55 101 60 98" stroke="${mStroke}" stroke-width="0.9" fill="none"/>

        <!-- Six-Pack Abs (Rectus Abdominis Bersekat Alami) -->
        <path d="M 42 67 C 46 67 49 67 49 67 L 49 76 C 45 76 43 76 42 75 Z" fill="${cAbs}" stroke="${mStroke}" stroke-width="0.8"/>
        <path d="M 58 67 C 54 67 51 67 51 67 L 51 76 C 55 76 57 76 58 75 Z" fill="${cAbs}" stroke="${mStroke}" stroke-width="0.8"/>
        <path d="M 43 78 C 46 78 49 78 49 78 L 49 87 C 45 87 43 86 43 85 Z" fill="${cAbs}" stroke="${mStroke}" stroke-width="0.8"/>
        <path d="M 57 78 C 54 78 51 78 51 78 L 51 87 C 55 87 57 86 57 85 Z" fill="${cAbs}" stroke="${mStroke}" stroke-width="0.8"/>
        <path d="M 43 89 C 46 89 49 89 49 89 L 48 98 C 45 98 44 97 43 96 Z" fill="${cAbs}" stroke="${mStroke}" stroke-width="0.8"/>
        <path d="M 57 89 C 54 89 51 89 51 89 L 52 98 C 55 98 56 97 57 96 Z" fill="${cAbs}" stroke="${mStroke}" stroke-width="0.8"/>

        <!-- Paha Depan Quadriceps 3 Bagian (Vastus Lateralis, Rectus Femoris, Vastus Medialis) -->
        <!-- Kaki Kiri -->
        <path d="M 36 103 C 30 118 30 138 34 154 C 37 155 40 152 40 144 C 38 132 38 116 39 104 Z" 
              fill="${cQuads}" stroke="${mStroke}" stroke-width="0.8"/>
        <path d="M 39 104 C 38 116 38 132 40 144 C 42 144 43 144 44 142 C 43 130 42 116 41 104 Z" 
              fill="${cQuads}" stroke="${mStroke}" stroke-width="0.8"/>
        <path d="M 41 104 C 42 116 43 130 44 142 C 45 146 47 150 47 152 C 48 135 47 116 45 103 Z" 
              fill="${cQuads}" stroke="${mStroke}" stroke-width="0.8"/>
        <!-- Kaki Kanan -->
        <path d="M 64 103 C 70 118 70 138 66 154 C 63 155 60 152 60 144 C 62 132 62 116 61 104 Z" 
              fill="${cQuads}" stroke="${mStroke}" stroke-width="0.8"/>
        <path d="M 61 104 C 62 116 62 132 60 144 C 58 144 57 144 56 142 C 57 130 58 116 59 104 Z" 
              fill="${cQuads}" stroke="${mStroke}" stroke-width="0.8"/>
        <path d="M 59 104 C 58 116 57 130 56 142 C 55 146 53 150 53 152 C 52 135 53 116 55 103 Z" 
              fill="${cQuads}" stroke="${mStroke}" stroke-width="0.8"/>

        <!-- Tempurung Lutut (Patella) -->
        <ellipse cx="41" cy="159" rx="3.5" ry="3.8" fill="${skinFill}" stroke="${mStroke}" stroke-width="0.9"/>
        <ellipse cx="59" cy="159" rx="3.5" ry="3.8" fill="${skinFill}" stroke="${mStroke}" stroke-width="0.9"/>

        <!-- Betis Depan & Tulang Kering -->
        <path d="M 37 165 C 32 176 33 194 37 205 L 43 205 C 44 195 44 178 42 165 Z" 
              fill="${cCalves}" stroke="${mStroke}" stroke-width="0.8"/>
        <path d="M 63 165 C 68 176 67 194 63 205 L 57 205 C 56 195 56 178 58 165 Z" 
              fill="${cCalves}" stroke="${mStroke}" stroke-width="0.8"/>
        <line x1="41" y1="164" x2="41" y2="204" stroke="${mStroke}" stroke-width="0.75" opacity="0.6"/>
        <line x1="59" y1="164" x2="59" y2="204" stroke="${mStroke}" stroke-width="0.75" opacity="0.6"/>

        <!-- Label Teks DEPAN Sesuai Tampilan 5 -->
        <text x="50" y="235" font-size="9.5" fill="#64748b" font-weight="600" text-anchor="middle" letter-spacing="1">DEPAN</text>
      </g>
    `;

    // 2. FIGUR TAMPAK BELAKANG (BELAKANG) - Detail Tinggi Sesuai Tampilan ke-5
    const backSvg = `
      <g transform="translate(130, 10)">
        <!-- ========================================== -->
        <!-- LAPISAN 1: GARIS KULIT SILUET TUBUH LUAR UTUH -->
        <!-- ========================================== -->
        <!-- Lengan Kiri Luar & Dalam -->
        <path d="M 35 41 C 25 41 18 47 17 56 C 16 67 14 81 14 96 C 14 104 16 112 18 116 C 19 118 22 118 23 116 C 25 111 25 104 25 96 C 26 84 27 74 29 65 C 30 60 32 58 35 56 Z" 
              fill="${skinFill}" stroke="${skinOutline}" stroke-width="1.2" stroke-linejoin="round"/>
        
        <!-- Lengan Kanan Luar & Dalam -->
        <path d="M 65 41 C 75 41 82 47 83 56 C 84 67 86 81 86 96 C 86 104 84 112 82 116 C 81 118 78 118 77 116 C 75 111 75 104 75 96 C 74 84 73 74 71 65 C 70 60 68 58 65 56 Z" 
              fill="${skinFill}" stroke="${skinOutline}" stroke-width="1.2" stroke-linejoin="round"/>

        <!-- Batang Tubuh, Bokong, dan Kaki Belakang -->
        <path d="M 44 32 L 44 40 C 37 40 33 46 32 58 C 31 70 33 82 31 98 C 29 112 28 132 30 156 C 31 166 31 180 32 196 C 32 204 33 210 29 214 C 28 215 31 216 35 216 C 41 216 43 214 43 208 C 44 196 44 182 44 168 C 45 156 46 140 46 122 C 46 112 47 106 50 102 C 53 106 54 112 54 122 C 54 140 55 156 56 168 C 56 182 56 196 57 208 C 57 214 59 216 65 216 C 69 216 72 215 71 214 C 67 210 68 204 68 196 C 69 180 69 166 70 156 C 72 132 71 112 69 98 C 67 82 69 70 68 58 C 67 46 63 40 56 40 L 56 32 Z" 
              fill="${skinFill}" stroke="${skinOutline}" stroke-width="1.2" stroke-linejoin="round"/>

        <!-- Kepala Belakang & Leher -->
        <ellipse cx="50" cy="19" rx="10" ry="12" fill="${skinFill}" stroke="${skinOutline}" stroke-width="1.2"/>
        <line x1="45" y1="31" x2="45" y2="40" stroke="${skinOutline}" stroke-width="1.1"/>
        <line x1="55" y1="31" x2="55" y2="40" stroke="${skinOutline}" stroke-width="1.1"/>

        <!-- ========================================== -->
        <!-- LAPISAN 2: STRUKTUR OTOT ANATOMIS LUWES (BELAKANG) -->
        <!-- ========================================== -->
        <!-- Trapezius Intan (Diamond Shape Sesuai Tampilan 5) -->
        <path d="M 50 28 L 44 38 L 34 42 C 42 45 47 50 48 60 L 50 68 L 52 60 C 53 50 58 45 66 42 L 56 38 Z" 
              fill="${cTraps}" stroke="${mStroke}" stroke-width="0.9"/>

        <!-- Sayap Punggung Latissimus Dorsi (Luwes V-Taper) -->
        <path d="M 33 48 C 27 56 30 70 37 78 L 47 78 L 48 60 C 47 50 42 45 34 42 Z" 
              fill="${cBack}" stroke="${mStroke}" stroke-width="0.9"/>
        <path d="M 67 48 C 73 56 70 70 63 78 L 53 78 L 52 60 C 53 50 58 45 66 42 Z" 
              fill="${cBack}" stroke="${mStroke}" stroke-width="0.9"/>
        <!-- Garis Tulang Belakang (Spine Line) -->
        <line x1="50" y1="28" x2="50" y2="86" stroke="${mStroke}" stroke-width="0.9" stroke-dasharray="2.5 2" opacity="0.6"/>

        <!-- Bahu Belakang (Rear Delts) -->
        <path d="M 34 42 C 27 46 22 52 22 59 C 27 63 32 58 34 51 Z" 
              fill="${cShoulders}" stroke="${mStroke}" stroke-width="0.9"/>
        <path d="M 66 42 C 73 46 78 52 78 59 C 73 63 68 58 66 51 Z" 
              fill="${cShoulders}" stroke="${mStroke}" stroke-width="0.9"/>

        <!-- Trisep Lengan Belakang (Tapak Kuda / Horseshoe Sesuai Mockup 5) -->
        <path d="M 21 58 C 17 66 17 76 21 82 L 26 80 C 26 72 26 64 24 58 Z" 
              fill="${cTriceps}" stroke="${mStroke}" stroke-width="0.9"/>
        <path d="M 79 58 C 83 66 83 76 79 82 L 74 80 C 74 72 74 64 76 58 Z" 
              fill="${cTriceps}" stroke="${mStroke}" stroke-width="0.9"/>
        <ellipse cx="23.5" cy="74" rx="1.5" ry="4" fill="${skinFill}" stroke="${mStroke}" stroke-width="0.6"/>
        <ellipse cx="76.5" cy="74" rx="1.5" ry="4" fill="${skinFill}" stroke="${mStroke}" stroke-width="0.6"/>

        <!-- Bokong Gluteus Maximus (Bulat Padat Simetris Sesuai Tampilan 5) -->
        <path d="M 34 86 C 28 94 30 108 47 108 L 49 86 C 44 85 39 85 34 86 Z" 
              fill="${cGlutes}" stroke="${mStroke}" stroke-width="0.9"/>
        <path d="M 66 86 C 72 94 70 108 53 108 L 51 86 C 56 85 61 85 66 86 Z" 
              fill="${cGlutes}" stroke="${mStroke}" stroke-width="0.9"/>

        <!-- Paha Belakang Hamstrings (Terbagi 2 Pilar Otot Sesuai Mockup 5) -->
        <!-- Kaki Kiri -->
        <path d="M 35 110 C 30 125 31 144 36 156 C 39 157 41 155 41 144 C 40 130 39 116 38 110 Z" 
              fill="${cHamstrings}" stroke="${mStroke}" stroke-width="0.8"/>
        <path d="M 38 110 C 39 116 40 130 41 144 C 42 153 45 156 46 154 C 46 138 46 122 47 110 Z" 
              fill="${cHamstrings}" stroke="${mStroke}" stroke-width="0.8"/>
        <!-- Kaki Kanan -->
        <path d="M 65 110 C 70 125 69 144 64 156 C 61 157 59 155 59 144 C 60 130 61 116 62 110 Z" 
              fill="${cHamstrings}" stroke="${mStroke}" stroke-width="0.8"/>
        <path d="M 62 110 C 61 116 60 130 59 144 C 58 153 55 156 54 154 C 54 138 54 122 53 110 Z" 
              fill="${cHamstrings}" stroke="${mStroke}" stroke-width="0.8"/>

        <!-- Betis Belakang Calves Gastrocnemius (Kepala Kembar Menyempit ke Achilles) -->
        <path d="M 36 166 C 28 176 29 194 36 205 L 43 205 C 45 195 44 178 42 166 C 40 168 38 167 36 166 Z" 
              fill="${cCalves}" stroke="${mStroke}" stroke-width="0.8"/>
        <path d="M 64 166 C 72 176 71 194 64 205 L 57 205 C 55 195 56 178 58 166 C 60 168 62 167 64 166 Z" 
              fill="${cCalves}" stroke="${mStroke}" stroke-width="0.8"/>
        <line x1="39" y1="168" x2="39" y2="198" stroke="${mStroke}" stroke-width="0.75" opacity="0.6"/>
        <line x1="61" y1="168" x2="61" y2="198" stroke="${mStroke}" stroke-width="0.75" opacity="0.6"/>

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
