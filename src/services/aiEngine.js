/**
 * Local Heuristic AI Engine for FIXORA
 * Provides smart classification, urgency risk detection, duplicate detection,
 * and automated complaint summaries without external API dependencies.
 */

const CATEGORY_KEYWORDS = {
  'Electrical': [
    'wire', 'wires', 'switch', 'switchboard', 'light', 'lights', 'power', 'spark', 'sparking',
    'voltage', 'socket', 'plug', 'fuse', 'trip', 'tripped', 'fan', 'shock', 'transformer',
    'mcb', 'current', 'illumination', 'bulb', 'led', 'tube light', 'darkness', 'electrocution',
    'generator', 'backup power'
  ],
  'IT / Internet': [
    'wifi', 'wi-fi', 'internet', 'router', 'lan', 'ping', 'connectivity', 'ethernet',
    'access point', 'network', 'slow net', 'disconnect', 'portal', 'server', 'login', 'ssid',
    'ip address', 'cable', 'bandwidth', 'dns', 'firewall', 'gateway'
  ],
  'Hostel': [
    'hostel', 'room', 'bed', 'mattress', 'mess', 'warden', 'geyser', 'cupboard', 'almirah',
    'hostel corridor', 'water cooler', 'hostel mess', 'food', 'hot water', 'door lock',
    'window mesh', 'balcony', 'laundry', 'washing machine'
  ],
  'Cleanliness': [
    'garbage', 'dustbin', 'dirty', 'smell', 'odor', 'clean', 'cleanliness', 'washroom',
    'toilet', 'restroom', 'litter', 'trash', 'waste', 'pest', 'rodent', 'mosquito',
    'cockroach', 'sweep', 'sweeping', 'sanitiz', 'hygiene', 'stain', 'mud', 'unhygienic'
  ],
  'Transport': [
    'bus', 'buses', 'shuttle', 'driver', 'route', 'delay', 'delayed', 'late', 'schedule',
    'seat', 'seats', 'breakdown', 'pickup', 'drop', 'transport', 'commute', 'van', 'traffic'
  ],
  'Laboratory': [
    'microscope', 'chemical', 'chemicals', 'equipment', 'beaker', 'calibration', 'calibrate',
    'pipette', 'apparatus', 'reagent', 'test tube', 'practical', 'instrument', 'burner',
    'bunsen', 'spectrophotometer', 'centrifuge', 'oscilloscope', 'multimeter'
  ],
  'Classroom': [
    'projector', 'mic', 'microphone', 'speaker', 'podium', 'blackboard', 'whiteboard',
    'chalk', 'marker', 'bench', 'benches', 'desk', 'desks', 'smartboard', 'lecture hall',
    'audio', 'hdmi', 'screen', 'lectern'
  ],
  'Maintenance': [
    'ac', 'air conditioner', 'cooling', 'ceiling', 'leak', 'leakage', 'seepage', 'pipe',
    'pipeline', 'plumbing', 'tap', 'flush', 'flush tank', 'paint', 'peeling', 'wall',
    'elevator', 'lift', 'door', 'handle', 'window', 'glass', 'shattered', 'stairs',
    'handrail', 'tiles', 'broken tile', 'drain', 'drainage', 'infrastructure'
  ]
};

const HAZARD_KEYWORDS = [
  'spark', 'sparking', 'fire', 'shock', 'electric shock', 'bare wire', 'exposed wire',
  'hanging wire', 'smoke', 'smoking', 'burning', 'explosion', 'hazard', 'ceiling collapsing',
  'ceiling falling', 'flood', 'flooding', 'severe water leakage', 'open switchboard',
  'gas leak', 'electrocution', 'injury', 'bleeding', 'danger', 'dangerous'
];

const HIGH_URGENCY_KEYWORDS = [
  'exam', 'examination', 'midterm', 'practical', 'deadline', 'test tomorrow',
  'no water', 'dry', 'entire block', 'entire floor', 'all students', '80 students',
  'emergency', 'urgent', 'drinking water', 'pitch dark', 'staircase dark'
];

/**
 * Analyze text and return suggested category, confidence, priority, urgency explanation,
 * suggested department, and summary.
 */
