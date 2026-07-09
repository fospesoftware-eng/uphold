import { useRef, useState, useCallback } from 'react';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Maximize2, Move3d } from 'lucide-react';
import { getFloorPlan, ROOM_STYLE, type Furniture } from './floorPlanData';

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
  const drag = useRef<{ x: number; y: number; rot: number; tilt: number } | null>(null);

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

  const reset = () => { setRot(-32); setTilt(56); setZoom(1); setSelected(null); };

  const active = selected ?? highlightId ?? null;
  const activeRoom = plan.rooms.find(r => r.id === active);

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

      {/* selected-room info card */}
      {activeRoom && (
        <div className="absolute bottom-3 left-3 px-3.5 py-2.5 rounded-xl bg-white/90 dark:bg-[#0F172A]/85 backdrop-blur border border-white/60 dark:border-white/10 shadow-lg">
          <p className="text-xs font-bold text-[#0F172A] dark:text-white">{activeRoom.name}</p>
          <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] capitalize">
            {ROOM_STYLE[activeRoom.type].label}{activeRoom.area != null ? ` · ${activeRoom.area} m²` : ''}
            {highlightId === activeRoom.id ? ' · Your room' : ''}
          </p>
        </div>
      )}
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
