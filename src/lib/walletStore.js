// ─────────────────────────────────────────
// In-memory wallet store (Token MED)
// ─────────────────────────────────────────
const wallets = {
  'MED-HOSPITAL-001': { name: 'Rumah Sakit Utama', balance: 50000 },
  'MED-PATIENT-001' : { name: 'Pasien Wallet',     balance: 10000 },
};

const transactions = [];

function getWallets()      { return wallets; }
function getTransactions() { return transactions; }

function transfer({ from, to, amount, note }) {
  if (!wallets[from] || !wallets[to])
    return { success: false, message: 'Wallet tidak ditemukan.' };
  if (from === to)
    return { success: false, message: 'Wallet pengirim dan penerima tidak boleh sama.' };
  if (wallets[from].balance < amount)
    return { success: false, message: 'Saldo MED tidak mencukupi.' };

  wallets[from].balance -= amount;
  wallets[to].balance   += amount;

  transactions.push({
    from, to, amount, note,
    time: new Date().toLocaleTimeString('id-ID'),
  });

  return {
    success: true,
    message: `Berhasil mengirim ${amount} MED dari ${wallets[from].name} ke ${wallets[to].name}.`,
  };
}

module.exports = { getWallets, getTransactions, transfer };