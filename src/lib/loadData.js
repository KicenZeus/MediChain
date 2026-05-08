const fs   = require('fs');
const path = require('path');
const { Block, Blockchain } = require('./blockchain');

// ─────────────────────────────────────────
// HELPER: Parse satu baris CSV
// ─────────────────────────────────────────
function parseCSVLine(line) {
  const result = [];
  let current     = '';
  let insideQuote = false;

  for (const char of line) {
    if (char === '"')                    insideQuote = !insideQuote;
    else if (char === ',' && !insideQuote) { result.push(current); current = ''; }
    else                                   current += char;
  }
  result.push(current);
  return result;
}

// ─────────────────────────────────────────
// HELPER: Baca file CSV → array of objects
// ─────────────────────────────────────────
function readCSV(filePath) {
  const lines   = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i]?.trim() ?? '']));
  });
}

// ─────────────────────────────────────────
// MAIN: Load data pasien ke Blockchain
// ─────────────────────────────────────────
function loadHealthcareData(jumlah = 10) {
  const blockchain = new Blockchain();
  const csvPath    = path.join(process.cwd(), 'public', 'data', 'healthcare_dataset.csv');
  const patients   = readCSV(csvPath);

  console.log(`📂 Dataset: ${patients.length} pasien ditemukan`);
  console.log(`📦 Memasukkan ${jumlah} data ke blockchain...\n`);

  patients.slice(0, jumlah).forEach((p, i) => {
    blockchain.addBlock(new Block(i + 1, new Date().toISOString(), {
      nama         : p['Name'],
      umur         : p['Age'],
      jenisKelamin : p['Gender'],
      golonganDarah: p['Blood Type'],
      kondisiMedis : p['Medical Condition'],
      tanggalMasuk : p['Date of Admission'],
      tanggalKeluar: p['Discharge Date'],
      dokter       : p['Doctor'],
      rumahSakit   : p['Hospital'],
      obat         : p['Medication'],
      hasilTest    : p['Test Results'],
      biaya        : p['Billing Amount'],
      asuransi     : p['Insurance Provider'],
    }));
  });

  console.log(`\n✅ Blockchain siap! Total blok: ${blockchain.chain.length}`);
  return blockchain;
}

module.exports = { loadHealthcareData };