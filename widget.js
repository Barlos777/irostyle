(function () {
  // ============================================================
  //  IroStyle Widget — v1.2 (Devam Butonu Fix)
  // ============================================================

  const SKIN_TONES = [
    { hex: "#F5E0C8", label: "Çok Açık" },
    { hex: "#EAC99A", label: "Açık Buğday" },
    { hex: "#D4A96A", label: "Buğday" },
    { hex: "#C49458", label: "Orta Buğday" },
    { hex: "#A67845", label: "Koyu Buğday" },
    { hex: "#8B5E35", label: "Esmer" },
    { hex: "#FDEBD8", label: "Porselen" },
    { hex: "#F3D5B5", label: "Fildişi" },
    { hex: "#C68642", label: "Altın" },
    { hex: "#8D5524", label: "Amber" },
    { hex: "#5C3317", label: "Koyu Kahve" },
    { hex: "#3B1F0E", label: "Çok Koyu" },
  ];

  const PRODUCTS = ["Gömlek / Bluz", "Pantolon / Etek", "Elbise / Tulum", "Ceket / Mont", "Ayakkabı", "Aksesuar"];
  const HAIR = ["Siyah", "Koyu Kahve", "Açık Kahve", "Sarı/Kumral", "Kızıl", "Gri/Beyaz"];
  const EYES = ["Siyah", "Koyu Kahve", "Açık Kahve", "Yeşil", "Mavi", "Ela"];
  const OCCASIONS = ["İş / Ofis", "Düğün / Davet", "Günlük", "Randevu", "Spor"];

  let state = {
    open: false, step: 1, loading: false, result: null,
    product: "", height: "", weight: "",
    skinTone: null, hairColor: "", eyeColor: "", occasion: "",
  };

  const style = document.createElement("style");
  style.textContent = `
    #iro-widget-root * { box-sizing: border-box; font-family: Georgia, serif; }
    #iro-fab { position: fixed; bottom: 24px; right: 24px; z-index: 99999; background: linear-gradient(135deg, #1a0a00, #3d1a00); color: #D4A843; border: 1px solid #D4A843; padding: 13px 20px; border-radius: 32px; cursor: pointer; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,168,67,0.2); transition: transform 0.2s; }
    #iro-fab:hover { transform: scale(1.04); }
    #iro-panel { position: fixed; bottom: 24px; right: 24px; z-index: 99999; width: 320px; background: #0f0800; border: 1px solid rgba(212,168,67,0.3); border-radius: 20px; box-shadow: 0 24px 80px rgba(0,0,0,0.7); overflow: hidden; display: flex; flex-direction: column; }
    #iro-header { background: linear-gradient(135deg, #1a0a00, #2d1200); padding: 15px 18px; border-bottom: 1px solid rgba(212,168,67,0.2); display: flex; justify-content: space-between; align-items: center; }
    #iro-progress-bar { height: 2px; background: rgba(212,168,67,0.1); }
    #iro-progress-fill { height: 100%; background: #D4A843; transition: width 0.4s ease; }
    #iro-body { padding: 18px; max-height: 440px; overflow-y: auto; }
    #iro-footer { padding: 0 18px 18px; }
    .iro-label { color: rgba(212,168,67,0.75); font-size: 12px; margin-bottom: 14px; }
    .iro-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .iro-chip { padding: 10px 8px; border-radius: 10px; cursor: pointer; font-size: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.55); transition: all 0.2s; width: 100%; }
    .iro-chip.active { background: rgba(212,168,67,0.15); border-color: #D4A843; color: #D4A843; }
    .iro-input { width: 100%; padding: 11px; margin-bottom: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(212,168,67,0.2); border-radius: 10px; color: #fff; font-size: 14px; outline: none; font-family: Georgia, serif; }
    .iro-skin-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: 8px; }
    .iro-skin-dot { width: 36px; height: 36px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; display: block; margin: 0 auto 4px; }
    .iro-skin-dot.active { border-color: #D4A843; box-shadow: 0 0 0 2px rgba(212,168,67,0.4); }
    .iro-skin-name { font-size: 8px; color: rgba(255,255,255,0.3); text-align: center; }
    .iro-tag-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
    .iro-tag { padding: 7px 12px; border-radius: 20px; cursor: pointer; font-size: 12px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); transition: all 0.2s; }
    .iro-tag.active { border-color: #D4A843; background: rgba(212,168,67,0.13); color: #D4A843; }
    .iro-occasion { padding: 11px 14px; border-radius: 10px; cursor: pointer; font-size: 13px; text-align: left; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.55); transition: all 0.2s; width: 100%; margin-bottom: 8px; }
    .iro-occasion.active { border-color: #D4A843; background: rgba(212,168,67,0.12); color: #D4A843; }
    .iro-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 13px; margin-bottom: 10px; }
    .iro-card-gold { background: rgba(212,168,67,0.08); border: 1px solid rgba(212,168,67,0.2); border-radius: 12px; padding: 13px; margin-bottom: 10px; }
    .iro-card-label { color: rgba(212,168,67,0.6); font-size: 9px; letter-spacing: 1px; margin-bottom: 8px; }
    .iro-swatch { width: 38px; height: 38px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); }
    .iro-main-btn { width: 100%; padding: 12px; border: none; border-radius: 10px; font-size: 14px; font-weight: bold; font-family: Georgia, serif; cursor: pointer; transition: all 0.2s; letter-spacing: 0.5px; }
    .iro-main-btn.active { background: linear-gradient(135deg,#D4A843,#B8902E); color: #0f0800; }
    .iro-main-btn.disabled { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.2); cursor: default; }
    .iro-secondary-btn { width: 100%; padding: 10px; border-radius: 10px; cursor: pointer; background: rgba(212,168,67,0.1); border: 1px solid rgba(212,168,67,0.3); color: #D4A843; font-size: 13px; font-family: Georgia, serif; margin-top: 4px; }
    .iro-spinner { text-align: center; padding: 30px 0; }
    .iro-quote { background: linear-gradient(135deg,rgba(212,168,67,0.1),rgba(212,168,67,0.05)); border: 1px solid rgba(212,168,67,0.25); border-radius: 12px; padding: 13px; color: #D4A843; font-size: 13px; font-style: italic; line-height: 1.5; text-align: center; margin-bottom: 12px; }
  `;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.id = "iro-widget-root";
  document.body.appendChild(root);

  function render() {
    root.innerHTML = "";

    if (!state.open) {
      root.innerHTML = `<button id="iro-fab" onclick="IroStyle.open()">✦ Stilini Yarat</button>`;
      return;
    }

    const canNext = () => {
      if (state.step === 1) return state.product;
      if (state.step === 2) return state.height && state.weight;
      if (state.step === 3) return state.skinTone;
      if (state.step === 4) return state.hairColor && state.eyeColor;
      if (state.step === 5) return state.occasion;
      return false;
    };

    const pct = Math.round((state.step / 5) * 100);
    let body = "";

    if (state.loading) {
      body = `<div class="iro-spinner">
        <div style="color:#D4A843;font-size:26px;margin-bottom:10px">✦</div>
        <div style="color:rgba(212,168,67,0.7);font-size:13px">Stil analizin hazırlanıyor...</div>
      </div>`;
    } else if (state.step === 1) {
      body = `<div class="iro-label">Bugün ne arıyorsun?</div>
        <div class="iro-grid-2">${PRODUCTS.map(p =>
          `<button class="iro-chip ${state.product === p ? "active" : ""}" onclick="IroStyle.set('product','${p}')">${p}</button>`
        ).join("")}</div>`;
    } else if (state.step === 2) {
      // BURADAKİ HATA DÜZELTİLDİ: 'height' yerine 'weight' yazıldı.
      body = `<div class="iro-label">Boy ve kilonu gir</div>
        <input class="iro-input" type="number" placeholder="Boy (cm)" value="${state.height}" oninput="IroStyle.updateInput('height', this.value)">
        <input class="iro-input" type="number" placeholder="Kilo (kg)" value="${state.weight}" oninput="IroStyle.updateInput('weight', this.value)">`;
    } else if (state.step === 3) {
      body = `<div class="iro-label">Ten rengini seç</div>
        <div class="iro-skin-grid">${SKIN_TONES.map((t, i) =>
          `<div>
            <button class="iro-skin-dot ${state.skinTone?.hex === t.hex ? "active" : ""}"
              style="background:${t.hex}" title="${t.label}"
              onclick="IroStyle.setSkin(${i})"></button>
            <div class="iro-skin-name">${t.label}</div>
          </div>`
        ).join("")}</div>`;
    } else if (state.step === 4) {
      body = `<div class="iro-label">Saç ve göz rengin</div>
        <div style="color:rgba(255,255,255,0.4);font-size:11px;margin-bottom:8px">Saç Rengi</div>
        <div class="iro-tag-wrap" style="margin-bottom:14px">${HAIR.map(h =>
          `<button class="iro-tag ${state.hairColor === h ? "active" : ""}" onclick="IroStyle.set('hairColor','${h}')">${h}</button>`
        ).join("")}</div>
        <div style="color:rgba(255,255,255,0.4);font-size:11px;margin-bottom:8px">Göz Rengi</div>
        <div class="iro-tag-wrap">${EYES.map(e =>
          `<button class="iro-tag ${state.eyeColor === e ? "active" : ""}" onclick="IroStyle.set('eyeColor','${e}')">${e}</button>`
        ).join("")}</div>`;
    } else if (state.step === 5) {
      body = `<div class="iro-label">Bu kıyafeti nerede giyeceksin?</div>
        ${OCCASIONS.map(o =>
          `<button class="iro-occasion ${state.occasion === o ? "active" : ""}" onclick="IroStyle.set('occasion','${o}')">${o}</button>`
        ).join("")}`;
    } else if (state.step === 6 && state.result) {
      const r = state.result;
      const swatches = (r.palet || []).map(c =>
        `<div style="text-align:center;margin-right:8px">
          <div class="iro-swatch" style="background:${c.hex}"></div>
          <div style="font-size:9px;color:rgba(255,255,255,0.35);margin-top:3px">${c.ad}</div>
        </div>`
      ).join("");
      body = `
        <div class="iro-card-gold">
          <div class="iro-card-label">ÖNERİLEN BEDEN</div>
          <div style="color:#D4A843;font-size:22px;font-weight:bold">${r.beden || "-"}</div>
          <div style="color:rgba(255,255,255,0.45);font-size:11px;margin-top:4px">${r.bedenAciklama || ""}</div>
        </div>
        <div class="iro-card">
          <div class="iro-card-label">WADA × ${(r.mevsimTipi || "PALET").toUpperCase()}</div>
          <div style="display:flex">${swatches}</div>
        </div>
        <div class="iro-card">
          <div class="iro-card-label">STİL TAVSİYESİ</div>
          <div style="color:rgba(255,255,255,0.8);font-size:12px;line-height:1.6;margin-bottom:8px">${r.urunOnerisi || ""}</div>
          <div style="color:rgba(255,255,255,0.5);font-size:12px;line-height:1.6;border-top:1px solid rgba(255,255,255,0.06);padding-top:8px">🎯 ${r.kombinOnerisi || ""}</div>
        </div>
        <div class="iro-quote">"${r.stilMesaji || ""}"</div>
        <button class="iro-secondary-btn" onclick="IroStyle.reset()">✦ Yeni Analiz</button>`;
    }

    const footer = state.step <= 5 && !state.loading ? `
      <div id="iro-footer">
        <button id="iro-next-btn" class="iro-main-btn ${canNext() ? "active" : "disabled"}"
          onclick="if(this.classList.contains('active')){ ${state.step === 5 ? "IroStyle.analyze()" : "IroStyle.next()"} }">
          ${state.step === 5 ? "✦ Analiz Et" : "Devam →"}
        </button>
      </div>` : "";

    const headerSub = state.step <= 5
      ? `<div style="color:rgba(212,168,67,0.45);font-size:10px;margin-top:2px">Adım ${state.step} / 5</div>`
      : "";

    root.innerHTML = `
      <div id="iro-panel">
        <div id="iro-header">
          <div>
            <div style="color:#D4A843;font-size:16px;font-weight:bold;letter-spacing:1px">IroStyle</div>
            ${headerSub}
          </div>
          <button onclick="IroStyle.close()" style="background:none;border:none;color:rgba(212,168,67,0.5);cursor:pointer;font-size:22px;line-height:1">×</button>
        </div>
        ${state.step <= 5 ? `<div id="iro-progress-bar"><div id="iro-progress-fill" style="width:${pct}%"></div></div>` : ""}
        <div id="iro-body">${body}</div>
        ${footer}
      </div>`;
  }

  window.IroStyle = {
    open() { state.open = true; render(); },
    close() { state.open = false; render(); },
    set(field, value) { state[field] = value; render(); },
    setSkin(i) { state.skinTone = SKIN_TONES[i]; render(); },
    next() { state.step++; render(); },
    reset() { state = { ...state, step: 1, result: null, loading: false, product: "", height: "", weight: "", skinTone: null, hairColor: "", eyeColor: "", occasion: "" }; render(); },
    updateInput(field, value) {
      state[field] = value;
      const btn = document.getElementById("iro-next-btn");
      if (btn) btn.className = (state.height && state.weight) ? "iro-main-btn active" : "iro-main-btn disabled";
    },
    async analyze() {
      state.loading = true;
      render();

      try {
        const prompt = `Ürün: ${state.product}, Boy: ${state.height}cm, Kilo: ${state.weight}kg, Ten: ${state.skinTone?.label}, Saç: ${state.hairColor}, Göz: ${state.eyeColor}, Ortam: ${state.occasion}`;
        const systemPrompt = `Sen IroStyle stil danışmanısın. Kullanıcıya boy, kilo ve renk analizine göre moda tavsiyeleri veriyorsun. Wada, Itten ve Kibbe teorilerini kullan. Sadece şu JSON formatını döndür: {"beden":"...","bedenAciklama":"...","mevsimTipi":"...","palet":[{"hex":"#...","ad":"..."}],"urunOnerisi":"...","kombinOnerisi":"...","stilMesaji":"..."}`;

        const res = await fetch("/api/styler", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, systemPrompt })
        });

        if (!res.ok) throw new Error("Sunucu cevap vermedi (Kod: " + res.status + ")");

        const data = await res.json();
        let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || data.text || data.result;
        
        if (!resultText) throw new Error("API'den boş cevap geldi.");

        resultText = resultText.replace(/```json|```/g, "").trim();
        state.result = JSON.parse(resultText);

      } catch (err) {
        console.error("Analiz hatası:", err);
        state.result = {
          beden: "⚠️",
          bedenAciklama: "Bağlantı Hatası",
          mevsimTipi: "HATA",
          palet: [{hex: "#333333", ad: "Sistem"}],
          urunOnerisi: "Şu anda stil analizini yapacak olan API (arka uç) ile iletişim kurulamadı.",
          kombinOnerisi: "Eğer GitHub'da api/styler.js dosyan yoksa veya Vercel ayarlarında GEMINI_API_KEY eksikse bu hata oluşur.",
          stilMesaji: "Hata detayı: " + err.message
        };
      }

      state.loading = false;
      state.step = 6;
      render();
    }
  };

  render();
})();
