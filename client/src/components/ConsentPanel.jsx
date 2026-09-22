import { getConsentContent, consentVersion } from '../data/consentContent.js';

function ConsentPanel({ language, consent, onChange, error, translateText }) {
  const content = getConsentContent(language);

  return (
    <div className="consent-panel">
      <div className="journey-step-heading">
        <p className="section-kicker">Step 6</p>
        <h2>{content.title}</h2>
        <p>{content.intro}</p>
      </div>
      <ul className="consent-list">
        {content.points.map((point) => <li key={point}>{point}</li>)}
      </ul>
      <label className="consent-checkbox">
        <input
          type="checkbox"
          checked={consent.consentGiven}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={Boolean(error)}
          aria-describedby="consent-error"
        />
        <span>{content.checkboxLabel}</span>
      </label>
      {error && <p className="field-error" id="consent-error" role="alert">{error || translateText('consentRequired')}</p>}
      <p className="consent-version">Consent version {consentVersion}. No clinical answer is stored as consent.</p>
    </div>
  );
}

export default ConsentPanel;
