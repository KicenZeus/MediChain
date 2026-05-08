import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const wallets      = await prisma.wallet.findMany();
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take   : 10,
    });

    const walletsMap = Object.fromEntries(
      wallets.map(w => [w.address, { name: w.name, balance: w.balance }])
    );

    const txList = transactions.map(tx => ({
      from  : tx.from,
      to    : tx.to,
      amount: tx.amount,
      note  : tx.note,
      time  : new Date(tx.createdAt).toLocaleTimeString('id-ID'),
    }));

    return Response.json({ wallets: walletsMap, transactions: txList });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}