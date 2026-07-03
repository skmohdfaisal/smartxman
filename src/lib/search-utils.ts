// src/lib/search-utils.ts

export const SEARCH_SYNONYMS: Record<string, string[]> = {
  // Audio
  'mic': ['mic', 'microphone'],
  'mics': ['mic', 'microphone', 'mics'],
  'earphone': ['earphone', 'earphones', 'earbuds', 'headphones', 'iem', 'headset', 'tws', 'airpods'],
  'earphones': ['earphone', 'earphones', 'earbuds', 'headphones', 'iem', 'headset', 'tws', 'airpods'],
  'headphone': ['headphone', 'headphones', 'headset', 'earphones', 'over-ear', 'on-ear', 'cans'],
  'headphones': ['headphone', 'headphones', 'headset', 'earphones', 'over-ear', 'on-ear', 'cans'],
  'speaker': ['speaker', 'speakers', 'soundbar', 'audio'],
  'speakers': ['speaker', 'speakers', 'soundbar', 'audio'],
  
  // Peripherals
  'keyboard': ['keyboard', 'keyboards', 'mechanical keyboard', 'keeb'],
  'keyboards': ['keyboard', 'keyboards', 'mechanical keyboard', 'keeb'],
  'mouse': ['mouse', 'mice', 'trackball'],
  'mice': ['mouse', 'mice', 'trackball'],
  'webcam': ['webcam', 'camera', 'cam'],
  'camera': ['camera', 'webcam', 'dslr', 'mirrorless'],
  
  // Displays & Devices
  'monitor': ['monitor', 'monitors', 'display', 'screen'],
  'monitors': ['monitor', 'monitors', 'display', 'screen'],
  'laptop': ['laptop', 'laptops', 'notebook', 'macbook'],
  'laptops': ['laptop', 'laptops', 'notebook', 'macbook'],
  'pc': ['pc', 'desktop', 'computer', 'tower'],
  'desktop': ['pc', 'desktop', 'computer', 'tower'],
  'computer': ['pc', 'desktop', 'computer', 'tower'],
  'ipad': ['ipad', 'tablet', 'tab'],
  'tablet': ['tablet', 'ipad', 'tab'],
  'phone': ['phone', 'smartphone', 'mobile', 'iphone', 'android'],
  'smartphone': ['phone', 'smartphone', 'mobile', 'iphone', 'android'],
  
  // Accessories & Power
  'cable': ['cable', 'cables', 'wire', 'cord'],
  'cables': ['cable', 'cables', 'wire', 'cord'],
  'charger': ['charger', 'chargers', 'adapter', 'power brick', 'power adapter'],
  'chargers': ['charger', 'chargers', 'adapter', 'power brick', 'power adapter'],
  'powerbank': ['powerbank', 'power bank', 'portable charger', 'battery pack', 'power brick'],
  
  // Furniture & Environment
  'desk': ['desk', 'desks', 'table', 'standing desk'],
  'desks': ['desk', 'desks', 'table', 'standing desk'],
  'chair': ['chair', 'chairs', 'seat', 'ergonomic chair'],
  'chairs': ['chair', 'chairs', 'seat', 'ergonomic chair'],
  'light': ['light', 'lights', 'lighting', 'lamp', 'rgb', 'led'],
  'lights': ['light', 'lights', 'lighting', 'lamp', 'rgb', 'led'],
  'rgb': ['rgb', 'lighting', 'lights', 'led'],
  'led': ['led', 'lighting', 'lights', 'rgb'],
  
  // Storage & Extras
  'ssd': ['ssd', 'storage', 'hard drive', 'flash drive'],
  'hdd': ['hdd', 'storage', 'hard drive', 'harddisk'],
  'storage': ['storage', 'ssd', 'hdd', 'hard drive', 'drive', 'pendrive', 'flash drive'],
  'stand': ['stand', 'mount', 'arm', 'holder']
};

/**
 * Calculates a fuzzy similarity score between a search query and a target string.
 * @param query The user's search query (e.g. "laptp")
 * @param target The target string to match against (e.g. "laptop")
 * @returns A score between 0 and 1, where 1 is an exact match
 */
export function fuzzyMatchScore(query: string, target: string): number {
  if (!query || !target) return 0;
  
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  
  if (q === t) return 1.0;
  if (t.includes(q)) return 0.8 + (q.length / t.length) * 0.2; // Substring match gets high score

  // Basic Levenshtein distance for typos (if query > 3 chars)
  if (q.length > 3) {
    let matches = 0;
    let i = 0, j = 0;
    
    // Very simple sequential character matching
    while (i < q.length && j < t.length) {
      if (q[i] === t[j]) {
        matches++;
        i++;
        j++;
      } else {
        j++; // skip character in target
      }
    }
    
    const score = matches / Math.max(q.length, t.length);
    if (score > 0.7) return score * 0.7; // penalize slightly for being fuzzy
  }

  return 0;
}

/**
 * Normalizes a term by checking synonyms and returning singular variants
 */
export function expandSearchTerm(term: string): string[] {
  const t = term.toLowerCase();
  const singularTerm = (t.length > 3 && t.endsWith('s') && !t.endsWith('ss')) 
    ? t.slice(0, -1) 
    : t;
    
  return SEARCH_SYNONYMS[t] || SEARCH_SYNONYMS[singularTerm] || [t, singularTerm];
}
