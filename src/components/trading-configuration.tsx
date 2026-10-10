import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, ChevronRight, ScanLine, Upload, Volume2, Activity } from "lucide-react";

export type InterfacePreferences = { mode: string; shape: string; font: string; color: string; shade: string; background: boolean; animation: boolean; imageMode: string };
export const defaultInterface: InterfacePreferences = { mode: "Normal Mode", shape: "The Oracle", font: "Regular", color: "pink", shade: "#ed00ed", background: true, animation: false, imageMode: "Robot picture" };
const modes = ["Normal Mode", "Ost Mode", "Beast Mode", "The MCP", "Zen X", "Sztone", "Edge 2.0", "Old School", "The Lumo", "The ETO", "The GZM", "The STE", "The VTX"];
const fonts = ["Regular", "Rubik Glitch", "Old English", "Graffiti", "Orbitron", "Black Ops", "Bangers", "Creepster", "Bungee", "Monoton", "Pixel 8-bit", "Righteous", "Typewriter", "Racing", "Fredoka"];
function Options({ options, value, onChange }: { options: string[]; value: string; onChange: (value: string) => void }) {
  return <div className="grid grid-cols-2 gap-2">{options.map(option => <Button key={option} variant={value === option ? "default" : "ghost"} aria-pressed={value === option} className="h-auto min-h-9 whitespace-normal px-2 text-[11px]" onClick={() => onChange(option)}>{option}</Button>)}</div>;
}
export function TradingConfiguration({ preferences, onChange, robotImage, licensed, onUpload, onRestore, onScanner, onLiveChart, onSpeak, notifications, onNotifications, voice, onVoice }: {
  preferences: InterfacePreferences; onChange: (value: InterfacePreferences) => void; robotImage: string; licensed: boolean; onUpload: () => void; onRestore: () => void; onScanner: () => void; onLiveChart: () => void; onSpeak: () => void; notifications: boolean; onNotifications: (value: boolean) => void; voice: boolean; onVoice: (value: boolean) => void;
}) {
  const set = <K extends keyof InterfacePreferences>(key: K, value: InterfacePreferences[K]) => onChange({ ...preferences, [key]: value });
  return <>
    {licensed && robotImage && <img src={robotImage} alt="Activated robot" className="h-36 w-full rounded-md border border-primary/40 object-cover" />}
    <div className="flex items-center justify-between rounded-md border border-primary/40 p-3 text-xs"><span>Push notifications</span><Switch checked={notifications} onCheckedChange={onNotifications} aria-label="Notifications enabled" /></div>
    <Button disabled={!licensed} onClick={onSpeak} className="h-auto min-h-12 whitespace-normal text-xs"><Volume2 />Tap to listen</Button>
    <Accordion type="multiple" className="space-y-2">
      <AccordionItem value="main" className="configuration-item"><AccordionTrigger>Main interface</AccordionTrigger><AccordionContent><Options options={modes} value={preferences.mode} onChange={value => set("mode", value)} /></AccordionContent></AccordionItem>
      <AccordionItem value="image" className="configuration-item"><AccordionTrigger>Interface image</AccordionTrigger><AccordionContent><Options options={["Robot picture", "Plain background"]} value={preferences.imageMode} onChange={value => set("imageMode", value)} /><div className="mt-3 flex items-center justify-between text-xs">Background picture<Switch checked={preferences.background} onCheckedChange={value => set("background", value)} aria-label="Robot background" /></div></AccordionContent></AccordionItem>
      <AccordionItem value="custom" className="configuration-item"><AccordionTrigger>Custom interface</AccordionTrigger><AccordionContent><Button variant="outline" className="w-full text-xs" disabled={!licensed} onClick={onUpload}><Upload />Upload picture</Button><Button variant="ghost" className="mt-2 w-full text-xs" onClick={onRestore}>Restore robot picture</Button></AccordionContent></AccordionItem>
      <AccordionItem value="shape" className="configuration-item"><AccordionTrigger>Interface shape</AccordionTrigger><AccordionContent><Options options={["The Oracle", "The Cube", "Watch Tower", "AlphaOmega"]} value={preferences.shape} onChange={value => set("shape", value)} /></AccordionContent></AccordionItem>
      <AccordionItem value="colour" className="configuration-item"><AccordionTrigger>Interface colour</AccordionTrigger><AccordionContent><div className="flex flex-wrap justify-center gap-3">{["green", "cyan", "pink", "yellow", "orange", "red", "purple", "blue"].map(color => <Button key={color} variant="outline" size="icon" aria-label={`${color} accent`} aria-pressed={preferences.color === color} className={`trading-${color} size-8 rounded-full border-primary bg-primary text-primary-foreground`} onClick={() => set("color", color)}>{preferences.color === color && <Check />}</Button>)}</div><label className="mt-4 flex items-center justify-between text-xs">Custom shade<Input type="color" aria-label="Custom interface shade" value={preferences.shade} className="h-10 w-16 p-1" onChange={e => onChange({ ...preferences, shade: e.target.value, color: "custom" })} /></label></AccordionContent></AccordionItem>
      <AccordionItem value="font" className="configuration-item"><AccordionTrigger>Interface font</AccordionTrigger><AccordionContent><Options options={fonts} value={preferences.font} onChange={value => set("font", value)} /></AccordionContent></AccordionItem>
      <AccordionItem value="signals" className="configuration-item"><AccordionTrigger>Executed / Signals</AccordionTrigger><AccordionContent><p className="text-xs text-muted-foreground">No execution history available. Live account service is not connected.</p></AccordionContent></AccordionItem>
      <AccordionItem value="animation" className="configuration-item"><AccordionTrigger>Background animation</AccordionTrigger><AccordionContent><div className="flex items-center justify-between text-xs">Animated background<Switch checked={preferences.animation} onCheckedChange={value => set("animation", value)} aria-label="Background animation" /></div></AccordionContent></AccordionItem>
      <AccordionItem value="voice" className="configuration-item"><AccordionTrigger>Activation voice</AccordionTrigger><AccordionContent><Switch checked={voice} onCheckedChange={onVoice} aria-label="Activation voice" /></AccordionContent></AccordionItem>
    </Accordion>
    <Button variant="outline" className="h-12 justify-between text-xs" onClick={onScanner}><ScanLine />Intelligence scanner<ChevronRight /></Button>
    <Button className="mt-2 h-12" onClick={onLiveChart}><Activity />Live chart</Button>
  </>;
}