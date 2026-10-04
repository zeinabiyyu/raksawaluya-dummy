/* Fungsi murni untuk simulasi dan laporan. Bisa diuji tanpa browser. */
(function(root) {
  'use strict';
  function classifyWater(value, warning, alert) {
    if (value >= alert) return 'alert';
    if (value >= warning) return 'warning';
    return 'normal';
  }
  function sample(step, scenario, settings) {
    const base = scenario === 'high' ? settings.alertWaterCm + 25 : scenario === 'rising' ? (settings.warningWaterCm + settings.alertWaterCm) / 2 : settings.baselineWaterCm;
    return {
      water: Math.round(base + 3.8 * Math.sin(step * .31) + 1.8 * Math.cos(step * .73)),
      temp: +(28.4 + .6 * Math.sin(step * .13)).toFixed(1),
      wind: +(12.6 + 2.1 * Math.sin(step * .53) + .7 * Math.cos(step * .91)).toFixed(1),
      vibration: +(.024 + .006 * Math.sin(step * .81) + .002 * Math.cos(step * .37)).toFixed(3),
      traffic: Math.round(18 + 4 * Math.sin(step * .19)),
      humidity: Math.round(72 + 3 * Math.sin(step * .23))
    };
  }
  function report(fields, name, date) {
    const now = date || new Date();
    const time = new Intl.DateTimeFormat('id-ID', {timeZone:'Asia/Jakarta', dateStyle:'long', timeStyle:'short'}).format(now);
    return `LAPORAN ${name} BRIDGE PROJECT\n${'='.repeat(38)}\nDibuat: ${time} WIB\nNama: ${fields.name.trim()}\nEmail: ${fields.email.trim() || 'Tidak dicantumkan'}\nTopik: ${fields.topic}\n\nPESAN\n${fields.message.trim()}\n\n${'='.repeat(38)}\nLaporan dibuat secara lokal.\nBelum dikirim kepada pengelola.\n`;
  }
  const core = {classifyWater, sample, report};
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.RaksawaluyaCore = core;
})(typeof window !== 'undefined' ? window : globalThis);