export function analyzeComplaintText(title = '', description = '') {
  const combinedText = `${title} ${description}`.toLowerCase();
  
  // 1. Determine Category Scores
  let bestCategory = 'Maintenance';
  let highestScore = 0;
  const categoryScores = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (combinedText.includes(kw)) {
        // give extra weight if keyword appears in title
        const inTitle = title.toLowerCase().includes(kw);
        score += inTitle ? 3 : 1;
      }
    }
    categoryScores[category] = score;
    if (score > highestScore) {
      highestScore = score;
      bestCategory = category;
    }
  }

  // Calculate confidence (65% to 98%)
  const confidence = highestScore > 0 
    ? Math.min(0.98, Math.max(0.68, 0.65 + (highestScore * 0.06)))
    : 0.70;

  // 2. Determine Priority & Risk / Urgency Explanation
  let priority = 'Medium';
  let riskExplanation = 'Standard facility disruption with normal operational impact.';
  let isHazard = false;

  const foundHazards = HAZARD_KEYWORDS.filter(kw => combinedText.includes(kw));
  const foundHighUrgency = HIGH_URGENCY_KEYWORDS.filter(kw => combinedText.includes(kw));

  if (foundHazards.length > 0) {
    priority = 'Critical';
    isHazard = true;
    riskExplanation = `CRITICAL SAFETY ALERT: Detected severe hazard markers (${foundHazards.slice(0, 2).join(', ')}). Requires immediate on-site response within 2 hours to avoid potential injury or facility damage.`;
  } else if (foundHighUrgency.length > 0) {
    priority = 'High';
    riskExplanation = `HIGH URGENCY DETECTED: Disruption affects active campus operations or academics (${foundHighUrgency.slice(0, 2).join(', ')}). Target resolution within 8 hours.`;
  } else if (highestScore <= 1 && combinedText.length < 30) {
    priority = 'Low';
    riskExplanation = 'Minor or cosmetic issue. Scheduled for resolution within 48 hours.';
  } else {
    priority = 'Medium';
    riskExplanation = 'Routine campus maintenance issue. Standard operational turnaround within 24 hours.';
  }

  // 3. Suggested Department (Mapped from Category)
  const departmentMap = {
    'Electrical': 'Electrical',
    'IT / Internet': 'IT / Internet',
    'Hostel': 'Hostel',
    'Cleanliness': 'Cleanliness',
    'Transport': 'Transport',
    'Laboratory': 'Laboratory',
    'Classroom': 'Classroom',
    'Maintenance': 'Maintenance',
    'Other': 'Maintenance'
  };
  const suggestedDepartment = departmentMap[bestCategory] || 'Maintenance';

  // 4. Generate AI Short Summary
  const shortSummary = generateShortSummary(title, description, bestCategory, priority);

  return {
    suggestedCategory: bestCategory,
    confidence: Math.round(confidence * 100),
    suggestedPriority: priority,
    riskExplanation,
    isHazard,
    suggestedDepartment,
    shortSummary
  };
}

/**
 * Generate a clean 1-line summary from complaint text
 */
function generateShortSummary(title, description, category, priority) {
  if (!title && !description) return 'Pending input...';
  
  const cleanTitle = title.trim();
  if (cleanTitle.length > 10 && cleanTitle.length < 80) {
    return cleanTitle;
  }

  const firstSentence = (description || title).split(/[.\n]/)[0].trim();
  if (firstSentence.length > 15) {
    return firstSentence.length > 90 ? `${firstSentence.substring(0, 87)}...` : firstSentence;
  }

  return `${priority} priority issue in ${category} facility requiring review.`;
}

/**
 * Check for duplicate or highly similar complaints in existing active complaints list
 */
export function checkDuplicateComplaint(newComplaint, existingComplaints = []) {
  if (!newComplaint.title && !newComplaint.description) return null;

  const newText = `${newComplaint.title || ''} ${newComplaint.description || ''} ${newComplaint.location || ''}`.toLowerCase();
  const newWords = new Set(
    newText.split(/\W+/).filter(w => w.length > 3 && !['with', 'from', 'this', 'that', 'have', 'been', 'there', 'please'].includes(w))
  );

  if (newWords.size === 0) return null;

  let bestMatch = null;
  let highestMatchScore = 0;

  for (const item of existingComplaints) {
    // Only check unresolved complaints
    if (['Resolved', 'Rejected'].includes(item.status)) continue;

    const itemText = `${item.title} ${item.description} ${item.location}`.toLowerCase();
    const itemWords = itemText.split(/\W+/).filter(w => w.length > 3);
    
    let matchingWordCount = 0;
    for (const word of itemWords) {
      if (newWords.has(word)) {
        matchingWordCount++;
      }
    }

    // Check location exact or partial match
    let locationMatchBonus = 0;
    if (newComplaint.location && item.location) {
      const locA = newComplaint.location.toLowerCase();
      const locB = item.location.toLowerCase();
      if (locA === locB || locA.includes(locB) || locB.includes(locA)) {
        locationMatchBonus = 3;
      }
    }

    const totalScore = matchingWordCount + locationMatchBonus;
    if (totalScore > highestMatchScore && totalScore >= 4) {
      highestMatchScore = totalScore;
      bestMatch = item;
    }
  }

  if (bestMatch) {
    return {
      isDuplicate: true,
      matchedTicket: bestMatch,
      similarityScore: Math.min(95, Math.round((highestMatchScore / Math.max(newWords.size, 6)) * 100)),
      reason: `Potential duplicate: Similar report #${bestMatch.id} ("${bestMatch.title.slice(0, 45)}...") is currently ${bestMatch.status} in ${bestMatch.location}.`
    };
  }

  return { isDuplicate: false };
}
