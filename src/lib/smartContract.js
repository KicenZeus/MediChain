const crypto = require('crypto');

// ─────────────────────────────────────────
// KONTRAK STATUS
// ─────────────────────────────────────────
const CONTRACT_STATUS = {
  PENDING  : 'PENDING',
  ACTIVE   : 'ACTIVE',
  EXECUTED : 'EXECUTED',
  CANCELLED: 'CANCELLED',
};

// ─────────────────────────────────────────
// CLASS: SMART CONTRACT BASE
// ─────────────────────────────────────────
class SmartContract {
  constructor({ type, from, to, amount, conditions, note }) {
    this.id         = crypto.randomBytes(8).toString('hex').toUpperCase();
    this.type       = type;
    this.from       = from;
    this.to         = to;
    this.amount     = amount;
    this.conditions = conditions;
    this.note       = note       || '';
    this.status     = CONTRACT_STATUS.PENDING;
    this.createdAt  = new Date().toISOString();
    this.executedAt = null;
    this.log        = [`[${this.createdAt}] Kontrak dibuat — status: PENDING`];
  }

  // Hash unik kontrak
  getHash() {
    return crypto
      .createHash('sha256')
      .update(this.id + this.type + this.from + this.to + this.amount + this.createdAt)
      .digest('hex');
  }

  // Aktifkan kontrak
  activate() {
    if (this.status !== CONTRACT_STATUS.PENDING)
      return { success: false, message: 'Kontrak tidak dalam status PENDING.' };
    this.status = CONTRACT_STATUS.ACTIVE;
    this.log.push(`[${new Date().toISOString()}] Kontrak diaktifkan — status: ACTIVE`);
    return { success: true, message: 'Kontrak berhasil diaktifkan.' };
  }

  // Batalkan kontrak
  cancel() {
    if (this.status === CONTRACT_STATUS.EXECUTED)
      return { success: false, message: 'Kontrak sudah dieksekusi, tidak bisa dibatalkan.' };
    this.status = CONTRACT_STATUS.CANCELLED;
    this.log.push(`[${new Date().toISOString()}] Kontrak dibatalkan — status: CANCELLED`);
    return { success: true, message: 'Kontrak berhasil dibatalkan.' };
  }

  // Cek semua kondisi terpenuhi
  checkConditions(wallets) {
    return this.conditions.every(cond => {
      if (cond.type === 'MIN_BALANCE')
        return (wallets[cond.wallet]?.balance ?? 0) >= cond.amount;
      if (cond.type === 'TEST_RESULT')
        return cond.expectedValues.includes(cond.actualValue);
      return false;
    });
  }

  // Eksekusi kontrak
  execute(wallets) {
    if (this.status !== CONTRACT_STATUS.ACTIVE)
      return { success: false, message: `Kontrak belum aktif. Status: ${this.status}` };

    if (!this.checkConditions(wallets))
      return { success: false, message: 'Kondisi kontrak belum terpenuhi.' };

    if ((wallets[this.from]?.balance ?? 0) < this.amount)
      return { success: false, message: 'Saldo MED tidak mencukupi untuk eksekusi.' };

    wallets[this.from].balance -= this.amount;
    wallets[this.to].balance   += this.amount;

    this.status     = CONTRACT_STATUS.EXECUTED;
    this.executedAt = new Date().toISOString();
    this.log.push(`[${this.executedAt}] Kontrak dieksekusi — ${this.amount} MED dari ${this.from} ke ${this.to}`);

    return {
      success: true,
      message: `Kontrak ${this.id} berhasil dieksekusi. ${this.amount} MED ditransfer.`,
    };
  }

  // Ringkasan kontrak
  getSummary() {
    return {
      id        : this.id,
      type      : this.type,
      from      : this.from,
      to        : this.to,
      amount    : this.amount,
      conditions: this.conditions,
      note      : this.note,
      status    : this.status,
      createdAt : this.createdAt,
      executedAt: this.executedAt,
      hash      : this.getHash(),
      log       : this.log,
    };
  }
}

// ─────────────────────────────────────────
// CLASS: MEDICAL PAYMENT CONTRACT
// Kontrak pembayaran otomatis pasien
// ─────────────────────────────────────────
class MedicalPaymentContract extends SmartContract {
  constructor({ from, to, amount, patientName, diagnosis }) {
    super({
      type      : 'MEDICAL_PAYMENT',
      from, to, amount,
      note      : `Pembayaran otomatis untuk pasien ${patientName} — Diagnosis: ${diagnosis}`,
      conditions: [
        { type: 'MIN_BALANCE', wallet: from, amount },
      ],
    });
    this.patientName = patientName;
    this.diagnosis   = diagnosis;
  }
}

// ─────────────────────────────────────────
// CLASS: INSURANCE CLAIM CONTRACT
// Kontrak klaim asuransi otomatis
// ─────────────────────────────────────────
class InsuranceClaimContract extends SmartContract {
  constructor({ from, to, amount, patientName, testResult }) {
    super({
      type      : 'INSURANCE_CLAIM',
      from, to, amount,
      note      : `Klaim asuransi untuk ${patientName} — Hasil test: ${testResult}`,
      conditions: [
        { type: 'MIN_BALANCE', wallet: from, amount },
        {
          type          : 'TEST_RESULT',
          expectedValues: ['Abnormal', 'Inconclusive'],
          actualValue   : testResult,
        },
      ],
    });
    this.patientName = patientName;
    this.testResult  = testResult;
  }
}

// ─────────────────────────────────────────
// CONTRACT STORE — simpan semua kontrak
// ─────────────────────────────────────────
const contracts = [];

function createMedicalPayment({ from, to, amount, patientName, diagnosis }) {
  const contract = new MedicalPaymentContract({ from, to, amount, patientName, diagnosis });
  contracts.push(contract);
  return contract.getSummary();
}

function createInsuranceClaim({ from, to, amount, patientName, testResult }) {
  const contract = new InsuranceClaimContract({ from, to, amount, patientName, testResult });
  contracts.push(contract);
  return contract.getSummary();
}

function activateContract(id) {
  const contract = contracts.find(c => c.id === id);
  if (!contract) return { success: false, message: 'Kontrak tidak ditemukan.' };
  return contract.activate();
}

function executeContract(id, wallets) {
  const contract = contracts.find(c => c.id === id);
  if (!contract) return { success: false, message: 'Kontrak tidak ditemukan.' };
  return contract.execute(wallets);
}

function cancelContract(id) {
  const contract = contracts.find(c => c.id === id);
  if (!contract) return { success: false, message: 'Kontrak tidak ditemukan.' };
  return contract.cancel();
}

function getAllContracts() {
  return contracts.map(c => c.getSummary());
}

module.exports = {
  createMedicalPayment,
  createInsuranceClaim,
  activateContract,
  executeContract,
  cancelContract,
  getAllContracts,
};