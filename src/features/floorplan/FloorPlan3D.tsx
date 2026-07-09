import { useRef, useState, useCallback, useEffect } from 'react';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Maximize2, Move3d, X, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFloorPlan, ROOM_STYLE, type Furniture } from './floorPlanData';
import { assetService } from '../../services';

const CELL = 30; // px per grid cell

const FURN: Record<Furniture['type'], { bg: string; z: number; radius: number; accent?: string }> = {
  bed:      { bg: '#B9C6D8', z: 14, radius: 4, accent: '#EEF2F7' },
  sofa:     { bg: '#8FA0B6', z: 12, radius: 6 },
  table:    { bg: '#B08968', z: 10, radius: 4 },
  tv:       { bg: '#1F2937', z: 16, radius: 2 },
  wardrobe: { bg: '#9C7A57', z: 22, radius: 3 },
  counter:  { bg: '#AEB7C2', z: 12, radius: 3 },
  fridge:   { bg: '#E5E9EF', z: 24, radius: 3 },
  bath:     { bg: '#DCEBF0', z: 8,  radius: 8, accent: '#F5FAFC' },
  toilet:   { bg: '#EDF2F5', z: 10, radius: 6 },
  sink:     { bg: '#E3EBF0', z: 10, radius: 6 },
  bench:    { bg: '#C69C6D', z: 8,  radius: 2 },
  washer:   { bg: '#E5E9EF', z: 20, radius: 4 },
  plant:    { bg: '#5B8C6E', z: 18, radius: 12 },
};

interface Props {
  propertyId?: string;
  /** Highlight a room whose name contains this text (e.g. the tenant's "Bedroom 1"). */
  highlightRoom?: string;
  /** Compact height for tighter layouts. */
  height?: number;
}

