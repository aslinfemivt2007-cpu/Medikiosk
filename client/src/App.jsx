import { useEffect, useState } from 'react';
import { languages, translate, translations } from './data/translations.js';
import PatientJourney from './components/PatientJourney.jsx';

const informationCards = [
  { number: '01', title: 'storyTitle', copy: 'storyCopy' },
  { number: '02', title: 'documentsTitle', copy: 'documentsCopy' },
  { number: '03', title: 'reviewTitle', copy: 'reviewCopy' },
  { number: '04', title: 'professionalTitle', copy: 'professionalCopy' }
];

const processSteps = [
  { number: '01', title: 'stepOneTitle', copy: 'stepOneCopy' },
  { number: '02', title: 'stepTwoTitle', copy: 'stepTwoCopy' },
  { number: '03', title: 'stepThreeTitle', copy: 'stepThreeCopy' }
];

function InformationCard({ card, translateText }) {
  return (
    <article className="information-card">
      <span className="card-number">{card.number}</span>
      <h3>{translateText(card.title)}</h3>
      <p>{translateText(card.copy)}</p>
    </article>
  );
}

function ProcessStep({ step, translateText }) {
  return (
    <article className="process-step">
      <span className="step-number">{step.number}</span>
      <div>
        <h3>{translateText(step.title)}</h3>
        <p>{translateText(step.copy)}</p>
      </div>
    </article>
  );
}

function App() {
  const [healthStatus, setHealthStatus] = useState('Checking API connection...');
  const [language, setLanguage] = useState('en');
  const [view, setView] = useState('dashboard');
  const t = (key) => translate(language, key);
  const isEnglishFallback = language !== 'en' && Object.keys(translations[language]).length === 0;

  useEffect(() => {
    fetch('/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Health check failed');
        }

        return response.json();
      })
      .then((data) => setHealthStatus(data.message))
      .catch(() => setHealthStatus('API connection unavailable'));
  }, []);

  return (
    <div className="app-shell" lang={language}>
      <header className="site-header">
        <a className="brand" href="/" aria-label={t('homeLabel')}>
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>
            <strong>MediKiosk</strong>
            <small>{t('brandTagline')}</small>
          </span>
        </a>
        <div className="header-tools">
          <p className="header-label">{t('headerLabel')}</p>
          <label className="language-picker">
            <span>{t('languageLabel')}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              {languages.map((option) => (
                <option key={option.code} value={option.code}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
      </header>

      {view === 'dashboard' ? (
      <main>
        <section className="welcome-section" aria-labelledby="page-title">
          <div className="welcome-content">
            <p className="eyebrow">{t('eyebrow')}</p>
            <h1 id="page-title">{t('title')}</h1>
            <p className="intro-copy">{t('intro')}</p>
            <div className="action-row">
              <button className="primary-button" type="button" onClick={() => setView('journey')}>
                {t('startCase')} <span aria-hidden="true">-&gt;</span>
              </button>
              <div className="status" role="status">
                <span className="status-dot" aria-hidden="true" />
                {healthStatus}
              </div>
            </div>
          </div>

          <aside className="welcome-aside" aria-label={t('asideLabel')}>
            <div className="aside-number">01</div>
            <div>
              <p className="aside-label">{t('designedForClarity')}</p>
              <p className="aside-copy">{t('asideCopy')}</p>
            </div>
          </aside>
        </section>

        <section className="dashboard-section" aria-labelledby="overview-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">MediKiosk / 01</p>
              <h2 id="overview-title">{t('overviewLabel')}</h2>
            </div>
            <p>{t('overviewCopy')}</p>
          </div>
          <div className="information-grid">
            {informationCards.map((card) => (
              <InformationCard key={card.number} card={card} translateText={t} />
            ))}
          </div>
        </section>

        <section className="process-section" aria-labelledby="process-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">MediKiosk / 02</p>
              <h2 id="process-title">{t('stepsLabel')}</h2>
            </div>
            <p>{t('stepsCopy')}</p>
          </div>
          <div className="process-grid">
            {processSteps.map((step) => (
              <ProcessStep key={step.number} step={step} translateText={t} />
            ))}
          </div>
        </section>

        <section className="privacy-notice" aria-labelledby="privacy-title">
          <span className="notice-icon" aria-hidden="true">i</span>
          <div>
            <p className="section-kicker">MediKiosk / 03</p>
            <h2 id="privacy-title">{t('privacyTitle')}</h2>
            <p>{t('privacyCopy')}</p>
          </div>
        </section>
        {isEnglishFallback && <p className="translation-notice" role="status">{t('fallbackNotice')}</p>}
      </main>
      ) : (
        <PatientJourney
          language={language}
          onLanguageChange={setLanguage}
          onExit={() => setView('dashboard')}
          translateText={t}
        />
      )}

      <footer className="site-footer">
        <span><strong>MediKiosk</strong> &copy; 2026</span>
        <span>{t('footer')}</span>
        <span>{t('footerReminder')}</span>
      </footer>
    </div>
  );
}

export default App;