'use client';
import { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher';

const ICONS = {
  PAYMENT    : '⬡',
  NEW_PATIENT: '◈',
  CONTRACT   : '◉',
};

const COLORS = {
  PAYMENT    : 'border-[#C9A84C] bg-[rgba(201,168,76,0.08)]',
  NEW_PATIENT: 'border-[#4CAF76] bg-[rgba(76,175,118,0.08)]',
  CONTRACT   : 'border-[#6B9FE4] bg-[rgba(107,159,228,0.08)]',
};

export default function NotificationToast() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const channel = pusherClient.subscribe('medichain');

    const addNotif = (data) => {
      const id = Date.now();
      setNotifications(prev => [{ ...data, id }, ...prev].slice(0, 5));
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    };

    channel.bind('transaction',  addNotif);
    channel.bind('new-patient',  addNotif);
    channel.bind('contract',     addNotif);

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe('medichain');
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {notifications.map(notif => (
        <div key={notif.id}
          className={`animate-fadeup flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md ${COLORS[notif.type] || COLORS.PAYMENT}`}
          style={{ minWidth: '280px', maxWidth: '340px' }}>
          <span className="mt-0.5 text-lg">{ICONS[notif.type]}</span>
          <div className="flex-1">
            {notif.type === 'PAYMENT' && (
              <>
                <div className="text-xs font-medium text-[#C9A84C]">Transfer MED</div>
                <div className="mt-0.5 text-xs font-light text-white">
                  {notif.from} → {notif.to}
                </div>
                <div className="mt-0.5 font-mono text-[0.65rem] text-[#7a7570]">
                  {notif.amount} MED · {notif.time}
                </div>
              </>
            )}
            {notif.type === 'NEW_PATIENT' && (
              <>
                <div className="text-xs font-medium text-[#4CAF76]">Pasien Baru</div>
                <div className="mt-0.5 text-xs font-light text-white">{notif.nama}</div>
                <div className="mt-0.5 font-mono text-[0.65rem] text-[#7a7570]">
                  {notif.kondisi} · {notif.dokter}
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
            className="text-[#7a7570] hover:text-white transition-colors text-xs">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}