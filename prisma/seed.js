const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const prisma = new PrismaClient();

// ─────────────────────────────────────────
// HELPER: Parse CSV
// ─────────────────────────────────────────
function parseCSVLine(line) {
  const result = [];
  let current     = '';
  let insideQuote = false;
  for (const char of line) {
    if (char === '"')                      insideQuote = !insideQuote;
    else if (char === ',' && !insideQuote) { result.push(current); current = ''; }
    else                                   current += char;
  }
  result.push(current);
  return result;
}

function readCSV(filePath) {
  const lines   = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i]?.trim() ?? '']));
  });
}

function makeHash(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

// ─────────────────────────────────────────
// MAIN SEED
// ─────────────────────────────────────────
async function main() {
  console.log('🌱 Seeding database MediChain...\n');

  // Hapus data lama
  await prisma.smartContract.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();

  // ── Seed Patients dari CSV ──
  const csvPath  = path.join(__dirname, '..', 'public', 'data', 'healthcare_dataset.csv');
  const patients = readCSV(csvPath).slice(0, 10);
  let prevHash   = '0';

  for (let i = 0; i < patients.length; i++) {
    const p    = patients[i];
    const data = {
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
    };
    const hash = makeHash({ index: i + 1, prevHash, ...data });

    await prisma.patient.create({
      data: { ...data, blockIndex: i + 1, blockHash: hash, prevHash, nonce: Math.floor(Math.random() * 10000) },
    });

    prevHash = hash;
    console.log(`✅ Patient #${i + 1}: ${data.nama}`);
  }

  // ── Seed Wallets ──
  await prisma.wallet.createMany({
    data: [
      { address: 'MED-HOSPITAL-001', name: 'Rumah Sakit Utama', balance: 50000 },
      { address: 'MED-PATIENT-001',  name: 'Pasien Wallet',     balance: 10000 },
    ],
  });
  console.log('\n✅ Wallets seeded!');

  // ── Seed Users ──
  const hashedAdmin  = await bcrypt.hash('admin123', 10);
  const hashedDokter = await bcrypt.hash('dokter123', 10);

  await prisma.user.createMany({
    data: [
      { name: 'Administrator',  email: 'admin@medichain.com',  password: hashedAdmin,  role: 'admin'  },
      { name: 'Dr. Ahmad Fauzi', email: 'dokter@medichain.com', password: hashedDokter, role: 'dokter' },
    ],
  });
  console.log('✅ Users seeded!');

  console.log('\n🎉 Database MediChain siap!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());