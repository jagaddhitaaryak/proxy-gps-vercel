// Nama file: api/gps.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // --- PASTIKAN URL INI BENAR ---
    const ALLOWED_ORIGIN = 'https://jagaddhitaaryak.github.io'; 

    // --- PASTIKAN HEADER INI DISET ---
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).send({ error: 'Method Not Allowed' });
    }

    const API_URL = 'https://vtsapi.easygo-gps.co.id/api/report/lastposition';
    const TOKEN = 'FC52B9C3421991B83DE234DA9E09'; // Token Anda

    try {
        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'token': TOKEN },
            body: JSON.stringify({}) 
        });

        if (!apiResponse.ok) {
            let errorBody = {};
            try { errorBody = await apiResponse.json(); } catch (e) {}
            console.error(`API EasyGo Error (${apiResponse.status}):`, errorBody);
            return res.status(apiResponse.status).send({ 
                error: `Gagal mengambil data dari API EasyGo: ${apiResponse.statusText}`,
                details: errorBody 
            });
        }

        const data = await apiResponse.json();
        res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate'); // Cache 30 menit
        res.status(200).send(data);

    } catch (error) {
        console.error("Error di Vercel Function:", error.message);
        res.status(500).send({ error: "Terjadi kesalahan internal pada proxy server Vercel." });
    }
};
