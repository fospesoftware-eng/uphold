import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Printer } from 'lucide-react';
import type { Asset } from '../../../types';

interface Props {
  asset: Asset;
  onClose: () => void;
}

export function QRCodeModal({ asset, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrValue = asset.qr_code ?? asset.id;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}&bgcolor=ffffff&color=010205&margin=2`;

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>QR Label — ${asset.name}</title>
      <style>
        body { font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; padding: 20px; }
        .label { border: 2px solid #000; padding: 16px; text-align: center; width: 200px; }
        img { width: 160px; height: 160px; }
        .code { font-size: 11px; font-family: monospace; margin-top: 6px; }
        .name { font-size: 13px; font-weight: bold; margin-top: 4px; }
        .property { font-size: 10px; color: #555; }
      </style></head><body>
      <div class="label">
        <img src="${qrUrl}" alt="QR" />
        <div class="code">${asset.asset_code}</div>
        <div class="name">${asset.name}</div>
        ${asset.property_name ? `<div class="property">${asset.property_name}${asset.unit_number ? ` · Unit ${asset.unit_number}` : ''}</div>` : ''}
      </div>
      <script>window.onload = () => { window.print(); window.close(); }<\/script>
      </body></html>
    `);
    win.document.close();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 8 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-[#111827] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
          <div>
            <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">QR Code</h2>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{asset.asset_code} · {asset.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#F1F5F9] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center gap-4">
          {/* QR Code */}
          <div className="p-4 bg-white rounded-2xl border-2 border-[#E6EEF5] shadow-inner">
            <img
              src={qrUrl}
              alt={`QR code for ${asset.name}`}
              width={180}
              height={180}
              className="block"
            />
          </div>

          {/* Asset info below QR */}
          <div className="text-center space-y-1">
            <p className="text-xs font-mono font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-wider">{asset.asset_code}</p>
            <p className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1]">{asset.name}</p>
            {asset.property_name && (
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{asset.property_name}{asset.unit_number ? ` · Unit ${asset.unit_number}` : ''}</p>
            )}
          </div>

          {/* QR data */}
          <div className="w-full bg-[#F8FAFC] dark:bg-[#1E2D45] rounded-xl p-3">
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1 font-medium">QR Data</p>
            <p className="text-xs font-mono text-[#334155] dark:text-[#CBD5E1] break-all">{qrValue}</p>
          </div>

          {/* Label sizes */}
          <div className="w-full">
            <p className="text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-2">Label Size</p>
            <div className="flex gap-2">
              {['25×25mm', '40×40mm', '50×50mm', 'A4'].map(size => (
                <button
                  key={size}
                  className="flex-1 py-1.5 text-xs border border-[#E2E8F0] dark:border-[#1E2D45] rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:border-[#075DE8] hover:text-[#075DE8] transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-[#E6EEF5] dark:border-[#1E2D45]">
          <a
            href={qrUrl}
            download={`${asset.asset_code}-qr.png`}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium border border-[#E2E8F0] dark:border-[#1E2D45] rounded-xl text-[#334155] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] transition-colors"
          >
            <Download size={14} /> Download
          </a>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white rounded-xl bg-[#075DE8] hover:bg-[#0552CC] transition-colors"
          >
            <Printer size={14} /> Print Label
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
