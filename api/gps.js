// Mengimpor 'node-fetch' versi 2 (pastikan sudah ada di package.json)
const fetch = require('node-fetch');

// Ini adalah fungsi utama yang akan dijalankan Vercel
module.exports = async (req, res) => {
    
    // Log paling awal untuk memastikan fungsi terpanggil
    console.log(`[LOG] Menerima request: ${req.method} dari origin: ${req.headers.origin}`);

    // --- PENGATURAN CORS PENTING ---
    // Pastikan URL ini persis origin GitHub Pages Anda (tanpa path, tanpa slash di akhir)
    const allowedOrigin = 'https://jagaddhitaaryak.github.io'; // <-- Pastikan ini BENAR
    
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 1. Tangani permintaan 'preflight' (OPTIONS) dari browser
    if (req.method === 'OPTIONS') {
        console.log("[LOG] Merespons request OPTIONS (preflight)");
        return res.status(200).end();
    }

    // 2. Hanya izinkan metode POST
    if (req.method !== 'POST') {
        console.log(`[LOG] Metode ${req.method} ditolak.`);
        res.setHeader('Allow', 'POST, OPTIONS'); // Beri tahu browser metode yang diizinkan
        return res.status(405).send({ error: 'Method Not Allowed' });
    }

    // --- LOGIKA INTI PROXY ---
    const API_URL = 'https://vtsapi.easygo-gps.co.id/api/report/lastposition';
    const TOKEN = 'FC52B98D9C23421991B83DE234DA9E09'; // Token Anda aman di sini

    try {
        console.log("[LOG] Memanggil API EasyGo...");
        // 3. Vercel memanggil API EasyGo atas nama Anda
        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': TOKEN
            },
            body: JSON.stringify({}) // Mengirim body JSON kosong
        });

        console.log(`[LOG] Status respons dari EasyGo: ${apiResponse.status}`);

        if (!apiResponse.ok) {
            // Jika EasyGo error, log errornya dan kirimkan status error
            const errorBody = await apiResponse.text(); // Coba baca body error
            console.error(`[ERROR] API EasyGo gagal: ${apiResponse.status} - ${errorBody}`);
            throw new Error(`API EasyGo gagal dengan status: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();
        
        console.log("[LOG] Berhasil mendapatkan data dari EasyGo, mengirim kembali ke klien.");
        // 4. Kirim data GPS kembali ke 'admin.html' Anda
        // Pastikan header Content-Type JSON dikirim
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(data);

    } catch (error) {
        console.error("[ERROR] Gagal dalam fungsi proxy:", error.message);
        // Kirim respons error yang jelas ke klien
        res.status(500).send({ error: "Gagal mengambil data dari server proxy", details: error.message });
    }
};
