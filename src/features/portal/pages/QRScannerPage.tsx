import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, QrCode, X, Flashlight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QRScannerPage() {
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  const simulateScan = () => {
    setTimeout(() => {
      setScanning(false);
      navigate('/portal/assets');
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 lg:max-w-none lg:px-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">QR Scanner</h1>
        <p className="text-sm text-[#64748B]">Scan any asset QR code to view details or report an issue</p>
      </div>

      {/* Scanner viewport */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0F172A] aspect-square max-w-sm mx-auto">
        {scanning ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 relative">
              {/* Animated scan line */}
              <motion.div
                animate={{ y: [0, 160, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-x-4 h-0.5 bg-[#075DE8] shadow-[0_0_8px_#075DE8]"
              />
              {/* Corner markers */}
              {[['top-0 left-0', 'border-t-2 border-l-2 rounded-tl-lg'],
                ['top-0 right-0', 'border-t-2 border-r-2 rounded-tr-lg'],
                ['bottom-0 left-0', 'border-b-2 border-l-2 rounded-bl-lg'],
                ['bottom-0 right-0', 'border-b-2 border-r-2 rounded-br-lg'],
              ].map(([pos, cls]) => (
                <div key={pos} className={`absolute ${pos} w-8 h-8 border-[#075DE8] ${cls}`} />
              ))}
            </div>
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-white text-sm font-medium">Scanning...</p>
              <button onClick={() => setScanning(false)} className="mt-2 text-white/60 text-xs">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#0F172A] to-[#1E2D45]">
            <div className="w-24 h-24 rounded-3xl border-2 border-dashed border-white/20 flex items-center justify-center">
              <QrCode size={40} className="text-white/40" />
            </div>
            <p className="text-white/60 text-sm">Camera preview appears here</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { setScanning(true); simulateScan(); }}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#075DE8] to-[#0EA5E9] text-white font-semibold text-base shadow-xl shadow-blue-500/30"
        >
          <Camera size={20} />
          {scanning ? 'Scanning...' : 'Start Scanning'}
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1] mb-3">How to use</h3>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Tap "Start Scanning" to activate your camera' },
            { step: '2', text: 'Point your camera at any asset QR code in your unit' },
            { step: '3', text: 'The asset page opens automatically with full details' },
            { step: '4', text: 'Tap "Report a Problem" to instantly log a maintenance request' },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#075DE8] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {item.step}
              </div>
              <p className="text-sm text-[#64748B]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick asset links */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1] mb-3">Or browse your assets</h3>
        <button
          onClick={() => navigate('/portal/assets')}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-[#E6EEF5] dark:border-[#1E2D45] text-sm font-medium text-[#334155] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] transition-colors"
        >
          View All My Assets
        </button>
      </div>
    </div>
  );
}
