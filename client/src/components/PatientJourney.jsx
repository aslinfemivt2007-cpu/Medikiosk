import { useState } from 'react';
import { languages } from '../data/translations.js';
import { complaintOptions } from '../data/clinicalQuestions.js';
import { getEnabledPatientSections } from '../data/ayushSections.js';
import { getPatientAyushQuestions, getQuestionTranslation } from '../data/ayushQuestions.js';
import { createNotProvidedResponse, createPatientResponse } from '../utils/sourceMetadata.js';
import { getActiveQuestions } from '../utils/questionDependencies.js';
import ConsentPanel from './ConsentPanel.jsx';
import VoiceResponseField from './VoiceResponseField.jsx';
import { consentVersion } from '../data/consentContent.js';

const initialFormData = {
  patientName: '',
  age: '',
  sex: '',
  department: '',
  referenceNumber: ''
};

const demoPatient = {
  id: 'DEMO-PATIENT-001',
  name: 'Demo Patient',
  age: '42',
  sex: 'Prefer not to say',
  previousVisit: '15 August 2026'
};

const steps = [
  { number: '01', label: 'journeyLanguageStep' },
  { number: '02', label: 'journeyVisitStep' },
  { number: '03', label: 'journeyDetailsStep' },
  { number: '04', label: 'journeyComplaintStep' },
  { number: '05', label: 'journeyQuestionsStep' },
  { number: '06', label: 'journeyConsentStep' },
  { number: '07', label: 'journeySummaryStep' }
];

function FieldError({ id, message }) {
  if (!message) {
    return null;
  }

  return <p className="field-error" id={id} role="alert">{message}</p>;
}

