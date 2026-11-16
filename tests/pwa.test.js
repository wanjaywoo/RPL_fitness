// tests/pwa.test.js
// Pengujian berkas PWA, Manifest, Service Worker, dan SVG Muscle Renderer (NFR-07)

const fs = require('fs');
const path = require('path');
const SvgMuscleRenderer = require('../public/js/svgMuscle');

describe('PWA & Antarmuka Statis (NFR-07)', () => {
  // 1. Verifikasi index.html
  test('index.html memuat tag meta PWA, manifest, dan CSS', () => {
    const indexPath = path.join(__dirname, '../public/index.html');
    expect(fs.existsSync(indexPath)).toBe(true);
    const html = fs.readFileSync(indexPath, 'utf8');

    expect(html).toContain('manifest.json');
    expect(html).toContain('theme-color');
    expect(html).toContain('viewport');
    expect(html).toContain('FitStreak');
  });

  // 2. Verifikasi manifest.json
  test('manifest.json adalah JSON yang valid dan memiliki konfigurasi PWA lengkap', () => {
    const manifestPath = path.join(__dirname, '../public/manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);
    const content = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(content);

    expect(manifest.name).toContain('FitStreak');
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toBe('#165b39');
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  // 3. Verifikasi sw.js
  test('sw.js memiliki logika caching offline aset statis', () => {
    const swPath = path.join(__dirname, '../public/sw.js');
    expect(fs.existsSync(swPath)).toBe(true);
    const swCode = fs.readFileSync(swPath, 'utf8');

    expect(swCode).toContain('caches.open');
    expect(swCode).toContain('install');
    expect(swCode).toContain('fetch');
  });

  // 4. Verifikasi SvgMuscleRenderer
  test('SvgMuscleRenderer menghasilkan diagram SVG dengan highlight warna yang tepat', () => {
    const svgOutput = SvgMuscleRenderer.renderBodyDiagram({
      primaryMuscles: ['Dada'],
      secondaryMuscles: ['Bahu', 'Trisep'],
      width: 280,
      height: 290
    });

    // Otot utama (Dada) harus diberi warna oranye (#ea580c)
    expect(svgOutput).toContain('#ea580c');
    // Otot pendukung (Bahu/Trisep) harus diberi warna peach (#fed7aa)
    expect(svgOutput).toContain('#fed7aa');
    // Harus ada teks DEPAN dan BELAKANG
    expect(svgOutput).toContain('DEPAN');
    expect(svgOutput).toContain('BELAKANG');
  });
});
