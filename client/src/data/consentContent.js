const englishConsent = {
  title: 'Before you continue',
  intro: 'Please read this information before continuing with your patient case.',
  points: [
    'This application collects information that you provide as a patient.',
    'The information is used to support case documentation and may be reviewed by a healthcare professional.',
    'This application does not independently diagnose conditions or prescribe treatment.',
    'You may skip optional questions.',
    'Voice input is optional. Voice transcriptions should be reviewed and corrected before confirmation.',
    'Consent is separate from your clinical answers.'
  ],
  checkboxLabel: 'I understand this information and consent to continue with this prototype.',
  requiredMessage: 'Please confirm consent before continuing.',
  reviewButton: 'Continue to Final Review'
};

export const consentContent = {
  en: englishConsent,
  ta: {},
  hi: {}
};

export const consentVersion = '1.0';

export function getConsentContent(language = 'en') {
  const selected = consentContent[language];
  return selected?.title ? selected : englishConsent;
}