function PatientJourney({ language, onLanguageChange, onExit, translateText }) {
  const [step, setStep] = useState(0);
  const [visitType, setVisitType] = useState('');
  const [formData, setFormData] = useState(initialFormData);
  const [patientId, setPatientId] = useState('');
  const [demoPatientSelected, setDemoPatientSelected] = useState(false);
  const [complaint, setComplaint] = useState('');
  const [otherComplaint, setOtherComplaint] = useState('');
  const [questionResponses, setQuestionResponses] = useState({});
  const [, setPendingVoiceResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [registrationReady, setRegistrationReady] = useState(false);
  const [consent, setConsent] = useState({ consentGiven: false, consentVersion, consentLanguage: language, consentTimestamp: null, consentMethod: 'checkbox' });
  const [consentError, setConsentError] = useState('');
  const patientSections = getEnabledPatientSections();
  const configuredQuestions = patientSections.flatMap((section) => getPatientAyushQuestions({
    sectionId: section.id,
    complaintType: complaint
  }));
  const questions = getActiveQuestions(configuredQuestions, questionResponses);
  const documentationGuidance = questions
    .filter((question) => !String(questionResponses[question.id]?.value ?? '').trim())
    .map((question) => ({
      id: question.id,
      text: `${translateText('documentationMissingPrefix')}${getQuestionTranslation(question, language).question.toLowerCase()}`
    }));

  const updateFormData = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }));
    setRegistrationReady(false);
  };

  const validateVisitType = () => {
    if (visitType) {
      return true;
    }

    setErrors({ visitType: translateText('visitTypeRequired') });
    return false;
  };

  const validateRegistration = () => {
    const nextErrors = {};
    const age = Number(formData.age);

    if (!formData.patientName.trim()) {
      nextErrors.patientName = translateText('patientNameRequired');
    }

    if (!formData.age) {
      nextErrors.age = translateText('ageRequired');
    } else if (!Number.isInteger(age) || age < 0 || age > 120) {
      nextErrors.age = translateText('ageInvalid');
    }

    if (!formData.sex) {
      nextErrors.sex = translateText('sexRequired');
    }

    if (!formData.department) {
      nextErrors.department = translateText('departmentRequired');
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateReturningPatient = () => {
    if (patientId.trim() && demoPatientSelected) {
      return true;
    }

    setErrors({ patientId: translateText('demoPatientRequired') });
    return false;
  };

  const validateComplaint = () => {
    if (!complaint) {
      setErrors({ complaint: translateText('complaintRequired') });
      return false;
    }

    if (complaint === 'other' && !otherComplaint.trim()) {
      setErrors({ otherComplaint: translateText('otherComplaintRequired') });
      return false;
    }

    return true;
  };

  const updateQuestionAnswer = (questionId, value) => {
    const currentResponse = questionResponses[questionId];
    const now = new Date().toISOString();
    const response = createPatientResponse({
      questionId,
      value,
      language,
      inputMethod: 'text',
      createdAt: currentResponse?.createdAt ?? now,
      updatedAt: now,
      sourceReference: null,
      verifiedBy: null,
      verifiedAt: null
    });
    setQuestionResponses((currentResponses) => ({ ...currentResponses, [questionId]: response }));
    setErrors((currentErrors) => ({ ...currentErrors, [questionId]: '' }));
  };

  const updateVoiceAnswer = (questionId, value) => {
    const currentResponse = questionResponses[questionId];
    const now = new Date().toISOString();
    const response = createPatientResponse({
      questionId,
      value,
      language,
      inputMethod: 'voice',
      verificationStatus: 'unverified',
      createdAt: currentResponse?.createdAt ?? now,
      updatedAt: now,
      sourceReference: null,
      verifiedBy: null,
      verifiedAt: null
    });
    setQuestionResponses((currentResponses) => ({ ...currentResponses, [questionId]: response }));
    setPendingVoiceResponses((currentResponses) => {
      const nextResponses = { ...currentResponses };
      delete nextResponses[questionId];
      return nextResponses;
    });
    setErrors((currentErrors) => ({ ...currentErrors, [questionId]: '' }));
  };

  const validateQuestions = () => {
    const nextErrors = {};

    questions.forEach((question) => {
      if (question.required && !String(questionResponses[question.id]?.value ?? '').trim()) {
        nextErrors[question.id] = translateText('questionRequired');
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = () => {
    if (step === 1 && !validateVisitType()) {
      return;
    }

    if (step === 2) {
      const isValid = visitType === 'returning' ? validateReturningPatient() : validateRegistration();
      if (isValid) {
        setRegistrationReady(true);
        setErrors({});
        setStep((currentStep) => currentStep + 1);
      }
      return;
    }

    if (step === 3) {
      if (validateComplaint()) {
        setErrors({});
        setStep((currentStep) => currentStep + 1);
      }
      return;
    }

    if (step === 4) {
      if (validateQuestions()) {
        setErrors({});
        setStep((currentStep) => currentStep + 1);
      }
      return;
    }

    if (step === 5) {
      if (!consent.consentGiven) {
        setConsentError(translateText('consentRequired'));
        return;
      }
      setConsentError('');
      setStep((currentStep) => currentStep + 1);
      return;
    }

    if (step === 6) {
      return;
    }

    setErrors({});
    setStep((currentStep) => currentStep + 1);
  };

  const handleBack = () => {
    setErrors({});
    setRegistrationReady(false);
    if (step === 0) {
      onExit();
      return;
    }

    setStep((currentStep) => currentStep - 1);
  };

  const selectDemoPatient = () => {
    setPatientId(demoPatient.id);
    setDemoPatientSelected(true);
    setErrors({});
  };

  const renderQuestionInput = (question) => {
    const value = questionResponses[question.id]?.value ?? '';
    const translation = getQuestionTranslation(question, language);
    const commonProps = {
      value,
      onChange: (event) => updateQuestionAnswer(question.id, event.target.value),
      'aria-invalid': Boolean(errors[question.id]),
      'aria-describedby': `${question.id}-error`
    };

    if (question.inputType === 'select') {
      return (
        <select {...commonProps}>
          <option value="">{translateText('selectOption')}</option>
          {translation.options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    if (question.inputType === 'textarea') {
      return (
        <VoiceResponseField
          value={value}
          onManualChange={commonProps.onChange}
          onVoicePending={(pendingValue) => {
            const now = new Date().toISOString();
            setPendingVoiceResponses((currentResponses) => ({
              ...currentResponses,
              [question.id]: createPatientResponse({
                questionId: question.id,
                value: pendingValue,
                language,
                inputMethod: 'voice',
                verificationStatus: 'needs_confirmation',
                createdAt: currentResponses[question.id]?.createdAt ?? now,
                updatedAt: now,
                sourceReference: null,
                verifiedBy: null,
                verifiedAt: null
              })
            }));
          }}
          onVoiceClear={() => setPendingVoiceResponses((currentResponses) => {
            const nextResponses = { ...currentResponses };
            delete nextResponses[question.id];
            return nextResponses;
          })}
          onVoiceConfirm={(confirmedValue) => updateVoiceAnswer(question.id, confirmedValue)}
          language={language}
          translateText={translateText}
          inputId={question.id}
          errorId={`${question.id}-error`}
          invalid={Boolean(errors[question.id])}
        />
      );
    }

    return <input {...commonProps} type={question.inputType} />;
  };

  const displayQuestionAnswer = (question) => {
    const response = questionResponses[question.id] ?? createNotProvidedResponse({
      questionId: question.id,
      language
    });
    const answer = response.value;
    if (!answer) {
      return { value: translateText('notProvided'), response };
    }

    if (question.inputType === 'select') {
      return {
        value: answer,
        response
      };
    }

    return { value: answer, response };
  };

  const patientSummary = visitType === 'returning'
    ? [
      ['summaryPatientName', demoPatient.name],
      ['summaryAge', demoPatient.age],
      ['summarySex', demoPatient.sex],
      ['summaryPreviousVisit', demoPatient.previousVisit],
      ['summaryPatientId', demoPatient.id]
    ]
    : [
      ['summaryPatientName', formData.patientName],
      ['summaryAge', formData.age],
      ['summarySex', translateText(`summarySexValue${formData.sex}`)],
      ['summaryDepartment', translateText(`summaryDepartmentValue${formData.department}`)],
      ['summaryReference', formData.referenceNumber || translateText('notProvided')]
    ];

  return (
    <main className="journey-main">
      <section className="journey-header" aria-labelledby="journey-title">
        <div>
          <p className="section-kicker">MediKiosk / Patient entry</p>
          <h1 id="journey-title">{translateText('journeyTitle')}</h1>
          <p>{translateText('journeyIntro')}</p>
        </div>
        <p className="prototype-label">{translateText('prototypeLabel')}</p>
      </section>

      <nav className="progress-indicator" aria-label={translateText('progressLabel')}>
        {steps.map((journeyStep, index) => (
          <div className={`progress-step ${index === step ? 'is-current' : ''} ${index < step ? 'is-complete' : ''}`} key={journeyStep.label}>
            <span>{journeyStep.number}</span>
            <strong>{translateText(journeyStep.label)}</strong>
          </div>
        ))}
      </nav>

      <section className="journey-panel" aria-live="polite">
        {step === 0 && (
          <div className="journey-step-content">
            <div className="journey-step-heading">
              <p className="section-kicker">Step 1</p>
              <h2>{translateText('chooseLanguageTitle')}</h2>
              <p>{translateText('chooseLanguageCopy')}</p>
            </div>
            <label className="form-field language-field">
              <span>{translateText('languageLabel')}</span>
              <select value={language} onChange={(event) => onLanguageChange(event.target.value)}>
                {languages.map((option) => (
                  <option key={option.code} value={option.code}>{option.label}</option>
                ))}
              </select>
            </label>
            <p className="safe-copy">{translateText('translationReviewNotice')}</p>
          </div>
        )}

        {step === 1 && (
          <div className="journey-step-content">
            <div className="journey-step-heading">
              <p className="section-kicker">Step 2</p>
              <h2>{translateText('visitTypeTitle')}</h2>
              <p>{translateText('visitTypeCopy')}</p>
            </div>
            <div className="choice-grid" role="group" aria-label={translateText('visitTypeTitle')}>
              <button className={`choice-card ${visitType === 'new' ? 'is-selected' : ''}`} type="button" onClick={() => { setVisitType('new'); setErrors({}); }}>
                <span className="choice-number">01</span>
                <strong>{translateText('newPatient')}</strong>
                <span>{translateText('newPatientCopy')}</span>
              </button>
              <button className={`choice-card ${visitType === 'returning' ? 'is-selected' : ''}`} type="button" onClick={() => { setVisitType('returning'); setErrors({}); }}>
                <span className="choice-number">02</span>
                <strong>{translateText('returningPatient')}</strong>
                <span>{translateText('returningPatientCopy')}</span>
              </button>
            </div>
            <FieldError id="visit-type-error" message={errors.visitType} />
          </div>
        )}

        {step === 2 && (
          <div className="journey-step-content">
            <div className="journey-step-heading">
              <p className="section-kicker">Step 3</p>
              <h2>{translateText(visitType === 'returning' ? 'returningDetailsTitle' : 'registrationTitle')}</h2>
              <p>{translateText(visitType === 'returning' ? 'returningDetailsCopy' : 'registrationCopy')}</p>
            </div>
            {visitType === 'returning' ? (
              <div className="returning-details">
                <label className="form-field">
                  <span>{translateText('patientIdLabel')}</span>
                  <input name="patientId" type="text" value={patientId} onChange={(event) => { setPatientId(event.target.value); setDemoPatientSelected(false); setErrors({}); }} placeholder={translateText('patientIdPlaceholder')} aria-invalid={Boolean(errors.patientId)} aria-describedby="patient-id-error" />
                  <FieldError id="patient-id-error" message={errors.patientId} />
                </label>
                <button className="demo-button" type="button" onClick={selectDemoPatient}>{translateText('useDemoPatient')}</button>
                <p className="safe-copy">{translateText('demoPatientNotice')}</p>
                {demoPatientSelected && (
                  <section className="demo-record" aria-labelledby="demo-record-title">
                    <p className="section-kicker">{translateText('simulatedDataLabel')}</p>
                    <h3 id="demo-record-title">{translateText('demoRecordTitle')}</h3>
                    <dl>
                      <div><dt>{translateText('patientNameLabel')}</dt><dd>{demoPatient.name}</dd></div>
                      <div><dt>{translateText('ageLabel')}</dt><dd>{demoPatient.age}</dd></div>
                      <div><dt>{translateText('sexLabel')}</dt><dd>{demoPatient.sex}</dd></div>
                      <div><dt>{translateText('previousVisitLabel')}</dt><dd>{demoPatient.previousVisit}</dd></div>
                      <div><dt>{translateText('patientIdLabel')}</dt><dd>{demoPatient.id}</dd></div>
                    </dl>
                  </section>
                )}
              </div>
            ) : (
            <div className="registration-form">
              <label className="form-field">
                <span>{translateText('patientNameLabel')} <em>{translateText('requiredMarker')}</em></span>
                <input name="patientName" type="text" value={formData.patientName} onChange={updateFormData} aria-invalid={Boolean(errors.patientName)} aria-describedby="patient-name-error" autoComplete="name" />
                <FieldError id="patient-name-error" message={errors.patientName} />
              </label>
              <label className="form-field">
                <span>{translateText('ageLabel')} <em>{translateText('requiredMarker')}</em></span>
                <input name="age" type="number" min="0" max="120" step="1" value={formData.age} onChange={updateFormData} aria-invalid={Boolean(errors.age)} aria-describedby="age-error" inputMode="numeric" />
                <FieldError id="age-error" message={errors.age} />
              </label>
              <label className="form-field">
                <span>{translateText('sexLabel')} <em>{translateText('requiredMarker')}</em></span>
                <select name="sex" value={formData.sex} onChange={updateFormData} aria-invalid={Boolean(errors.sex)} aria-describedby="sex-error">
                  <option value="">{translateText('selectOption')}</option>
                  <option value="female">{translateText('sexFemale')}</option>
                  <option value="male">{translateText('sexMale')}</option>
                  <option value="other">{translateText('sexOther')}</option>
                  <option value="prefer-not">{translateText('preferNotToSay')}</option>
                </select>
                <FieldError id="sex-error" message={errors.sex} />
              </label>
              <label className="form-field">
                <span>{translateText('departmentLabel')} <em>{translateText('requiredMarker')}</em></span>
                <select name="department" value={formData.department} onChange={updateFormData} aria-invalid={Boolean(errors.department)} aria-describedby="department-error">
                  <option value="">{translateText('selectOption')}</option>
                  <option value="general-medicine">{translateText('departmentGeneralMedicine')}</option>
                  <option value="outpatient">{translateText('departmentOutpatient')}</option>
                  <option value="other">{translateText('departmentOther')}</option>
                </select>
                <FieldError id="department-error" message={errors.department} />
              </label>
              <label className="form-field form-field-wide">
                <span>{translateText('referenceLabel')} <small>{translateText('optionalLabel')}</small></span>
                <input name="referenceNumber" type="text" value={formData.referenceNumber} onChange={updateFormData} autoComplete="off" />
              </label>
              <section className="demo-confirmation" aria-labelledby="demo-reference-title">
                <p className="section-kicker">{translateText('simulatedDataLabel')}</p>
                <h3 id="demo-reference-title">{translateText('newPatientConfirmationTitle')}</h3>
                <p>{translateText('newPatientConfirmationCopy')}</p>
                <strong>NEW-DEMO-001</strong>
                <small>{translateText('demoReferenceNotice')}</small>
              </section>
            </div>
            )}
            {registrationReady && <p className="registration-ready" role="status">{translateText('registrationReady')}</p>}
          </div>
        )}

        {step === 3 && (
          <div className="journey-step-content">
            <div className="journey-step-heading">
              <p className="section-kicker">Step 4</p>
              <h2>{translateText('complaintTitle')}</h2>
              <p>{translateText('complaintCopy')}</p>
            </div>
            <div className="complaint-grid" role="radiogroup" aria-label={translateText('complaintTitle')}>
              {complaintOptions.map(({ value, labelKey }) => (
                <button className={`complaint-option ${complaint === value ? 'is-selected' : ''}`} key={value} type="button" role="radio" aria-checked={complaint === value} onClick={() => { setComplaint(value); setErrors({}); }}>
                  <span className="radio-indicator" aria-hidden="true" />
                  {translateText(labelKey)}
                </button>
              ))}
            </div>
            <FieldError id="complaint-error" message={errors.complaint} />
            {complaint === 'other' && (
              <label className="form-field other-complaint-field">
                <span>{translateText('otherComplaintLabel')}</span>
                <VoiceResponseField
                  value={otherComplaint}
                  onManualChange={(event) => { setOtherComplaint(event.target.value); setErrors({}); }}
                  onVoiceConfirm={(confirmedValue) => { setOtherComplaint(confirmedValue); setErrors({}); }}
                  language={language}
                  translateText={translateText}
                  inputId="other-complaint"
                  errorId="other-complaint-error"
                  invalid={Boolean(errors.otherComplaint)}
                />
                <FieldError id="other-complaint-error" message={errors.otherComplaint} />
              </label>
            )}
            <p className="safe-copy">{translateText('complaintSafetyNotice')}</p>
          </div>
        )}

        {step === 4 && (
          <div className="journey-step-content">
            <div className="journey-step-heading">
              <p className="section-kicker">Step 5</p>
              <h2>{translateText('clinicalQuestionsTitle')}</h2>
              <p>{translateText('clinicalQuestionsCopy')}</p>
            </div>
            <div className="clinical-question-list">
              {patientSections.map((section) => {
                const sectionQuestions = questions.filter((question) => question.sectionId === section.id);
                if (sectionQuestions.length === 0) {
                  return null;
                }

                return (
                  <section className="ayush-question-section" key={section.id} aria-labelledby={`${section.id}-title`}>
                    <h3 id={`${section.id}-title`}>{section.title}</h3>
                    <p>{section.description}</p>
                    {sectionQuestions.map((question) => {
                      const questionTranslation = getQuestionTranslation(question, language);
                      return (
                        <label className="form-field clinical-question" key={question.id}>
                          <span>{questionTranslation.question} {question.required && <em>{translateText('requiredMarker')}</em>}</span>
                          {renderQuestionInput(question)}
                          <FieldError id={`${question.id}-error`} message={errors[question.id]} />
                        </label>
                      );
                    })}
                  </section>
                );
              })}
            </div>
            <p className="safe-copy">{translateText('clinicalQuestionsSafetyNotice')}</p>
            <p className="ayush-preview-notice" role="status">{translateText('ayushPreviewNotice')}</p>
          </div>
        )}

        {step === 5 && (
          <div className="journey-step-content">
            <ConsentPanel
              language={language}
              consent={consent}
              error={consentError}
              translateText={translateText}
              onChange={(consentGiven) => {
                setConsent({
                  ...consent,
                  consentGiven,
                  consentLanguage: language,
                  consentTimestamp: consentGiven ? new Date().toISOString() : null
                });
                setConsentError('');
              }}
            />
          </div>
        )}

        {step === 6 && (
          <div className="journey-step-content summary-content">
            <div className="journey-step-heading">
              <p className="section-kicker">Step 7</p>
              <h2>{translateText('summaryTitle')}</h2>
              <p>{translateText('summaryCopy')}</p>
            </div>
            <section className="summary-section" aria-labelledby="summary-patient-title">
              <div className="summary-section-heading">
                <h3 id="summary-patient-title">{translateText('summaryPatientSection')}</h3>
                <button className="text-button" type="button" onClick={() => setStep(2)}>{translateText('editButton')}</button>
              </div>
              <p className="patient-provided-label">{translateText('patientProvidedLabel')}</p>
              <dl className="summary-details">
                <div><dt>{translateText('summaryPatientType')}</dt><dd>{translateText(visitType === 'new' ? 'newPatient' : 'returningPatient')}</dd></div>
                {patientSummary.map(([labelKey, value]) => <div key={labelKey}><dt>{translateText(labelKey)}</dt><dd>{value}</dd></div>)}
              </dl>
            </section>
            <section className="summary-section" aria-labelledby="summary-complaint-title">
              <div className="summary-section-heading">
                <h3 id="summary-complaint-title">{translateText('summaryComplaintSection')}</h3>
                <button className="text-button" type="button" onClick={() => setStep(3)}>{translateText('editButton')}</button>
              </div>
              <p className="patient-provided-label">{translateText('patientProvidedLabel')}</p>
              <p className="summary-complaint">{translateText(complaintOptions.find((option) => option.value === complaint)?.labelKey)}{complaint === 'other' && `: ${otherComplaint}`}</p>
            </section>
            <section className="summary-section" aria-labelledby="summary-answers-title">
              <div className="summary-section-heading">
                <h3 id="summary-answers-title">{translateText('summaryAnswersSection')}</h3>
                <button className="text-button" type="button" onClick={() => setStep(4)}>{translateText('editButton')}</button>
              </div>
              <p className="patient-provided-label">{translateText('patientProvidedLabel')}</p>
              <dl className="summary-answers">
                {questions.map((question) => {
                  const answer = displayQuestionAnswer(question);
                  return (
                    <div key={question.id}>
                      <dt>{getQuestionTranslation(question, language).question}</dt>
                      <dd>{answer.value}</dd>
                      <small className="response-source">{translateText('patientReportedSource')} - {translateText(`verificationStatus${answer.response.verificationStatus}`)}</small>
                    </div>
                  );
                })}
              </dl>
            </section>
            <p className="practitioner-review-notice">{translateText('ayushPractitionerReviewNotice')}</p>
            <p className="ai-notice"><strong>{translateText('aiAssistedLabel')}</strong> {translateText('aiUnavailableMessage')}</p>
            <section className="guidance-section" aria-labelledby="guidance-title">
              <h3 id="guidance-title">{translateText('documentationGuidanceTitle')}</h3>
              <p>{translateText('documentationGuidanceCopy')}</p>
              {documentationGuidance.length > 0 ? (
                <ul>
                  {documentationGuidance.map((item) => <li key={item.id}>{item.text}</li>)}
                </ul>
              ) : (
                <p className="guidance-complete">{translateText('documentationGuidanceComplete')}</p>
              )}
            </section>
            <p className="consent-summary">{translateText('consentSummaryLabel')}: {consent.consentLanguage}, version {consent.consentVersion}</p>
            <p className="summary-safety">{translateText('summarySafetyNotice')}</p>
          </div>
        )}

        <div className="journey-actions">
          <button className="secondary-button" type="button" onClick={handleBack}>{translateText('backButton')}</button>
          <button className="primary-button" type="button" onClick={handleContinue}>
            {step === 5 ? translateText('consentReviewButton') : step === 6 ? translateText('finishButton') : translateText('continueButton')} <span aria-hidden="true">-&gt;</span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default PatientJourney;
