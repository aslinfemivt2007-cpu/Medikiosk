export const SOURCE_TYPES = Object.freeze([
  'patient_reported',
  'ocr_extracted',
  'staff_entered',
  'ai_generated',
  'practitioner_verified',
  'practitioner_rejected'
]);

export const VERIFICATION_STATUSES = Object.freeze([
  'unverified',
  'needs_confirmation',
  'verified',
  'rejected',
  'not_provided',
  'not_assessed'
]);

function timestampOrNull(value) {
  return value ?? null;
}

export function createResponseMetadata({
  questionId = '',
  value = '',
  sourceType = 'patient_reported',
  verificationStatus = 'unverified',
  sourceReference = null,
  language = 'en',
  inputMethod = 'text',
  createdAt = null,
  updatedAt = null,
  verifiedBy = null,
  verifiedAt = null
} = {}) {
  if (!SOURCE_TYPES.includes(sourceType)) {
    throw new Error(`Unsupported response source type: ${sourceType}`);
  }

  if (!VERIFICATION_STATUSES.includes(verificationStatus)) {
    throw new Error(`Unsupported verification status: ${verificationStatus}`);
  }

  return {
    questionId,
    value,
    sourceType,
    verificationStatus,
    sourceReference,
    language,
    inputMethod,
    createdAt: timestampOrNull(createdAt),
    updatedAt: timestampOrNull(updatedAt),
    verifiedBy,
    verifiedAt: timestampOrNull(verifiedAt)
  };
}

export function createPatientResponse({ questionId, value = '', language = 'en', inputMethod = 'text', verificationStatus, ...rest } = {}) {
  return createResponseMetadata({
    ...rest,
    questionId,
    value,
    language,
    inputMethod,
    sourceType: 'patient_reported',
    verificationStatus: verificationStatus ?? (value === '' ? 'not_provided' : 'unverified')
  });
}

export function createNotProvidedResponse({ questionId, language = 'en', inputMethod = 'text', ...rest } = {}) {
  return createResponseMetadata({
    ...rest,
    questionId,
    value: '',
    language,
    inputMethod,
    sourceType: 'patient_reported',
    verificationStatus: 'not_provided'
  });
}

export function createNotAssessedResponse({ questionId, language = 'en', inputMethod = 'text', ...rest } = {}) {
  return createResponseMetadata({
    ...rest,
    questionId,
    value: '',
    language,
    inputMethod,
    sourceType: 'practitioner_rejected',
    verificationStatus: 'not_assessed'
  });
}
