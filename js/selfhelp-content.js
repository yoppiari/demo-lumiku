// ==========================================================================
// SELF-HELP MENTAL HEALTH - Complete Reading Materials & Curriculum
// Ruang Tumbuh Remaja - Workbook Kesehatan Mental (Format Terpadu Neo-Memphis)
// ==========================================================================

const SELFHELP_CHAPTERS = [
  {
    id: 1,
    title: "Tentang Workbook & Cara Bermain",
    category: "PENGENALAN",
    icon: "✨",
    est: "2 mnt baca",
    hook: "Sahabat latihan mandiri mengenali diri, meredakan overthinking, dan ruang privat bebas penilaian.",
    html: `
      <div class="m-img-wrap">
        <img src="assets/mental-health-hero.jpg" alt="Ruang Belajar Ramah Jiwa" class="m-content-img">
        <div class="m-img-caption">✨ Ruang Belajar Ramah Jiwa: Kenali emosi, pulihkan energi, dan rawat kesehatan mentalmu!</div>
      </div>

      <p class="m-read-lead">
        Halo kawan muda! Selamat datang di <b>Workbook Kesehatan Mental Remaja</b>. Aplikasi interaktif ini dirancang khusus untuk membantumu mengenali diri sendiri, mengelola emosi yang meluap, meredakan overthinking, dan membangun kebiasaan hidup yang lebih tenang dan bahagia.
      </p>
      
      <div class="m-callout m-callout-yellow">
        <div class="m-callout-title">⚡ Ruang Bebas Penilaian (No Judgment)</div>
        <div class="m-callout-body">
          Tidak ada jawaban salah, tidak ada nilai raport, dan tidak ada yang mengawasimu di sini. Semua isian tersimpan aman dan privat di perangkatmu sendiri!
        </div>
      </div>

      <h3 class="m-read-h3">🎯 3 Aturan Main Sederhana:</h3>
      <div class="m-step-list">
        <div class="m-step-item">
          <div class="m-step-badge">1</div>
          <div class="m-step-content">
            <div class="m-step-title">Jujur pada Diri Sendiri</div>
            <div class="m-step-desc">Tulis apa yang benar-benar kamu rasakan tanpa harus berpura-pura selalu kuat atau selalu bahagia.</div>
          </div>
        </div>
        <div class="m-step-item">
          <div class="m-step-badge">2</div>
          <div class="m-step-content">
            <div class="m-step-title">Baca &amp; Isi Bertahap</div>
            <div class="m-step-desc">Kamu tidak perlu menyelesaikan semuanya sekaligus. Buka saat butuh jeda, saat cemas, atau saat ingin curhat.</div>
          </div>
        </div>
        <div class="m-step-item">
          <div class="m-step-badge">3</div>
          <div class="m-step-content">
            <div class="m-step-title">Alat Bantu Refleksi Mandiri</div>
            <div class="m-step-desc">Bila beban mental terasa terlalu berat atau berbahaya, jangan ragu berbicara pada orang dewasa tepercaya atau psikolog profesional.</div>
          </div>
        </div>
      </div>

      <div class="m-callout m-callout-pink">
        <div class="m-callout-title">💛 Pengingat Penting</div>
        <div class="m-callout-body">
          Menjaga pikiran sama pentingnya dengan menjaga tubuh jasmani. Kalau kamu lelah secara mental, istirahatlah sejenak—kamu berhak pulih dan bertumbuh!
        </div>
      </div>

      <div class="m-takeaway-box">
        <div class="m-takeaway-title">💡 Ruang Aman &amp; Pulih Bersama</div>
        <div style="font-size: 12px; color: #1E3A8A; line-height: 1.55;">
          Perjalanan kesehatan mental adalah maraton kebaikan untuk diri sendiri. Ambil waktu yang kamu butuhkan, langkah kecilmu hari ini sangat berharga.
        </div>
      </div>
      
      <div class="m-source-box">
        <b>📚 Sumber Materi:</b> Modul Kesehatan Jiwa &amp; Resiliensi Remaja, Direktorat Kesehatan Jiwa Kemenkes RI; WHO Adolescent Mental Health Framework.
      </div>
    `
  },
  {
    id: 2,
    title: "Mengenal Kesehatan Mental: Fakta & Mitos",
    category: "DASAR MENTAL",
    icon: "🧠",
    est: "3 mnt baca",
    hook: "Memahami fakta sehat jiwa: normal merasa tidak baik-baik saja dan tanda kapan perlu mencari bantuan.",
    html: `
      <div class="m-img-wrap">
        <img src="assets/mental-facts-myths.jpg" alt="Fakta vs Mitos Kesehatan Mental: Bebas Stigma" class="m-content-img">
        <div class="m-img-caption">🌱 Bebas Stigma: Fakta sehat jiwa itu manusiawi—normal merasa tidak baik-baik saja!</div>
      </div>

      <p class="m-read-lead">
        Banyak orang mengira punya "mental yang sehat" berarti harus selalu tersenyum, ceria 24 jam non-stop, dan tidak boleh sedih atau marah sama sekali. Itu <b>mitos besar</b>!
      </p>
      
      <h3 class="m-read-h3">💡 Fakta Sebenarnya:</h3>
      <p class="m-read-p">
        Kesehatan mental adalah kemampuan kita untuk mengenali emosi, menghadapi tekanan hidup sehari-hari, belajar secara produktif, dan menjalin hubungan yang sehat dan saling menghormati dengan orang di sekitar kita.
      </p>

      <div class="m-callout m-callout-mint">
        <div class="m-callout-title">🌱 Normal Merasa Tidak Baik-Baik Saja</div>
        <div class="m-callout-body">
          Merasa kecewa saat gagal ujian, menangis saat kehilangan sesuatu, atau cemas sebelum presentasi adalah reaksi biologis yang wajar. Yang penting adalah bagaimana kita merespons dan memulihkannya!
        </div>
      </div>

      <h3 class="m-read-h3">🚨 Kapan Kamu Perlu Mencari Bantuan Profesional?</h3>
      <div class="m-step-list">
        <div class="m-step-item">
          <div class="m-step-badge">1</div>
          <div class="m-step-content">
            <div class="m-step-title">Durasi Berkepanjangan</div>
            <div class="m-step-desc">Rasa sedih, cemas luar biasa, atau kehampaan berlangsung terus-menerus lebih dari 2 minggu berturut-turut.</div>
          </div>
        </div>
        <div class="m-step-item">
          <div class="m-step-badge">2</div>
          <div class="m-step-content">
            <div class="m-step-title">Kehilangan Minat Total</div>
            <div class="m-step-desc">Tidak lagi menikmati hobi atau aktivitas yang biasanya membuatmu sangat bersemangat.</div>
          </div>
        </div>
        <div class="m-step-item">
          <div class="m-step-badge">3</div>
          <div class="m-step-content">
            <div class="m-step-title">Perubahan Pola Biologis</div>
            <div class="m-step-desc">Pola tidur dan pola makan berubah drastis (insomnia parah atau tidur berlebihan, nafsu makan hilang total).</div>
          </div>
        </div>
        <div class="m-step-item">
          <div class="m-step-badge">4</div>
          <div class="m-step-content">
            <div class="m-step-title">Isolasi &amp; Pikiran Berbahaya</div>
            <div class="m-step-desc">Menarik diri sepenuhnya dari circle pertemanan, atau muncul dorongan melukai diri sendiri (segera hubungi Hotline 119 ext 8).</div>
          </div>
        </div>
      </div>

      <div class="m-takeaway-box">
        <div class="m-takeaway-title">💡 Minta Bantuan Adalah Tanda Keberanian</div>
        <div style="font-size: 12px; color: #1E3A8A; line-height: 1.55;">
          Pergi ke psikolog atau konselor bukan berarti kamu "lemah" atau "aneh". Sama seperti pergi ke dokter saat patah tulang, merawat jiwa adalah wujud cinta paling nyata pada masa depanmu.
        </div>
      </div>

      <div class="m-source-box">
        <b>📚 Sumber Rujukan:</b> Panduan Sehat Jiwa Remaja, Direktorat Kesehatan Jiwa Kemenkes RI (2023); ICD-11 Mental &amp; Behavioural Disorders Guidelines.
      </div>
    `
  },
  {
    id: 3,
    title: "Pikiranmu Seperti Baterai HP",
    category: "ENERGI & PIKIRAN",
    icon: "🔋",
    est: "3 mnt baca",
    hook: "Kenali baterai energi mentalmu: apa yang menguras daya dan cara efektif mengisi ulang tenaga.",
    html: `
      <div class="m-img-wrap">
        <img src="assets/mental-battery.jpg" alt="Mental Recharge dan Baterai Pikiran" class="m-content-img">
        <div class="m-img-caption">🔋 Mental Recharge: Kenali penguras daya bateraimu dan temukan charger emosi terbaikmu!</div>
      </div>

      <p class="m-read-lead">
        Bayangkan pikiran dan energimu seperti baterai smartphone. Kalau kamu membuka puluhan aplikasi berat bersamaan (game online, doomscrolling medsos, tugas menumpuk), layar menyala terus, dan tidak pernah dicolok ke charger, apa yang terjadi?
      </p>
      
      <p class="m-read-p">
        HP bakal panas, lag, lemot, dan akhirnya <i>battery low</i> atau mati mendadak! Begitu juga dengan otak dan tubuhmu saat dipaksa terus berjalan tanpa jeda istirahat.
      </p>

      <div class="m-stat-grid">
        <div class="m-stat-card" style="text-align: left; border-left: 4px solid var(--hot-pink);">
          <div style="font-size: 22px; margin-bottom: 4px;">🪫</div>
          <div class="m-stat-lbl">Penyerap Daya (Drainers)</div>
          <div class="m-stat-sub">Kurang tidur, memikirkan cibiran orang lain, konflik pertemanan, menuntut diri selalu sempurna, dan telat makan.</div>
        </div>
        <div class="m-stat-card" style="text-align: left; border-left: 4px solid var(--mint-green);">
          <div style="font-size: 22px; margin-bottom: 4px;">⚡</div>
          <div class="m-stat-lbl">Pengisi Daya (Chargers)</div>
          <div class="m-stat-sub">Tidur 7–8 jam, curhat ke sahabat suportif, menggambar, jalan sore tanpa HP, mendengarkan musik santai, dan minum air cukup.</div>
        </div>
      </div>

      <div class="m-callout m-callout-yellow">
        <div class="m-callout-title">⚡ Aturan Emas 20% Battery Level</div>
        <div class="m-callout-body">
          Jangan tunggu bateraimu sampai 0% (burnout total)! Begitu kamu merasa mudah tersinggung, sakit kepala, atau kehilangan konsentrasi, itu tanda bateraimu sudah di bawah 20%. Ambil waktu jeda minimal 15 menit.
        </div>
      </div>

      <div class="m-takeaway-box">
        <div class="m-takeaway-title">💡 Istirahat Bukan Membuang Waktu</div>
        <div style="font-size: 12px; color: #1E3A8A; line-height: 1.55;">
          Kamu tidak perlu membuktikan produktivitasmu setiap detik. Istirahat yang berkualitas adalah bahan bakar utama untuk kembali berkarya dengan hati gembira.
        </div>
      </div>

      <div class="m-source-box">
        <b>📚 Rujukan Edukasi:</b> American Psychological Association (APA) - Stress in America &amp; Youth Resilience Guidelines.
      </div>
    `
  },
  {
    id: 4,
    title: "Emosi Bukanlah Musuh: Membaca Sinyal Rasa",
    category: "EMOSI",
    icon: "🚨",
    est: "3 mnt baca",
    hook: "Emosi adalah lampu indikator dasbor yang memberi sinyal. Pelajari 3 langkah berteman dengan emosi.",
    html: `
      <div class="m-img-wrap">
        <img src="assets/mental-emotions.jpg" alt="Dasbor Kenali Sinyal Rasa" class="m-content-img">
        <div class="m-img-caption">🚨 Dasbor Sinyal Emosi: Emosi bukan musuh, melainkan kawan yang membunyikan alarm kebutuhanmu.</div>
      </div>

      <p class="m-read-lead">
        Di masyarakat sering beredar anggapan keliru: <i>"Jangan cengeng!", "Laki-laki nggak boleh nangis!", "Marah itu dosa!"</i>. Akibatnya, banyak remaja terbiasa menelan dan memendam emosi mereka sampai membeku atau meledak di kemudian hari.
      </p>
      
      <h3 class="m-read-h3">🎯 Emosi Adalah Lampu Indikator Dasbor</h3>
      <p class="m-read-p">
        Bayangkan dasbor sepeda motor. Saat lampu bensin menyala merah, kamu tidak akan memukul lampu itu kan? Lampu itu hanya memberi tahu bahwa bensinmu mau habis dan butuh diisi.
      </p>

      <div class="m-step-list">
        <div class="m-step-item">
          <div class="m-step-badge">🔥</div>
          <div class="m-step-content">
            <div class="m-step-title">Marah (Anger)</div>
            <div class="m-step-desc">Memberi sinyal bahwa batasan pribadimu telah dilanggar atau ada ketidakadilan yang perlu diperbaiki secara asertif.</div>
          </div>
        </div>
        <div class="m-step-item">
          <div class="m-step-badge">🌧️</div>
          <div class="m-step-content">
            <div class="m-step-title">Sedih (Sadness)</div>
            <div class="m-step-desc">Memberi sinyal bahwa ada hal bermakna yang hilang atau terluka, dan jiwamu butuh waktu serta kehangatan untuk pulih.</div>
          </div>
        </div>
        <div class="m-step-item">
          <div class="m-step-badge">⚡</div>
          <div class="m-step-content">
            <div class="m-step-title">Cemas / Takut (Anxiety)</div>
            <div class="m-step-desc">Memberi sinyal bahwa otakmu mendeteksi potensi bahaya dan bersiap melindungi dirimu.</div>
          </div>
        </div>
      </div>

      <div class="m-callout m-callout-lavender">
        <div class="m-callout-title">🌈 3 Langkah Berteman dengan Rasa</div>
        <div class="m-callout-body">
          1. <b>Namai emosinya:</b> <i>"Aku sedang merasa kesal dan kecewa."</i><br>
          2. <b>Validasi perasaan:</b> <i>"Wajar aku merasa begini setelah apa yang terjadi tadi."</i><br>
          3. <b>Pilih respon sehat:</b> <i>"Aku akan tarik napas dulu sebelum membalas chatnya."</i>
        </div>
      </div>

      <div class="m-takeaway-box">
        <div class="m-takeaway-title">💡 Rasakan Tanpa Menghakimi</div>
        <div style="font-size: 12px; color: #1E3A8A; line-height: 1.55;">
          Semua perasaanmu valid. Jangan menghukum dirimu hanya karena kamu merasakan sesuatu. Buka Tab <b>🤝 Jurnal</b> untuk menuangkan emosimu hari ini!
        </div>
      </div>

      <div class="m-source-box">
        <b>📚 Rujukan:</b> Emotion Regulation Therapy &amp; Cognitive Behavioral Workbook for Adolescents (Linehan &amp; Beck Institute).
      </div>
    `
  },
  {
    id: 5,
    title: "Stop Overthinking: Mematahkan Pikiran Negatif",
    category: "OVERTHINKING",
    icon: "🌪️",
    est: "4 mnt baca",
    hook: "Senjata ampuh metode S-T-O-P dan latihan grounding 5-4-3-2-1 untuk mematahkan jebakan pikiran cemas.",
    html: `
      <div class="m-img-wrap">
        <img src="assets/mental-grounding.jpg" alt="Stop Overthinking dan Grounding 5-4-3-2-1" class="m-content-img">
        <div class="m-img-caption">🌪️ Stop &amp; Breathe: Hentikan badai pikiran dengan grounding 5 indra dan formula S-T-O-P.</div>
      </div>

      <p class="m-read-lead">
        Pernahkah kamu mengirim pesan teks, lalu temanmu hanya me-read tanpa membalas, dan otakmu langsung membuat cerita horor: <i>"Pasti dia benci aku, pasti aku bikin salah fatal, pasti aku bakal dimusuhi satu sekolah!"</i>?
      </p>
      
      <p class="m-read-p">
        Itulah yang disebut <b>Cognitive Distortion</b> (Distorsi Kognitif) atau jebakan overthinking. Otak manusia memang berevolusi untuk selalu waspada terhadap bahaya, tapi sering kali ia melebih-lebihkan ancaman yang belum tentu nyata.
      </p>

      <div class="m-callout m-callout-yellow">
        <div class="m-callout-title">🛑 Senjata Ampuh: Formula S-T-O-P</div>
        <div class="m-callout-body">
          • <b>S (STOP):</b> Berhenti sejenak dari apa pun yang sedang kamu lakukan atau ketik.<br>
          • <b>T (TAKE A BREATH):</b> Tarik napas perlahan lewat hidung 4 detik, hembuskan lembut lewat mulut 6 detik.<br>
          • <b>O (OBSERVE):</b> Amati: <i>"Apa pikiran yang muncul? Apakah ini fakta nyata atau cuma asumsi cemas?"</i><br>
          • <b>P (PROCEED):</b> Ambil satu tindakan nyata yang realistis, terukur, dan menenangkan.
        </div>
      </div>

      <h3 class="m-read-h3">🌿 Teknik Grounding 5-4-3-2-1 (Jangkar Panca Indra):</h3>
      <div class="m-step-list">
        <div class="m-step-item">
          <div class="m-step-badge">5</div>
          <div class="m-step-content">
            <div class="m-step-title">Lihat 5 Benda</div>
            <div class="m-step-desc">Sebutkan 5 hal yang bisa kamu lihat di ruangan (pintu, jam, buku, tanaman, sepatu).</div>
          </div>
        </div>
        <div class="m-step-item">
          <div class="m-step-badge">4</div>
          <div class="m-step-content">
            <div class="m-step-title">Sentuh 4 Tekstur</div>
            <div class="m-step-desc">Raba 4 benda di sekitarmu (kain baju, permukaan meja dingin, casing HP, lantai).</div>
          </div>
        </div>
        <div class="m-step-item">
          <div class="m-step-badge">3</div>
          <div class="m-step-content">
            <div class="m-step-title">Dengar 3 Suara</div>
            <div class="m-step-desc">Fokus dengarkan 3 suara (angin kipas, deru kendaraan jauh, detak jam dinding).</div>
          </div>
        </div>
        <div class="m-step-item">
          <div class="m-step-badge">2</div>
          <div class="m-step-content">
            <div class="m-step-title">Cium 2 Aroma</div>
            <div class="m-step-desc">Hirup udara sekitar (aroma sabun tangan, segarnya udara, wangi teh/kopi).</div>
          </div>
        </div>
        <div class="m-step-item">
          <div class="m-step-badge">1</div>
          <div class="m-step-content">
            <div class="m-step-title">Rasakan 1 Rasa di Lidah</div>
            <div class="m-step-desc">Teguk air putih segar atau rasakan sensasi di rongga mulutmu saat ini.</div>
          </div>
        </div>
      </div>

      <div class="m-takeaway-box">
        <div class="m-takeaway-title">💡 Pikiranmu Bukanlah Takdirmu</div>
        <div style="font-size: 12px; color: #1E3A8A; line-height: 1.55;">
          Kamu memiliki pikiran, tetapi kamu bukanlah pikiran negatifmu. Saat badai kecemasan datang, turunkan jangkar ke saat ini dengan panca indramu!
        </div>
      </div>

      <div class="m-source-box">
        <b>📚 Rujukan:</b> CBT Self-Help Toolkit for Youth; Mindfulness-Based Stress Reduction (MBSR) Practice Guidelines.
      </div>
    `
  },
  {
    id: 6,
    title: "Bicara Lembut pada Diri Sendiri (Self-Compassion)",
    category: "SELF-LOVE",
    icon: "💖",
    est: "3 mnt baca",
    hook: "Berhenti menghukum diri sendiri! Pelajari 3 pilar self-compassion dan ubah kritik dalam kepalamu.",
    html: `
      <div class="m-img-wrap">
        <img src="assets/mental-self-compassion.jpg" alt="Self-Compassion dan Sayangi Dirimu" class="m-content-img">
        <div class="m-img-caption">💖 Self-Compassion: Kamu berharga! Perlakukan dirimu sehangat kamu menyayangi sahabat terbaikmu.</div>
      </div>

      <p class="m-read-lead">
        Coba perhatikan suara di dalam kepalamu saat kamu membuat kesalahan kecil—misalnya tidak sengaja menjatuhkan barang atau salah menjawab kuis di depan kelas. Apakah suara itu berkata: <i>"Bodoh banget sih kamu!", "Gitu aja nggak becus!"</i>?
      </p>
      
      <p class="m-read-p">
        Banyak dari kita jauh lebih kejam pada diri sendiri daripada kepada musuh terburuk sekalipun. Padahal, kritik dan makian internal yang terus-menerus justru melumpuhkan rasa percaya diri dan memicu depresi.
      </p>

      <div class="m-callout m-callout-mint">
        <div class="m-callout-title">🌸 Reframing Suara Diri (Self-Talk Shift)</div>
        <div class="m-callout-body">
          • <b>Suara Kejam:</b> <i>"Aku selalu merusak segalanya dan gagal total."</i><br>
          ➔ <b>Suara Sahabat:</b> <i>"Hari ini memang sulit dan tidak sesuai rencana, tapi aku sudah berusaha sekuat tenaga. Besok aku bisa coba lagi dengan strategi baru."</i>
        </div>
      </div>

      <h3 class="m-read-h3">✨ 3 Komponen Self-Compassion (Dr. Kristin Neff):</h3>
      <div class="m-step-list">
        <div class="m-step-item">
          <div class="m-step-badge">1</div>
          <div class="m-step-content">
            <div class="m-step-title">Self-Kindness (Kebaikan Diri)</div>
            <div class="m-step-desc">Memperlakukan diri dengan kehangatan dan pengertian saat menghadapi kegagalan, bukan mencaci maki.</div>
          </div>
        </div>
        <div class="m-step-item">
          <div class="m-step-badge">2</div>
          <div class="m-step-content">
            <div class="m-step-title">Common Humanity (Kemanusiaan Bersama)</div>
            <div class="m-step-desc">Menyadari bahwa berbuat salah, terluka, dan merasa tidak sempurna adalah bagian alami dari menjadi manusia. Kamu tidak sendirian!</div>
          </div>
        </div>
        <div class="m-step-item">
          <div class="m-step-badge">3</div>
          <div class="m-step-content">
            <div class="m-step-title">Mindfulness (Kesadaran Seimbang)</div>
            <div class="m-step-desc">Memegang emosi menyakitkan dalam kesadaran jernih tanpa mengabaikannya dan tanpa membesar-besarkannya.</div>
          </div>
        </div>
      </div>

      <div class="m-takeaway-box">
        <div class="m-takeaway-title">💡 Sahabat Sejati Ada di Dalam Dirimu</div>
        <div style="font-size: 12px; color: #1E3A8A; line-height: 1.55;">
          Kamu telah bertahan melewati 100% hari-hari terberatmu hingga saat ini. Beri dirimu pelukan hangat, apresiasi usahamu, dan teruslah melangkah maju.
        </div>
      </div>

      <div class="m-source-box">
        <b>📚 Rujukan:</b> Self-Compassion: The Proven Power of Being Kind to Yourself (Dr. Kristin Neff, Ph.D.).
      </div>
    `
  },
  {
    id: 7,
    title: "Digital Wellbeing & Batasan Pertemanan",
    category: "RELASI & SUPPORT",
    icon: "👥",
    est: "4 mnt baca",
    hook: "Hindari jebakan komparasi media sosial, bangun lingkaran teman sehat, dan kontak darurat SEJIWA 119.",
    html: `
      <div class="m-img-wrap">
        <img src="assets/mental-digital-wellbeing.jpg" alt="Digital Wellbeing dan Lingkaran Pertemanan Sehat" class="m-content-img">
        <div class="m-img-caption">👥 Smart Digital &amp; Circle Sehat: Rehat dari layar, nikmati kebersamaan nyata dan bangun support circle positif.</div>
      </div>

      <p class="m-read-lead">
        Media sosial adalah tempat yang seru untuk belajar hal baru dan terhubung dengan kawan. Namun, saat linimasa terus membombardirmu dengan cuplikan kesempurnaan orang lain, mudah sekali kita terjebak dalam perangkap perbandingan (<i>comparison trap</i>).
      </p>
      
      <div class="m-callout m-callout-pink">
        <div class="m-callout-title">📴 Sinyal Merah: Saatnya Detoks Layar</div>
        <div class="m-callout-body">
          • Merasa cemas, minder, atau iri setiap selesai menutup Instagram / TikTok.<br>
          • <i>Doomscrolling</i> berjam-jam hingga menunda tugas sekolah dan mengorbankan waktu tidur.<br>
          • Merasa panik atau FOMO (Fear of Missing Out) jika tidak mengecek notifikasi dalam 10 menit.
        </div>
      </div>

      <h3 class="m-read-h3">🤝 Memilih Lingkaran Pertemanan (Support Circle):</h3>
      <div class="m-step-list">
        <div class="m-step-item">
          <div class="m-step-badge">🌱</div>
          <div class="m-step-content">
            <div class="m-step-title">Green Flag Friends (Sahabat Sejati)</div>
            <div class="m-step-desc">Ikut gembira saat kamu berprestasi, mendengarkan tanpa menghakimi, dan menghargai saat kamu berkata "aku lagi butuh istirahat".</div>
          </div>
        </div>
        <div class="m-step-item">
          <div class="m-step-badge">🚨</div>
          <div class="m-step-content">
            <div class="m-step-title">Red Flag Friends (Waspada Batasan)</div>
            <div class="m-step-desc">Mempermalukanmu di depan orang banyak, menyebarkan rahasia pribadimu, guilt-tripping, atau menuntut kesetiaan buta.</div>
          </div>
        </div>
      </div>

      <div class="m-callout m-callout-yellow">
        <div class="m-callout-title">🛡️ Hotline Darurat Kesehatan Mental Resmi (Gratis &amp; Rahasia)</div>
        <div class="m-callout-body">
          • <b>SEJIWA Kemenkes RI:</b> Telepon <b>119</b> tekan ekstensi <b>8</b> (Layanan konseling psikologis 24 jam)<br>
          • <b>Layanan SAPPA KemenPPPA:</b> Hotline <b>129</b> / WhatsApp <b>08111-129-129</b><br>
          • <b>Puskesmas PKPR Kecamatan:</b> Konseling remaja ramah, gratis, dan privat di fasilitas kesehatan terdekat.
        </div>
      </div>

      <div class="m-takeaway-box">
        <div class="m-takeaway-title">💡 Batasan Pribadi Bukan Sikap Egois</div>
        <div style="font-size: 12px; color: #1E3A8A; line-height: 1.55;">
          Menetapkan batasan sehat dengan media sosial dan relasi beracun adalah bentuk pertahanan diri tertinggi untuk menjaga kesehatan jiwamu tetap mekar.
        </div>
      </div>

      <div class="m-source-box">
        <b>📚 Rujukan:</b> Panduan Keamanan Digital Remaja &amp; Kesehatan Jiwa Komunitas, Kemenkes RI &amp; UNICEF Indonesia.
      </div>
    `
  },
  {
    id: 8,
    title: "Ikrar Resiliensi & Praktik Harian",
    category: "RESILIENSI & IKRAR",
    icon: "🌟",
    est: "3 mnt baca",
    hook: "Komitmen mencintai diri, afirmasi kekuatan pribadi, dan lembar refleksi harian remaja tangguh.",
    html: `
      <div class="m-img-wrap">
        <img src="assets/mental-health-book-cover.jpg" alt="Ikrar Resiliensi dan Meraih Masa Depan" class="m-content-img" style="max-height: 280px; object-position: center 20%;">
        <div class="m-img-caption">🌟 Tangguh &amp; Berdaya: Rawat kesehatan jiwamu, pegang teguh ikrar diri, dan raih masa depan penuh percaya diri!</div>
      </div>

      <p class="m-read-lead">
        Menjaga kesehatan mental bukanlah tujuan satu kali selesai, melainkan kebiasaan penuh kasih sayang yang kamu rawat setiap hari. Kamu memiliki kekuatan dan ketangguhan (resiliensi) untuk bangkit kembali setelah setiap badai hidup!
      </p>
      
      <div class="m-callout m-callout-yellow">
        <div class="m-callout-title">📜 5 Ikrar Remaja Tangguh (Resilience Pledge)</div>
        <div class="m-callout-body">
          1. <b>Aku berharga:</b> Nilai diriku tidak ditentukan oleh angka likes, komentar medsos, atau nilai angka semata.<br>
          2. <b>Aku berhak pulih:</b> Saat lelah atau gagal, aku akan beristirahat dan memberi jeda, bukan menyerah.<br>
          3. <b>Aku berani bersuara:</b> Jika beban terasa berat, aku tidak akan memendamnya sendirian dan berani mencari pertolongan.<br>
          4. <b>Aku menjaga batasan:</b> Aku berhak menolak ajakan yang membahayakan masa depan atau melanggar rasa nyamanku.<br>
          5. <b>Aku kawan bagi diriku:</b> Suara di kepalaku akan berbicara dengan kehangatan dan kebaikan seorang sahabat.
        </div>
      </div>

      <h3 class="m-read-h3">⚡ 3 Rutinitas Praktik Harian 5 Menit:</h3>
      <div class="m-step-list">
        <div class="m-step-item">
          <div class="m-step-badge">🌅</div>
          <div class="m-step-content">
            <div class="m-step-title">Pagi: Cek Baterai &amp; Niat Hari</div>
            <div class="m-step-desc">Tanyakan pada diri: <i>"Berapa persen energiku pagi ini? Satu hal apa yang ingin kunikmati hari ini?"</i></div>
          </div>
        </div>
        <div class="m-step-item">
          <div class="m-step-badge">☀️</div>
          <div class="m-step-content">
            <div class="m-step-title">Siang: Jeda Bernapas 1 Menit</div>
            <div class="m-step-desc">Lepaskan pandangan dari layar, renggangkan bahu, dan ambil 5 tarikan napas dalam menenangkan.</div>
          </div>
        </div>
        <div class="m-step-item">
          <div class="m-step-badge">🌙</div>
          <div class="m-step-content">
            <div class="m-step-title">Malam: Kotak Syukur 3 Hal</div>
            <div class="m-step-desc">Catat 3 hal sederhana yang berjalan baik hari ini di Tab <b>📌 Catatanku</b> sebelum tidur nyenyak.</div>
          </div>
        </div>
      </div>

      <div class="m-takeaway-box">
        <div class="m-takeaway-title">💡 Selamat Bertumbuh, Kawan Muda!</div>
        <div style="font-size: 12px; color: #1E3A8A; line-height: 1.55;">
          Perjalananmu baru saja dimulai. Jadikan workbook ini rumah aman yang selalu bisa kamu datangi kapan pun kamu membutuhkan keheningan dan kejelasan rasa.
        </div>
      </div>

      <div class="m-source-box">
        <b>📚 Sumber Bagian:</b> Positive Youth Development &amp; Social-Emotional Learning (SEL) Curriculum Guidelines.
      </div>
    `
  }
];
