import prisma from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';

export async function GET() {
  try {
    const wallets      = await prisma.wallet.findMany();
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take   : 10,
    });

    return Response.json({
      wallets     : Object.fromEntries(wallets.map(w => [w.address, { name: w.name, balance: w.balance }])),
      transactions: transactions.map(tx => ({
        from: tx.from, to: tx.to, amount: tx.amount,
        note: tx.note, time: new Date(tx.createdAt).toLocaleTimeString('id-ID'),
      })),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { from, to, amount, note } = await request.json();

    const fromWallet = await prisma.wallet.findUnique({ where: { address: from } });
    const toWallet   = await prisma.wallet.findUnique({ where: { address: to   } });

    if (!fromWallet || !toWallet)
      return Response.json({ success: false, message: 'Wallet tidak ditemukan.' });
    if (from === to)
      return Response.json({ success: false, message: 'Wallet pengirim dan penerima tidak boleh sama.' });
    if (fromWallet.balance < amount)
      return Response.json({ success: false, message: 'Saldo MED tidak mencukupi.' });

    await prisma.$transaction([
      prisma.wallet.update({ where: { address: from }, data: { balance: { decrement: amount } } }),
      prisma.wallet.update({ where: { address: to   }, data: { balance: { increment: amount } } }),
      prisma.transaction.create({ data: { from, to, amount, note: note || 'Transfer MED' } }),
    ]);

    // Trigger real-time notifikasi
    await pusherServer.trigger('medichain', 'transaction', {
      type   : 'PAYMENT',
      from   : fromWallet.name,
      to     : toWallet.name,
      amount,
      note   : note || 'Transfer MED',
      time   : new Date().toLocaleTimeString('id-ID'),
    });

    return Response.json({
      success: true,
      message: `Berhasil mengirim ${amount} MED dari ${fromWallet.name} ke ${toWallet.name}.`,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}