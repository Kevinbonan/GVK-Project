export const CANDIDATE_FIELD_KEYS = {
  name: ["Ã—Â©Ã—Â", "×©×"],
  role: ["Ã—ÂªÃ—Â¤Ã—Â§Ã—â„¢Ã—â€œ", "×ª×¤×§×™×“"],
  phoneSummary: [
    "Ã—Â¡Ã—â„¢Ã—â€ºÃ—â€¢Ã—Â Ã—Â©Ã—â„¢Ã—â€”Ã—Âª Ã—ËœÃ—Å“Ã—Â¤Ã—â€¢Ã—Å¸",
    "×¡×™×›×•× ×©×™×—×ª ×˜×œ×¤×•×Ÿ",
  ],
  phoneDate: [
    "Ã—ÂªÃ—ÂÃ—Â¨Ã—â„¢Ã—Å¡ Ã—Â©Ã—â„¢Ã—â€”Ã—Âª Ã—ËœÃ—Å“Ã—Â¤Ã—â€¢Ã—Å¸",
    "×ª××¨×™×š ×©×™×—×ª ×˜×œ×¤×•×Ÿ",
  ],
  interviewSummary: [
    "Ã—Â¡Ã—â„¢Ã—â€ºÃ—â€¢Ã—Â Ã—Â¨Ã—â„¢Ã—ÂÃ—â„¢Ã—â€¢Ã—Å¸",
    "×¡×™×›×•× ×¨×™××™×•×Ÿ",
  ],
  yearsExperience: [
    "Ã—Â©Ã—Â Ã—â€¢Ã—Âª Ã—Â Ã—â„¢Ã—Â¡Ã—â„¢Ã—â€¢Ã—Å¸",
    "×©× ×•×ª × ×™×¡×™×•×Ÿ",
  ],
  securityClearance: [
    "Ã—Â¡Ã—â„¢Ã—â€¢Ã—â€¢Ã—â€™ Ã—â€˜Ã—â„¢Ã—ËœÃ—â€”Ã—â€¢Ã—Â Ã—â„¢",
    "×¡×™×•×•×’ ×‘×™×˜×—×•× ×™",
  ],
  safety: ["Ã—â€˜Ã—ËœÃ—â„¢Ã—â€”Ã—â€¢Ã—Âª", "×‘×˜×™×—×•×ª"],
  form101: ["'101'"],
  interviewDate: [
    "Ã—ÂªÃ—ÂÃ—Â¨Ã—â„¢Ã—Å¡ Ã—Â¨Ã—â„¢Ã—ÂÃ—â„¢Ã—â€¢Ã—Å¸",
    "×ª××¨×™×š ×¨×™××™×•×Ÿ",
  ],
  grade: ["Ã—Â¦Ã—â„¢Ã—â€¢Ã—Å¸", "×¦×™×•×Ÿ"],
  fieldExperience: [
    "Ã—Â Ã—â„¢Ã—Â¡Ã—â„¢Ã—â€¢Ã—Å¸ Ã—â€˜Ã—Â©Ã—ËœÃ—â€”",
    "× ×™×¡×™×•×Ÿ ×‘×©×˜×—",
  ],
  additionalInfo: [
    "Ã—Å¾Ã—â„¢Ã—â€œÃ—Â¢ Ã—Â Ã—â€¢Ã—Â¡Ã—Â£",
    "×ž×™×“×¢ × ×•×¡×£",
  ],
};

export function primaryCandidateKey(fieldName) {
  return CANDIDATE_FIELD_KEYS[fieldName][0];
}

export function getCandidateValue(candidate, fieldName) {
  const keys = CANDIDATE_FIELD_KEYS[fieldName] || [];
  for (const key of keys) {
    if (candidate && Object.prototype.hasOwnProperty.call(candidate, key)) {
      return candidate[key];
    }
  }
  return undefined;
}

export function buildEmptyCandidate(today = "") {
  return {
    [primaryCandidateKey("name")]: "",
    [primaryCandidateKey("role")]: "",
    [primaryCandidateKey("phoneSummary")]: "",
    [primaryCandidateKey("phoneDate")]: today,
    [primaryCandidateKey("interviewSummary")]: "",
    [primaryCandidateKey("yearsExperience")]: 0,
    [primaryCandidateKey("securityClearance")]: false,
    [primaryCandidateKey("safety")]: false,
    [primaryCandidateKey("form101")]: false,
    [primaryCandidateKey("interviewDate")]: today,
    [primaryCandidateKey("grade")]: 0,
    [primaryCandidateKey("fieldExperience")]: "",
    [primaryCandidateKey("additionalInfo")]: "",
  };
}