export function FloorPlan3D({ propertyId, highlightRoom, height = 440 }: Props) {
  const plan = getFloorPlan(propertyId);
  const [rot, setRot] = useState(-32);
  const [tilt, setTilt] = useState(56);
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [allAssets, setAllAssets] = useState<any[]>([]);
  const drag = useRef<{ x: number; y: number; rot: number; tilt: number } | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      const assets = await assetService.getAssets();
      setAllAssets(assets);
    };
    fetchAssets();
  }, []);

  const boardW = plan.gridW * CELL;
  const boardH = plan.gridH * CELL;

  const highlightId = highlightRoom
    ? plan.rooms.find(r => r.name.toLowerCase().includes(highlightRoom.toLowerCase()))?.id
    : undefined;

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, rot, tilt };
  }, [rot, tilt]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    setRot(drag.current.rot + dx * 0.4);
    setTilt(Math.max(20, Math.min(75, drag.current.tilt - dy * 0.3)));
  }, []);

  const onPointerUp = useCallback(() => { drag.current = null; }, []);

  const reset = () => { setRot(-32); setTilt(56); setZoom(1); setSelected(null); setShowModal(false); };

  const active = selected ?? highlightId ?? null;
  const activeRoom = plan.rooms.find(r => r.id === active);
  const roomAssets = activeRoom ? allAssets.filter((a: any) => a.room === activeRoom.name) : [];

  return (
    <div className="relative select-none rounded-2xl overflow-hidden border border-[#E6EEF5] dark:border-[#1E2D45]"
      style={{ background: 'radial-gradient(120% 120% at 50% 0%, #F3F7FC 0%, #E7EEF6 55%, #DCE6F1 100%)' }}>

      {/* Stage */}
      <div
        className="relative cursor-grab active:cursor-grabbing"
        style={{ height, perspective: '1400px', touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: boardW, height: boardH,
            transform: `translate(-50%,-50%) rotateX(${tilt}deg) rotateZ(${rot}deg) scale(${zoom})`,
            transformStyle: 'preserve-3d',
            transition: drag.current ? 'none' : 'transform 0.25s ease',
          }}
        >
          {/* floor slab base (gives thickness/shadow) */}
          <div className="absolute inset-0" style={{
            transform: 'translateZ(-14px)',
            background: 'linear-gradient(#c7d0dc,#b3becd)',
            boxShadow: '0 40px 60px rgba(15,23,42,0.35)',
            borderRadius: 6,
          }} />

          {/* rooms */}
          {plan.rooms.map(room => {
            const style = ROOM_STYLE[room.type];
            const isActive = active === room.id;
            return (
              <div
                key={room.id}
                onClick={(e) => { e.stopPropagation(); setSelected(s => s === room.id ? null : room.id); }}
                className="absolute cursor-pointer"
                style={{
                  left: room.x * CELL, top: room.y * CELL,
                  width: room.w * CELL, height: room.h * CELL,
                  background: isActive ? mix(style.floor) : style.floor,
                  boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.5), inset 0 0 0 3px rgba(100,116,139,0.35)${isActive ? ', 0 0 0 3px #075DE8, 0 0 24px rgba(7,93,232,0.5)' : ''}`,
                  transition: 'background 0.15s',
                }}
              >
                {/* room label (kept upright-ish to camera) */}
                <div className="absolute left-1/2 top-1/2 pointer-events-none whitespace-nowrap"
                  style={{ transform: `translate(-50%,-50%) rotateZ(${-rot}deg)` }}>
                  <div className="text-[9px] font-bold text-[#334155] leading-tight text-center">
                    {room.name}
                    {room.area != null && <div className="text-[7px] font-medium text-[#64748B]">{room.area} m²</div>}
                  </div>
                </div>
              </div>
            );
          })}

          {/* furniture */}
          {plan.furniture.map((f, i) => {
            const cfg = FURN[f.type];
            return (
              <div key={i} className="absolute pointer-events-none"
                style={{
                  left: f.x * CELL, top: f.y * CELL, width: f.w * CELL, height: f.h * CELL,
                  transform: `translateZ(${cfg.z / 2}px)`,
                  background: cfg.accent ? `linear-gradient(${cfg.bg}, ${cfg.bg})` : cfg.bg,
                  borderRadius: cfg.radius,
                  boxShadow: `0 ${Math.round(cfg.z / 3)}px ${Math.round(cfg.z / 2)}px rgba(15,23,42,0.28)`,
                  outline: cfg.accent ? `${Math.max(2, f.h * CELL * 0.22)}px solid ${cfg.accent}` : 'none',
                  outlineOffset: cfg.accent ? `-${Math.max(2, f.h * CELL * 0.22)}px` : '0',
                }}
              />
            );
          })}

          {/* perimeter walls (low, translucent — dollhouse cutaway) */}
          <Walls w={boardW} h={boardH} />
        </div>
      </div>

      {/* top-left hint */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 dark:bg-[#0F172A]/70 backdrop-blur text-[10px] font-semibold text-[#475569] dark:text-[#CBD5E1] shadow-sm">
        <Move3d size={12} /> Drag to rotate · scroll to explore
      </div>

      {/* controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        {[
          { icon: <RotateCcw size={15} />, fn: () => setRot(r => r - 30), title: 'Rotate left' },
          { icon: <RotateCw size={15} />,  fn: () => setRot(r => r + 30), title: 'Rotate right' },
          { icon: <ZoomIn size={15} />,    fn: () => setZoom(z => Math.min(1.8, z + 0.15)), title: 'Zoom in' },
          { icon: <ZoomOut size={15} />,   fn: () => setZoom(z => Math.max(0.6, z - 0.15)), title: 'Zoom out' },
          { icon: <Maximize2 size={15} />, fn: reset, title: 'Reset view' },
        ].map((b, i) => (
          <button key={i} onClick={b.fn} title={b.title}
            className="w-8 h-8 rounded-xl bg-white/85 dark:bg-[#0F172A]/70 backdrop-blur border border-white/60 dark:border-white/10 flex items-center justify-center text-[#475569] dark:text-[#CBD5E1] hover:bg-white hover:text-[#075DE8] shadow-sm transition-all">
            {b.icon}
          </button>
        ))}
      </div>

      {/* selected-room info card — clickable to open modal */}
      {activeRoom && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-3 px-3.5 py-2.5 rounded-xl bg-white/90 dark:bg-[#0F172A]/85 backdrop-blur border border-white/60 dark:border-white/10 shadow-lg hover:shadow-xl hover:bg-white dark:hover:bg-[#1A2640] transition-all cursor-pointer"
          onClick={() => setShowModal(true)}
          type="button"
        >
          <p className="text-xs font-bold text-[#0F172A] dark:text-white text-left">{activeRoom.name}</p>
          <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] capitalize text-left">
            {ROOM_STYLE[activeRoom.type].label}{activeRoom.area != null ? ` · ${activeRoom.area} m²` : ''}
            {highlightId === activeRoom.id ? ' · Your room' : ''}
          </p>
          <p className="text-[9px] text-[#075DE8] font-semibold mt-1">Click to see assets →</p>
        </motion.button>
      )}

      {/* Beautiful Assets Modal */}
      <AnimatePresence>
        {showModal && activeRoom && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
                {/* Header gradient */}
                <div className="absolute inset-0 h-32 bg-gradient-to-br from-[#075DE8] via-[#0797D8] to-[#0EA5E9]" />

                {/* Content */}
                <div className="relative z-10 bg-white dark:bg-[#111827] px-6 pt-8 pb-6">
                  {/* Close button */}
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#1E2D45] text-[#64748B] hover:text-[#0F172A] transition-colors"
                  >
                    <X size={18} />
                  </button>

                  {/* Room icon and name */}
                  <div className="flex items-center gap-3 mb-6 pt-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center text-white shadow-lg">
                      <Package size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#0F172A] dark:text-white">{activeRoom.name}</h2>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                        {ROOM_STYLE[activeRoom.type].label} {activeRoom.area && `· ${activeRoom.area} m²`}
                      </p>
                    </div>
                  </div>

                  {/* Asset count summary */}
                  <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#075DE8]/10 to-[#0EA5E9]/10 dark:from-[#075DE8]/20 dark:to-[#0EA5E9]/20 border border-[#075DE8]/20 dark:border-[#075DE8]/30">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-[#075DE8]">{roomAssets.length}</span>
                      <span className="text-sm font-semibold text-[#64748B] dark:text-[#94A3B8]">
                        {roomAssets.length === 1 ? 'asset' : 'assets'} in this room
                      </span>
                    </div>
                  </div>

                  {/* Asset list */}
                  {roomAssets.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {roomAssets.map((asset: any, i: number) => (
                        <motion.div
                          key={asset.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#1A2640] border border-[#E6EEF5] dark:border-[#1E2D45] hover:bg-[#EFF6FF] dark:hover:bg-[#1E2D45]"
                        >
                          <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, #075DE8, #0EA5E9)' }}>
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#0F172A] dark:text-white truncate">{asset.name}</p>
                            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">{asset.category}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                asset.condition === 'excellent' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                : asset.condition === 'good' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                              }`}>
                                {asset.condition}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package size={32} className="mx-auto mb-2 text-[#CBD5E1]" opacity={0.5} />
                      <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">No assets in this room</p>
                    </div>
                  )}

                  {/* Close button at bottom */}
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full mt-6 px-4 py-2 rounded-lg bg-[#075DE8] hover:bg-[#0650CC] text-white text-sm font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Four low translucent perimeter walls to frame the plan. */
function Walls({ w, h }: { w: number; h: number }) {
  const H = 42; // wall height px
  const face = 'linear-gradient(rgba(148,163,184,0.55), rgba(100,116,139,0.30))';
  const common: React.CSSProperties = { position: 'absolute', background: face, backfaceVisibility: 'hidden' };
  return (
    <>
      {/* back (top edge) */}
      <div style={{ ...common, left: 0, top: 0, width: w, height: H, transform: `translateY(0) rotateX(-90deg)`, transformOrigin: 'top' }} />
      {/* front (bottom edge) */}
      <div style={{ ...common, left: 0, top: h, width: w, height: H, transform: `rotateX(-90deg)`, transformOrigin: 'top' }} />
      {/* left */}
      <div style={{ ...common, left: 0, top: 0, width: h, height: H, transform: `rotateZ(90deg) rotateX(-90deg)`, transformOrigin: 'top left' }} />
      {/* right */}
      <div style={{ ...common, left: w, top: 0, width: h, height: H, transform: `rotateZ(90deg) rotateX(-90deg)`, transformOrigin: 'top left' }} />
    </>
  );
}

function mix(hex: string): string {
  // lighten toward blue for the active room
  return `color-mix(in srgb, ${hex} 70%, #075DE8 30%)`;
}
