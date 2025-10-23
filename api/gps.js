// Nama file: api/gps.js
// (WAJIB diletakkan di dalam folder /api di proyek Vercel Anda)

// Mengimpor 'node-fetch' versi 2
const fetch = require('node-fetch');

// Ini adalah fungsi utama yang akan dijalankan Vercel
module.exports = async (req, res) => {

    // --- PENGATURAN CORS PENTING ---
    // URL GitHub Pages Anda sudah dimasukkan di sini
    const ALLOWED_ORIGIN = 'https://jagaddhitaaryak.github.io'; 

    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 1. Tangani permintaan 'preflight' (OPTIONS) dari browser
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Hanya izinkan metode POST
    if (req.method !== 'POST') {
        // Mengirim respons JSON untuk error
        return res.status(405).send({ error: 'Method Not Allowed' });
    }

    // --- LOGIKA INTI PROXY ---
    const API_URL = 'https://vtsapi.easygo-gps.co.id/api/report/lastposition';
    const TOKEN = 'FC52B98D9C23421991B83DE234DA9E09'; // Token Anda

    try {
        // 3. Vercel memanggil API EasyGo atas nama Anda
        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': TOKEN
            },
            body: JSON.stringify({}) // Mengirim body JSON kosong
        });

        // Cek jika API EasyGo merespons dengan error
        if (!apiResponse.ok) {
            // Coba baca pesan error dari API EasyGo jika ada
            let errorBody = {};
            try {
                errorBody = await apiResponse.json();
            } catch (e) {
                // Abaikan jika body error bukan JSON
            }
            console.error(`API EasyGo Error (${apiResponse.status}):`, errorBody);
            // Kirim status error dari API EasyGo ke client
            return res.status(apiResponse.status).send({ 
                error: `Gagal mengambil data dari API EasyGo: ${apiResponse.statusText}`,
                details: errorBody 
            });
        }

        const data = await apiResponse.json();

        // --- PENTING: PENAMBAHAN CACHING 30 MENIT ---
        // Ini akan menyimpan hasil di Vercel Edge selama 30 menit (1800 detik)
        res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
        // -------------------------------------------

        // 4. Kirim data GPS kembali ke 'admin.html' Anda
        res.status(200).send(data);

    } catch (error) {
        // 5. Tangani jika ada error lain (misal network error saat Vercel panggil EasyGo)
        console.error("Error di Vercel Function:", error.message);
        // Mengirim respons JSON untuk error internal
        res.status(500).send({ error: "Terjadi kesalahan internal pada proxy server Vercel." });
    }
};
