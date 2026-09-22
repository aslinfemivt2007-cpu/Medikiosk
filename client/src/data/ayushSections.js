export const ayushSections = [
  {
    id: 'presenting-complaint',
    title: 'Presenting Complaint',
    description: 'Patient-reported description of the main concern for this visit.',
    audience: 'patient',
    order: 1,
    enabled: true,
    requiresPractitionerReview: true
  },
  {
    id: 'history-of-present-complaint',
    title: 'History of Present Complaint',
    description: 'Patient-reported timing, pattern, progression, and context of the concern.',
    audience: 'patient',
    order: 2,
    enabled: true,
    requiresPractitionerReview: true
  },
  {
    id: 'personal-history',
    title: 'Personal History',
    description: 'Relevant personal information provided by the patient.',
    audience: 'patient',
    order: 3,
    enabled: true,
    requiresPractitionerReview: true
  },
  {
    id: 'ahara',
    title: 'Ahara',
    description: 'Patient-reported eating patterns and food-related experiences.',
    audience: 'patient',
    order: 4,
    enabled: true,
    requiresPractitionerReview: true
  },
  {
    id: 'vihara',
    title: 'Vihara',
    description: 'Patient-reported daily activity, routine, and lifestyle information.',
    audience: 'patient',
    order: 5,
    enabled: true,
    requiresPractitionerReview: true
  },
  {
    id: 'sleep',
    title: 'Sleep',
    description: 'Patient-reported sleep pattern and recent changes.',
    audience: 'patient',
    order: 6,
    enabled: true,
    requiresPractitionerReview: true
  },
  {
    id: 'appetite',
    title: 'Appetite',
    description: 'Patient-reported appetite and recent changes.',
    audience: 'patient',
    order: 7,
    enabled: true,
    requiresPractitionerReview: true
  },
  {
    id: 'bowel-habits',
    title: 'Bowel Habits',
    description: 'Patient-reported bowel habits and changes.',
    audience: 'patient',
    order: 8,
    enabled: true,
    requiresPractitionerReview: true
  },
  {
    id: 'urinary-habits',
    title: 'Urinary Habits',
    description: 'Patient-reported urinary habits and changes.',
    audience: 'patient',
    order: 9,
    enabled: true,
    requiresPractitionerReview: true
  },
  {
    id: 'previous-treatment-history',
    title: 'Previous Treatment History',
    description: 'Patient-reported information about previous care or treatment.',
    audience: 'patient',
    order: 10,
    enabled: true,
    requiresPractitionerReview: true
  },
  {
    id: 'trividha-pariksha',
    title: 'Trividha Pariksha',
    description: 'Reserved for practitioner-entered observations. This prototype does not perform the examination.',
    audience: 'practitioner',
    order: 11,
    enabled: false,
    requiresPractitionerReview: true
  },
  {
    id: 'ashtavidha-pariksha',
    title: 'Ashtavidha Pariksha',
    description: 'Reserved for practitioner-entered observations. No findings are inferred from patient responses.',
    audience: 'practitioner',
    order: 12,
    enabled: false,
    requiresPractitionerReview: true
  },
  {
    id: 'dashavidha-pariksha',
    title: 'Dashavidha Pariksha',
    description: 'Reserved for practitioner assessment and verification. This prototype does not assign classifications.',
    audience: 'practitioner',
    order: 13,
    enabled: false,
    requiresPractitionerReview: true
  },
  {
    id: 'practitioner-observations',
    title: 'Practitioner Observations',
    description: 'Reserved for authorized practitioner or staff entry and review.',
    audience: 'practitioner',
    order: 14,
    enabled: false,
    requiresPractitionerReview: true
  }
];

export const patientAyushSections = ayushSections.filter((section) => section.audience === 'patient');
export const practitionerAyushSections = ayushSections.filter((section) => section.audience === 'practitioner');

export function getEnabledPatientSections() {
  return patientAyushSections
    .filter((section) => section.enabled)
    .sort((first, second) => first.order - second.order);
}
