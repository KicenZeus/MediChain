'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const LABEL_CLASS = "mb-2 block font-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#7a7570]";
const INPUT_CLASS = "w-full rounded-lg border border-[#2a2a2a] bg-black px-4 py-3 text-sm font-light text-white outline-none transition-colors focus:border-[#C9A84C]";

const INITIAL_FORM = {
  nama         : '',
  umur         : '',
  jenisKelamin : 'Male',
  golonganDarah: 'A+',
  kondisiMedis : '',
  tanggalMasuk : '',
  tanggalKeluar: '',
  dokter       : '',
  rumahSakit   : '',
  obat         : '',
  hasilTest    : 'Normal',
  biaya        : '',
  asuransi     : '',
};

export default function AddPatientForm() {
  const [form, setForm]     = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [notify, setNotify]   = useState(null);
  const router = useRouter();

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    // Validasi field wajib
    const required = ['nama', 'umur', 'kondisiMedis', 'tanggalMasuk', 'dokter', 'rumahSakit'];
    const empty    = required.find(k => !form[k]);
    if (empty) {
      setNotify({ success: false, message: `Field "${empty}" wajib diisi.` });
      return;
    }

    setLoading(true);
    setNotify(null);

    const res  = await fetch('/api/patients', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setNotify({ success: true, message: `Pasien ${form.nama} berhasil ditambahkan ke blockchain!` });
      setForm(INITIAL_FORM);
      setTimeout(() => router.refresh(), 1000);
    } else {
      setNotify({ success: false, message: data.error || 'Gagal menambahkan pasien.' });
    }
  };

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#111]">
      <div className="border-b border-[#2a2a2a] px-6 py-4">
        <span className="font-mono text-[0.65rem] tracking-widest uppercase text-[#7a7570]">
          Tambah Pasien Baru ke Blockchain
        </span>
      </div>

      <div className="p-6">
        {notify && (
          <div className={`mb-6 rounded-lg px-4 py-3 text-xs font-light ${
            notify.success
              ? 'bg-[rgba(76,175,118,0.1)] text-[#4CAF76]'
              : 'bg-[rgba(207,74,74,0.1)] text-[#CF4A4A]'
          }`}>
            {notify.success ? '✓' : '✕'} {notify.message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-5">

          {/* Nama */}
          <div className="col-span-2 sm:col-span-1">
            <label className={LABEL_CLASS}>Nama Lengkap *</label>
            <input type="text" className={INPUT_CLASS} placeholder="John Doe"
              value={form.nama} onChange={e => set('nama', e.target.value)} />
          </div>

          {/* Umur */}
          <div>
            <label className={LABEL_CLASS}>Umur *</label>
            <input type="number" className={INPUT_CLASS} placeholder="25"
              value={form.umur} onChange={e => set('umur', e.target.value)} />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className={LABEL_CLASS}>Jenis Kelamin</label>
            <select className={INPUT_CLASS} value={form.jenisKelamin}
              onChange={e => set('jenisKelamin', e.target.value)}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Golongan Darah */}
          <div>
            <label className={LABEL_CLASS}>Golongan Darah</label>
            <select className={INPUT_CLASS} value={form.golonganDarah}
              onChange={e => set('golonganDarah', e.target.value)}>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Kondisi Medis */}
          <div>
            <label className={LABEL_CLASS}>Kondisi Medis *</label>
            <select className={INPUT_CLASS} value={form.kondisiMedis}
              onChange={e => set('kondisiMedis', e.target.value)}>
              <option value="">Pilih kondisi...</option>
              {['Diabetes','Asthma','Obesity','Hypertension','Cancer','Arthritis'].map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

            {/* Tanggal Masuk */}
            <div>
            <label className={LABEL_CLASS}>Tanggal Masuk *</label>
            <DatePicker
                selected={form.tanggalMasuk ? new Date(form.tanggalMasuk) : null}
                onChange={date => set('tanggalMasuk', date ? date.toISOString().split('T')[0] : '')}
                dateFormat="dd/MM/yyyy"
                placeholderText="Pilih tanggal masuk"
                className={INPUT_CLASS}
                wrapperClassName="w-full"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                yearDropdownItemNumber={10}
            />
            </div>

            {/* Tanggal Keluar */}
            <div>
            <label className={LABEL_CLASS}>Tanggal Keluar</label>
            <DatePicker
                selected={form.tanggalKeluar ? new Date(form.tanggalKeluar) : null}
                onChange={date => set('tanggalKeluar', date ? date.toISOString().split('T')[0] : '')}
                dateFormat="dd/MM/yyyy"
                placeholderText="Pilih tanggal keluar"
                className={INPUT_CLASS}
                wrapperClassName="w-full"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                minDate={form.tanggalMasuk ? new Date(form.tanggalMasuk) : null}
                yearDropdownItemNumber={10}
            />
            </div>
          
            {/* Dokter */}
            <div>
            <label className={LABEL_CLASS}>Dokter *</label>
            <select className={INPUT_CLASS} value={form.dokter}
                onChange={e => set('dokter', e.target.value)}>
                <option value="">Pilih dokter...</option>
                {[
                'Dr. Patrick Parker',
                'Dr. Diane Jackson',
                'Dr. Paul Baker',
                'Dr. Brian Chandler',
                'Dr. Dustin Griffin',
                'Dr. Robin Green',
                'Dr. Patricia Bishop',
                'Dr. Brian Kennedy',
                'Dr. Kristin Dunn',
                'Dr. Jessica Bailey',
                'Dr. Ahmad Fauzi',
                'Dr. Siti Rahayu',
                'Dr. Budi Santoso',
                'Dr. Dewi Kusuma',
                ].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            </div>

            {/* Rumah Sakit */}
            <div>
            <label className={LABEL_CLASS}>Rumah Sakit *</label>
            <select className={INPUT_CLASS} value={form.rumahSakit}
                onChange={e => set('rumahSakit', e.target.value)}>
                <option value="">Pilih rumah sakit...</option>
                {[
                'RS Muhammadiyah Ponorogo',
                'RS Darmo Surabaya',
                'RS Umum Daerah Ponorogo',
                'RS Islam Surabaya',
                'Wallace-Hamilton Hospital',
                'Walton Medical Center',
                'Garcia Medical Institute',
                'Boyd PLC Hospital',
                'Brown Inc Medical',
                'Wheeler Bryant Hospital',
                ].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            </div>

          {/* Obat */}
          <div>
            <label className={LABEL_CLASS}>Obat</label>
            <select className={INPUT_CLASS} value={form.obat}
              onChange={e => set('obat', e.target.value)}>
              <option value="">Pilih obat...</option>
              {['Aspirin','Lipitor','Penicillin','Paracetamol','Ibuprofen','Metformin'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Hasil Test */}
          <div>
            <label className={LABEL_CLASS}>Hasil Test</label>
            <select className={INPUT_CLASS} value={form.hasilTest}
              onChange={e => set('hasilTest', e.target.value)}>
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
              <option value="Inconclusive">Inconclusive</option>
            </select>
          </div>

          {/* Biaya */}
          <div>
            <label className={LABEL_CLASS}>Biaya (USD)</label>
            <input type="number" className={INPUT_CLASS} placeholder="5000"
              value={form.biaya} onChange={e => set('biaya', e.target.value)} />
          </div>

          {/* Asuransi */}
          <div>
            <label className={LABEL_CLASS}>Asuransi</label>
            <select className={INPUT_CLASS} value={form.asuransi}
              onChange={e => set('asuransi', e.target.value)}>
              <option value="">Pilih asuransi...</option>
              {['Medicare','Medicaid','UnitedHealthcare','Aetna','Blue Cross','Cigna'].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="col-span-2 mt-2">
            <button onClick={handleSubmit} disabled={loading}
              className="w-full rounded-lg bg-[#C9A84C] py-4 text-xs font-medium tracking-widest uppercase text-black transition-all hover:bg-[#E8C97A] disabled:opacity-50">
              {loading ? 'Menyimpan ke Blockchain...' : '+ Tambah Pasien ke Blockchain →'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}