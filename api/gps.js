// Mengimpor 'node-fetch' versi 2
const fetch = require('node-fetch');

// Ini adalah fungsi utama yang akan dijalankan Vercel
module.exports = async (req, res) => {

    // --- PENGATURAN CORS PENTING ---
    // Ganti URL di bawah dengan URL GitHub Pages Anda yang sebenarnya.
    // Ini memberi tahu browser untuk mengizinkan 'admin.html' Anda berbicara dengan Vercel.

    // GANTI URL DI BAWAH INI
    res.setHeader('Access-Control-Allow-Origin', 'https://jagaddhitaaryak.github.io/jagaddhitaaryak/truck-kontrak/admin'); 

    // Header lain yang diperlukan untuk CORS
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 1. Tangani permintaan 'preflight' (OPTIONS) dari browser
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Hanya izinkan metode POST
    if (req.method !== 'POST') {
        return res.status(405).send({ error: 'Method Not Allowed' });
    }

    // --- LOGIKA INTI PROXY ---
    const API_URL = 'https://vtsapi.easygo-gps.co.id/api/report/lastposition';
    const TOKEN = 'FC52B98D9C23421991B83DE234DA9E09';

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

        if (!apiResponse.ok) {
            throw new Error(`API EasyGo gagal dengan status: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();

        // 4. Kirim data GPS kembali ke 'admin.html' Anda
        res.status(200).send(data);

    } catch (error) {
        console.error("Error di Vercel Function:", error.message);
        res.status(500).send({ error: "Gagal mengambil data dari proxy server" });
    }
};
