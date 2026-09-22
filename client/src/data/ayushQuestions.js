const emptyTranslation = { question: '', options: [] };

function patientQuestion({ id, sectionId, question, inputType = 'text', required = false, options = [], complaintTypes = ['all'], dependency = null }) {
  return {
    id,
    sectionId,
    complaintTypes,
    translations: {
      en: { question, options },
      ta: { ...emptyTranslation },
      hi: { ...emptyTranslation }
    },
    inputType,
    required,
    audience: 'patient',
    approved: false,
    requiresPractitionerReview: true,
    version: 1,
    dependency
  };
}

function practitionerPlaceholder({ id, sectionId, title }) {
  return {
    id,
    sectionId,
    complaintTypes: ['all'],
    translations: {
      en: { question: title, options: [] },
      ta: { ...emptyTranslation },
      hi: { ...emptyTranslation }
    },
    inputType: 'textarea',
    required: false,
    audience: 'practitioner',
    approved: false,
    requiresPractitionerReview: true,
    version: 1,
    dependency: null
  };
}

export const ayushQuestions = [
  patientQuestion({
    id: 'presenting-complaint-main',
    sectionId: 'presenting-complaint',
    question: 'What is the main concern you would like to share?',
    inputType: 'textarea',
    required: true
  }),
  patientQuestion({
    id: 'history-complaint-duration',
    sectionId: 'history-of-present-complaint',
    question: 'How long have you experienced this concern?',
    required: false
  }),
  patientQuestion({
    id: 'history-complaint-onset',
    sectionId: 'history-of-present-complaint',
    question: 'How did this concern begin, as you remember it?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'history-complaint-frequency',
    sectionId: 'history-of-present-complaint',
    question: 'How often does this concern occur?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'history-complaint-progression',
    sectionId: 'history-of-present-complaint',
    question: 'How has this concern changed over time?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'history-complaint-aggravating-factors',
    sectionId: 'history-of-present-complaint',
    question: 'Is there anything that appears to worsen this concern?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'history-complaint-relieving-factors',
    sectionId: 'history-of-present-complaint',
    question: 'Is there anything that appears to relieve this concern?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'history-complaint-previous-occurrence',
    sectionId: 'history-of-present-complaint',
    question: 'Has a similar concern happened before?',
    inputType: 'select',
    options: ['Yes', 'No', "I don't know"]
  }),
  patientQuestion({
    id: 'ahara-eating-patterns',
    sectionId: 'ahara',
    question: 'How would you describe your usual eating pattern?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'ahara-appetite',
    sectionId: 'appetite',
    question: 'How has your appetite been recently?',
    inputType: 'select',
    options: ['Usual for me', 'More than usual', 'Less than usual', 'Changes from day to day']
  }),
  patientQuestion({
    id: 'ahara-food-related-changes',
    sectionId: 'ahara',
    question: 'Have you noticed any changes related to eating or drinking?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'ahara-food-worsens-concern',
    sectionId: 'ahara',
    question: 'Is there any food or drink that appears to worsen the concern?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'vihara-daily-activity',
    sectionId: 'vihara',
    question: 'How would you describe your usual daily activity?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'vihara-work-study-routine',
    sectionId: 'vihara',
    question: 'Has your work or study routine changed recently?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'vihara-exercise',
    sectionId: 'vihara',
    question: 'What type of physical activity or exercise do you usually do?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'vihara-lifestyle-changes',
    sectionId: 'vihara',
    question: 'Have there been any other relevant lifestyle changes?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'sleep-pattern',
    sectionId: 'sleep',
    question: 'How would you describe your recent sleep pattern?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'sleep-disturbance',
    sectionId: 'sleep',
    question: 'Have you noticed a recent change or difficulty with sleep?',
    inputType: 'select',
    options: ['Yes', 'No', "I don't know"]
  }),
  patientQuestion({
    id: 'sleep-disturbance-details',
    sectionId: 'sleep',
    question: 'Please describe the sleep difficulty in your own words.',
    inputType: 'textarea',
    required: true,
    dependency: { questionId: 'sleep-disturbance', operator: 'equals', value: 'Yes' }
  }),
  patientQuestion({
    id: 'appetite-changes',
    sectionId: 'appetite',
    question: 'Have you noticed a change in your appetite?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'appetite-change',
    sectionId: 'appetite',
    question: 'Have you noticed a recent change in appetite?',
    inputType: 'select',
    options: ['Yes', 'No', "I don't know"]
  }),
  patientQuestion({
    id: 'appetite-change-details',
    sectionId: 'appetite',
    question: 'Please describe the appetite change in your own words.',
    inputType: 'textarea',
    required: true,
    dependency: { questionId: 'appetite-change', operator: 'equals', value: 'Yes' }
  }),
  patientQuestion({
    id: 'bowel-habits',
    sectionId: 'bowel-habits',
    question: 'Is there anything about your usual bowel habits that you would like to report?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'bowel-change',
    sectionId: 'bowel-habits',
    question: 'Have you noticed a recent change in your bowel habits?',
    inputType: 'select',
    options: ['Yes', 'No', "I don't know"]
  }),
  patientQuestion({
    id: 'bowel-change-details',
    sectionId: 'bowel-habits',
    question: 'Please describe the bowel-habit change in your own words.',
    inputType: 'textarea',
    required: true,
    dependency: { questionId: 'bowel-change', operator: 'equals', value: 'Yes' }
  }),
  patientQuestion({
    id: 'urinary-habits',
    sectionId: 'urinary-habits',
    question: 'Is there anything about your usual urinary habits that you would like to report?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'urinary-change',
    sectionId: 'urinary-habits',
    question: 'Have you noticed a recent change in your urinary habits?',
    inputType: 'select',
    options: ['Yes', 'No', "I don't know"]
  }),
  patientQuestion({
    id: 'urinary-change-details',
    sectionId: 'urinary-habits',
    question: 'Please describe the urinary-habit change in your own words.',
    inputType: 'textarea',
    required: true,
    dependency: { questionId: 'urinary-change', operator: 'equals', value: 'Yes' }
  }),
  patientQuestion({
    id: 'previous-treatment-history',
    sectionId: 'previous-treatment-history',
    question: 'Have you received any previous care or treatment related to this concern?',
    inputType: 'select',
    options: ['Yes', 'No', "I don't know"]
  }),
  patientQuestion({
    id: 'previous-treatment-details',
    sectionId: 'previous-treatment-history',
    question: 'Please describe the previous care or treatment in your own words.',
    inputType: 'textarea',
    required: true,
    dependency: { questionId: 'previous-treatment-history', operator: 'equals', value: 'Yes' }
  }),
  patientQuestion({
    id: 'personal-history-relevant',
    sectionId: 'personal-history',
    question: 'Is there any relevant personal or family history you would like the practitioner to know?',
    inputType: 'textarea'
  }),
  patientQuestion({
    id: 'personal-history-other-information',
    sectionId: 'personal-history',
    question: 'Is there anything else you would like the practitioner to know?',
    inputType: 'textarea'
  }),
  practitionerPlaceholder({ id: 'trividha-practitioner-entry', sectionId: 'trividha-pariksha', title: 'Practitioner-entered Trividha Pariksha observation' }),
  practitionerPlaceholder({ id: 'ashtavidha-practitioner-entry', sectionId: 'ashtavidha-pariksha', title: 'Practitioner-entered Ashtavidha Pariksha observation' }),
  practitionerPlaceholder({ id: 'dashavidha-practitioner-entry', sectionId: 'dashavidha-pariksha', title: 'Practitioner-entered Dashavidha Pariksha observation' }),
  practitionerPlaceholder({ id: 'practitioner-observation-entry', sectionId: 'practitioner-observations', title: 'Practitioner observation' })
];

export const patientAyushQuestions = ayushQuestions.filter((question) => question.audience === 'patient');
export const practitionerAyushQuestions = ayushQuestions.filter((question) => question.audience === 'practitioner');

export function getQuestionTranslation(question, language = 'en') {
  return question.translations[language]?.question
    ? question.translations[language]
    : question.translations.en;
}

export function getPatientAyushQuestions({ sectionId, complaintType = 'all' } = {}) {
  return patientAyushQuestions.filter((question) => {
    const sectionMatches = !sectionId || question.sectionId === sectionId;
    const complaintMatches = question.complaintTypes.includes('all') || question.complaintTypes.includes(complaintType);
    return sectionMatches && complaintMatches;
  });
}
