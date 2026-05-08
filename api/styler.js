import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Sadece POST isteklerini (bizim widget'ın gönderdiği formları) kabul et
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sadece POST istekleri kabul edilir.' });
  }

  try {
    const { prompt, systemPrompt } = req.body;
    
    // Vercel'deki gizli kasamızdan API anahtarını alıyoruz
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY Vercel'de bulunamadı. Lütfen ayarları kontrol edin." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Sistem talimatı ile kullanıcının boy/kilo verilerini birleştiriyoruz
    const fullPrompt = `${systemPrompt}\n\nKullanıcı Verileri:\n${prompt}`;

    // Gemini'ye soruyu gönder ve bekle
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    // Çıkan sonucu başarıyla widget'a geri gönder
    res.status(200).json({ result: text });

  } catch (error) {
    console.error("API Hatası:", error);
    res.status(500).json({ error: error.message });
  }
}
