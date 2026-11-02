import { useRef } from "react";
import { ImageUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";

export type InterfacePreferences = { mode: string; shape: string; font: string; color: string; shade: string; background: boolean; animation: boolean; imageMode: string };
export const defaultInterface: InterfacePreferences = { mode: "Beast Mode", shape: "The Oracle", font: "Regular", color: "orange", shade: "#ff6a00", background: true, animation: false, imageMode: "Robot picture" };

export const tradingModes = ["Beast Mode", "The MCP", "Old School", "The VTX", "Zen X", "The Lumo", "Edge 2.0", "The Eto", "OST Mode", "SZTone", "The GZM", "The STE"];
export const tradingShapes = ["The Oracle", "The Sphere", "The Cube", "The Blade"];
export const tradingFonts = ["Regular", "Rubik Glitch", "Old English", "Graffiti", "Orbitron", "Black Ops", "Bangers", "Creepster", "Bungee", "Monoton", "Pixel 8 Bit", "Righteous", "Typewriter", "Racing", "Fredoka"];
export const tradingColours = ["orange", "green", "blue", "cyan", "yellow", "red", "purple", "custom"];
export const imageModes = ["Robot picture", "Custom picture", "No picture"];

export function shapeClassFor(shape: string) {
  if (shape === "The Cube") return "rounded-xl";
  if (shape === "The Blade") return "rounded-none";
  if (shape === "The Sphere") return "rounded-[3rem]";
  return "rounded-full";
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: InterfacePreferences;
  onPreferences: (next: InterfacePreferences) => void;
  notifications: boolean;
  onNotifications: (value: boolean) => void;
  voice: boolean;
  onVoice: (value: boolean) => void;
  customImage: string;
  onCustomImage: (file: File | undefined) => void;
  onClearCustomImage: () => void;
};

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="configuration-item flex min-h-12 items-center justify-between gap-3 py-1.5"><h3 className="text-[11px] font-bold uppercase tracking-wide">{title}</h3>{children}</div>;
}

function Choice({ value, onChange, options, label }: { value: string; onChange: (value: string) => void; options: string[]; label: string }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="h-9 w-40 border-primary/50 text-xs"><SelectValue placeholder={label} /></SelectTrigger><SelectContent className="trading-theme">{options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select>;
}

export function TradingConfiguration({ open, onOpenChange, preferences, onPreferences, notifications, onNotifications, voice, onVoice, customImage, onCustomImage, onClearCustomImage }: Props) {
  const upload = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<InterfacePreferences>) => onPreferences({ ...preferences, ...patch });
  return <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent side="right" className="trading-theme w-full max-w-xs overflow-y-auto border-primary/40 sm:max-w-sm">
      <SheetTitle className="text-center text-sm font-bold uppercase tracking-widest text-primary">Settings</SheetTitle>
      <SheetDescription className="text-center text-xs">Interface preferences are saved on this device only.</SheetDescription>
      <div className="mt-5 space-y-3">
        <input ref={upload} type="file" accept="image/*" className="hidden" aria-label="Upload custom interface picture" onChange={e => onCustomImage(e.target.files?.[0])} />
        <Row title="Push notifications"><Switch checked={notifications} onCheckedChange={onNotifications} aria-label="Push notifications" /></Row>
        <Row title="Tap to listen"><Switch checked={voice} onCheckedChange={onVoice} aria-label="Voice announcements" /></Row>
        <Row title="Main interface"><Choice value={preferences.mode} onChange={mode => set({ mode })} options={tradingModes} label="Main interface" /></Row>
        <Row title="Interface image"><Choice value={preferences.imageMode} onChange={imageMode => set({ imageMode })} options={imageModes} label="Interface image" /></Row>
        {preferences.imageMode === "Custom picture" && <div className="flex flex-wrap gap-2 pl-1">
          <Button variant="outline" size="sm" className="border-primary/50 text-xs text-primary" onClick={() => upload.current?.click()}><ImageUp />{customImage ? "Replace picture" : "Upload picture"}</Button>
          {customImage && <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={onClearCustomImage}><Trash2 />Remove</Button>}
        </div>}
        <Row title="Interface shape"><Choice value={preferences.shape} onChange={shape => set({ shape })} options={tradingShapes} label="Interface shape" /></Row>
        <Row title="Interface colour"><Choice value={preferences.color} onChange={color => set({ color })} options={tradingColours} label="Interface colour" /></Row>
        {preferences.color === "custom" && <div className="flex items-center gap-3 pl-1"><Input type="color" aria-label="Custom colour" value={preferences.shade} onChange={e => set({ shade: e.target.value })} className="h-9 w-16 cursor-pointer p-1" /><span className="font-mono text-xs text-muted-foreground">{preferences.shade}</span></div>}
        <Row title="Interface font"><Choice value={preferences.font} onChange={font => set({ font })} options={tradingFonts} label="Interface font" /></Row>
        <Row title="Background"><Switch checked={preferences.background} onCheckedChange={background => set({ background })} aria-label="Background picture" /></Row>
        <Row title="Background animation"><Switch checked={preferences.animation} onCheckedChange={animation => set({ animation })} aria-label="Background animation" /></Row>
      </div>
    </SheetContent>
  </Sheet>;
}
