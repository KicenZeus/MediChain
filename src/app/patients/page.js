import PageHeader from '@/components/PageHeader';
import AddPatientForm from '@/components/AddPatientForm';
import PatientList from '@/components/PatientList';
import ExportPDF from '@/components/ExportPDF';
import prisma from '@/lib/prisma';

export default async function PatientsPage() {
  const patients = await prisma.patient.findMany({
    orderBy: { blockIndex: 'asc' },
  });

  return (
    <div className="animate-fadeup">
      <div className="flex items-start justify-between">
        <PageHeader
          eyebrow="Medical Records"
          title="Patient"
          highlight="Registry"
          subtitle={`${patients.length} rekam medis tersimpan dalam blockchain.`}
        />
        <div className="mt-4">
          <ExportPDF patients={patients} />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111] p-6 text-center">
          <div className="font-cormorant text-4xl font-light text-[#C9A84C]">{patients.length}</div>
          <div className="mt-1 font-mono text-[0.6rem] tracking-widest uppercase text-[#7a7570]">Total Pasien</div>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111] p-6 text-center">
          <div className="font-cormorant text-4xl font-light text-[#4CAF76]">
            {patients.filter(p => p.hasilTest === 'Normal').length}
          </div>
          <div className="mt-1 font-mono text-[0.6rem] tracking-widest uppercase text-[#7a7570]">Normal</div>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111] p-6 text-center">
          <div className="font-cormorant text-4xl font-light text-[#CF4A4A]">
            {patients.filter(p => p.hasilTest === 'Abnormal').length}
          </div>
          <div className="mt-1 font-mono text-[0.6rem] tracking-widest uppercase text-[#7a7570]">Abnormal</div>
        </div>
      </div>

      <div className="mb-8">
        <AddPatientForm />
      </div>

      <PatientList patients={patients} />
    </div>
  );
}