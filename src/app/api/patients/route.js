import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { pusherServer } from '@/lib/pusher';

function makeHash(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { blockIndex: 'asc' },
    });
    return Response.json({ patients });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const lastBlock = await prisma.patient.findFirst({
      orderBy: { blockIndex: 'desc' },
    });

    const blockIndex = lastBlock ? lastBlock.blockIndex + 1 : 1;
    const prevHash   = lastBlock ? lastBlock.blockHash : '0';

    const data = {
      nama         : body.nama,
      umur         : body.umur,
      jenisKelamin : body.jenisKelamin,
      golonganDarah: body.golonganDarah,
      kondisiMedis : body.kondisiMedis,
      tanggalMasuk : body.tanggalMasuk,
      tanggalKeluar: body.tanggalKeluar,
      dokter       : body.dokter,
      rumahSakit   : body.rumahSakit,
      obat         : body.obat,
      hasilTest    : body.hasilTest,
      biaya        : body.biaya,
      asuransi     : body.asuransi,
    };

    const blockHash = makeHash({ blockIndex, prevHash, ...data });
    const nonce     = Math.floor(Math.random() * 100000);

    const patient = await prisma.patient.create({
      data: { ...data, blockIndex, blockHash, prevHash, nonce },
    });

    // Trigger real-time notifikasi
    await pusherServer.trigger('medichain', 'new-patient', {
      type : 'NEW_PATIENT',
      nama : data.nama,
      kondisi: data.kondisiMedis,
      dokter : data.dokter,
      time : new Date().toLocaleTimeString('id-ID'),
    });

    return Response.json({ success: true, patient });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}