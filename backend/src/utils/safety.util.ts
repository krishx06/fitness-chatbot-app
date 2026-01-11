const MEDICAL_KEYWORDS = [
  'diabetes',
  'heart disease',
  'hypertension',
  'asthma',
  'thyroid',
  'pcos',
  'arthritis',

  'injury',
  'fracture',
  'tear',
  'ligament',
  'acl',
  'meniscus',
  'sprain',
  'pain',

  'medicine',
  'medication',
  'tablet',
  'pill',
  'supplement',
  'protein powder',
  'creatine',
  'steroids',
];

export function isUnsafeMedicalQuery(userMessage: string): boolean {
  const message = userMessage.toLowerCase();

  return MEDICAL_KEYWORDS.some(keyword =>
    message.includes(keyword)
  );
}

export function getSafetyRefusalMessage(): string {
  return (
    "I’m not able to provide medical advice or guidance related to injuries, diseases, or medications. " +
    "It would be best to consult a certified doctor or healthcare professional for accurate advice."
  );
}
