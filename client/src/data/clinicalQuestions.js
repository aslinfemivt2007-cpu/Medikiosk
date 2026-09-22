export const complaintOptions = [
  { value: 'chest-pain', labelKey: 'complaintChestPain' },
  { value: 'fever', labelKey: 'complaintFever' },
  { value: 'headache', labelKey: 'complaintHeadache' },
  { value: 'cough', labelKey: 'complaintCough' },
  { value: 'abdominal-pain', labelKey: 'complaintAbdominalPain' },
  { value: 'other', labelKey: 'complaintOther' }
];

export const clinicalQuestions = {
  fever: [
    { id: 'fever-started', labelKey: 'questionWhenStarted', type: 'text', required: true },
    { id: 'fever-temperature', labelKey: 'questionMeasuredTemperature', type: 'number', required: false },
    { id: 'fever-previous', labelKey: 'questionHappenedBefore', type: 'select', required: true, options: ['yes', 'no', 'unknown'] },
    { id: 'fever-other-symptoms', labelKey: 'questionOtherSymptoms', type: 'textarea', required: false }
  ],
  headache: [
    { id: 'headache-started', labelKey: 'questionWhenStarted', type: 'text', required: true },
    { id: 'headache-location', labelKey: 'questionLocation', type: 'text', required: true },
    { id: 'headache-description', labelKey: 'questionDescription', type: 'textarea', required: true },
    { id: 'headache-previous', labelKey: 'questionHappenedBefore', type: 'select', required: true, options: ['yes', 'no', 'unknown'] },
    { id: 'headache-other-symptoms', labelKey: 'questionOtherSymptoms', type: 'textarea', required: false }
  ],
  cough: [
    { id: 'cough-started', labelKey: 'questionWhenStarted', type: 'text', required: true },
    { id: 'cough-character', labelKey: 'questionCoughCharacter', type: 'select', required: true, options: ['dry', 'mucus', 'unknown'] },
    { id: 'cough-previous', labelKey: 'questionHappenedBefore', type: 'select', required: true, options: ['yes', 'no', 'unknown'] },
    { id: 'cough-other-symptoms', labelKey: 'questionOtherSymptoms', type: 'textarea', required: false }
  ],
  'chest-pain': [
    { id: 'chest-pain-started', labelKey: 'questionWhenStarted', type: 'text', required: true },
    { id: 'chest-pain-location', labelKey: 'questionLocation', type: 'text', required: true },
    { id: 'chest-pain-description', labelKey: 'questionDescription', type: 'textarea', required: true },
    { id: 'chest-pain-previous', labelKey: 'questionHappenedBefore', type: 'select', required: true, options: ['yes', 'no', 'unknown'] },
    { id: 'chest-pain-other-symptoms', labelKey: 'questionOtherSymptoms', type: 'textarea', required: false }
  ],
  'abdominal-pain': [
    { id: 'abdominal-pain-started', labelKey: 'questionWhenStarted', type: 'text', required: true },
    { id: 'abdominal-pain-location', labelKey: 'questionLocation', type: 'text', required: true },
    { id: 'abdominal-pain-previous', labelKey: 'questionHappenedBefore', type: 'select', required: true, options: ['yes', 'no', 'unknown'] },
    { id: 'abdominal-pain-other-symptoms', labelKey: 'questionOtherSymptoms', type: 'textarea', required: false }
  ],
  other: [
    { id: 'other-concern', labelKey: 'questionDescribeConcern', type: 'textarea', required: true },
    { id: 'other-started', labelKey: 'questionWhenStarted', type: 'text', required: true },
    { id: 'other-previous', labelKey: 'questionHappenedBefore', type: 'select', required: true, options: ['yes', 'no', 'unknown'] },
    { id: 'other-symptoms', labelKey: 'questionOtherSymptoms', type: 'textarea', required: false }
  ]
};

export function getQuestionsForComplaint(complaint) {
  return clinicalQuestions[complaint] ?? [];
}

export function getDocumentationGuidance(complaint, answers, translateText) {
  return getQuestionsForComplaint(complaint)
    .filter((question) => !String(answers[question.id] ?? '').trim())
    .map((question) => ({
      id: question.id,
      required: question.required,
      text: translateText('documentationMissingPrefix') + translateText(question.labelKey).toLowerCase()
    }));
}
