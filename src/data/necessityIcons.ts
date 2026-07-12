export const necessityIconMap: Record<string, string> = {
  "n1": "location_on",
  "n2": "restaurant",
  "n3": "photo_camera",
  "n4": "music_note",
  "n5": "palette",
  "n6": "event_available",
  "n7": "favorite",
  "n8": "videocam",
  "n9": "photo_frame",
  "n10": "mail",
  "n11": "globe",
  "n12": "directions_car",
  "n13": "card_giftcard",
  "n14": "person",
  "n15": "mic",
  "n16": "live_tv",
};

export const necessityColors: Record<string, { bg: string; text: string; border: string }> = {
  "n1": { bg: "bg-orange/10", text: "text-orange", border: "border-orange/20" },
  "n2": { bg: "bg-pink/10", text: "text-pink", border: "border-pink/20" },
  "n3": { bg: "bg-green/10", text: "text-green", border: "border-green/20" },
  "n4": { bg: "bg-gold/20", text: "text-amber-800", border: "border-gold/30" },
  "n5": { bg: "bg-orange/10", text: "text-orange", border: "border-orange/20" },
  "n6": { bg: "bg-pink/10", text: "text-pink", border: "border-pink/20" },
  "n7": { bg: "bg-green/10", text: "text-green", border: "border-green/20" },
  "n8": { bg: "bg-gold/20", text: "text-amber-800", border: "border-gold/30" },
  "n9": { bg: "bg-orange/10", text: "text-orange", border: "border-orange/20" },
  "n10": { bg: "bg-pink/10", text: "text-pink", border: "border-pink/20" },
  "n11": { bg: "bg-green/10", text: "text-green", border: "border-green/20" },
  "n12": { bg: "bg-gold/20", text: "text-amber-800", border: "border-gold/30" },
  "n13": { bg: "bg-orange/10", text: "text-orange", border: "border-orange/20" },
  "n14": { bg: "bg-pink/10", text: "text-pink", border: "border-pink/20" },
  "n15": { bg: "bg-green/10", text: "text-green", border: "border-green/20" },
  "n16": { bg: "bg-gold/20", text: "text-amber-800", border: "border-gold/30" },
};

export function getNecessityIcon(necessityId: string, customIcon?: string): string {
  if (customIcon) return customIcon;
  return necessityIconMap[necessityId] || "checklist";
}

export function getNecessityColor(necessityId: string) {
  return necessityColors[necessityId] || { bg: "bg-cream", text: "text-amber-800", border: "border-gold/20" };
}
