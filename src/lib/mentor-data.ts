import { supabase } from "@/integrations/supabase/client";

export type BotRow = { id: string; name: string; image_url: string | null; created_at: string };
export type LicenceRow = {
  id: string; bot_id: string; licence_key: string; customer_name: string | null;
  expires_at: string | null; activated_at: string | null; revoked: boolean; created_at: string;
};

export async function fetchBots() {
  const { data, error } = await supabase.from("bots").select("id,name,image_url,created_at").order("created_at", { ascending: false });
  if (error) throw error;
  return data as BotRow[];
}

export async function fetchLicences() {
  const { data, error } = await supabase.from("licences").select("id,bot_id,licence_key,customer_name,expires_at,activated_at,revoked,created_at").order("created_at", { ascending: false });
  if (error) throw error;
  return data as LicenceRow[];
}

export function isActive(l: LicenceRow) {
  return !l.revoked && (!l.expires_at || new Date(l.expires_at) > new Date());
}

/** Shrinks an uploaded picture to a small square JPEG data URL so it can be stored with the bot. */
export function resizeImage(file: File, size = 320): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Image could not be processed"));
      const s = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("That file is not a valid image"));
    img.src = URL.createObjectURL(file);
  });
}
