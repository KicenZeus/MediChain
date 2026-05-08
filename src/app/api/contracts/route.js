import prisma from '@/lib/prisma';
import {
  createMedicalPayment,
  createInsuranceClaim,
  activateContract,
  cancelContract,
} from '@/lib/smartContract';
import crypto from 'crypto';

// Helper: eksekusi kontrak dari database
async function executeContractDB(id) {
  const contract = await prisma.smartContract.findUnique({ where: { id } });
  if (!contract)
    return { success: false, message: 'Kontrak tidak ditemukan.' };
  if (contract.status !== 'ACTIVE')
    return { success: false, message: `Kontrak belum aktif. Status: ${contract.status}` };

  const fromWallet = await prisma.wallet.findUnique({ where: { address: contract.from } });
  if (!fromWallet || fromWallet.balance < contract.amount)
    return { success: false, message: 'Saldo MED tidak mencukupi.' };

  const now = new Date();
  const log = [...(contract.log), `[${now.toISOString()}] Kontrak dieksekusi — ${contract.amount} MED dari ${contract.from} ke ${contract.to}`];

  await prisma.$transaction([
    prisma.wallet.update({ where: { address: contract.from }, data: { balance: { decrement: contract.amount } } }),
    prisma.wallet.update({ where: { address: contract.to   }, data: { balance: { increment: contract.amount } } }),
    prisma.transaction.create({ data: { from: contract.from, to: contract.to, amount: contract.amount, note: contract.note } }),
    prisma.smartContract.update({ where: { id }, data: { status: 'EXECUTED', executedAt: now, log } }),
  ]);

  return { success: true, message: `Kontrak ${id} berhasil dieksekusi.` };
}

export async function GET() {
  try {
    const contracts = await prisma.smartContract.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return Response.json({ contracts });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    let result;

    if (body.action === 'CREATE_MEDICAL' || body.action === 'CREATE_INSURANCE') {
      const id         = crypto.randomBytes(8).toString('hex').toUpperCase();
      const type       = body.action === 'CREATE_MEDICAL' ? 'MEDICAL_PAYMENT' : 'INSURANCE_CLAIM';
      const conditions = type === 'MEDICAL_PAYMENT'
        ? [{ type: 'MIN_BALANCE', wallet: body.from, amount: body.amount }]
        : [
            { type: 'MIN_BALANCE', wallet: body.from, amount: body.amount },
            { type: 'TEST_RESULT', expectedValues: ['Abnormal', 'Inconclusive'], actualValue: body.testResult },
          ];
      const note = type === 'MEDICAL_PAYMENT'
        ? `Pembayaran otomatis untuk pasien ${body.patientName} — Diagnosis: ${body.diagnosis}`
        : `Klaim asuransi untuk ${body.patientName} — Hasil test: ${body.testResult}`;
      const hash = crypto.createHash('sha256')
        .update(id + type + body.from + body.to + body.amount + new Date().toISOString())
        .digest('hex');
      const log  = [`[${new Date().toISOString()}] Kontrak dibuat — status: PENDING`];

      result = await prisma.smartContract.create({
        data: { id, type, from: body.from, to: body.to, amount: body.amount, note, conditions, status: 'PENDING', hash, log },
      });

    } else if (body.action === 'ACTIVATE') {
      const contract = await prisma.smartContract.findUnique({ where: { id: body.id } });
      if (!contract) return Response.json({ success: false, message: 'Kontrak tidak ditemukan.' });
      const log = [...contract.log, `[${new Date().toISOString()}] Kontrak diaktifkan — status: ACTIVE`];
      await prisma.smartContract.update({ where: { id: body.id }, data: { status: 'ACTIVE', log } });
      result = { success: true, message: 'Kontrak berhasil diaktifkan.' };

    } else if (body.action === 'EXECUTE') {
      result = await executeContractDB(body.id);

    } else if (body.action === 'CANCEL') {
      const contract = await prisma.smartContract.findUnique({ where: { id: body.id } });
      if (!contract) return Response.json({ success: false, message: 'Kontrak tidak ditemukan.' });
      const log = [...contract.log, `[${new Date().toISOString()}] Kontrak dibatalkan — status: CANCELLED`];
      await prisma.smartContract.update({ where: { id: body.id }, data: { status: 'CANCELLED', log } });
      result = { success: true, message: 'Kontrak berhasil dibatalkan.' };

    } else {
      result = { success: false, message: 'Action tidak dikenal.' };
    }

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}