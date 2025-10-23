// Nama file: api/gps.js (KODE TES SEMENTARA)

module.exports = async (req, res) => {
    // --- Header CORS ---
    const ALLOWED_ORIGIN = 'https://jagaddhitaaryak.github.io';
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Tangani request OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        console.log('Menerima request OPTIONS, mengirim 200 OK'); // Log untuk Vercel
        return res.status(200).end();
    }

    // Tangani request POST (kirim data tes sederhana)
    if (req.method === 'POST') {
        console.log('Menerima request POST, mengirim data tes'); // Log untuk Vercel
        res.setHeader('Cache-Control', 'no-cache'); // Nonaktifkan cache untuk tes
        return res.status(200).json({ 
            message: "Tes berhasil! Header CORS seharusnya ada.",
            timestamp: new Date().toISOString() 
        });
    }

    // Tangani metode lain
    console.log(`Menerima request ${req.method}, mengirim 405 Method Not Allowed`); // Log untuk Vercel
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method Not Allowed' });
};
