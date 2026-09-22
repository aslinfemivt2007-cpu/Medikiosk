import { useEffect, useRef, useState } from 'react';

function VoiceResponseField({ value, onManualChange, onVoicePending, onVoiceConfirm, onVoiceClear, language, translateText, inputId, errorId, invalid }) {
  const recognitionRef = useRef(null);
  const confirmedValueRef = useRef(value);
  const transcriptionRef = useRef('');
  const [transcription, setTranscription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceState, setVoiceState] = useState('idle');
  const [voiceError, setVoiceError] = useState('');

  const Recognition = typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null;
  const supported = Boolean(Recognition);

  useEffect(() => {
    confirmedValueRef.current = value;
  }, [value]);

  useEffect(() => () => {
    recognitionRef.current?.stop();
  }, []);

  const startListening = () => {
    if (!supported) {
      setVoiceState('failed');
      setVoiceError(translateText('voiceUnavailable'));
      return;
    }

    const recognition = new Recognition();
    recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    setTranscription('');
    transcriptionRef.current = '';
    setVoiceError('');
    setVoiceState('recording');
    setIsListening(true);

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0]?.transcript || '')
        .join(' ')
        .trim();
      setTranscription(text);
      transcriptionRef.current = text;
      onVoicePending?.(text);
      setVoiceState(text ? 'awaiting-confirmation' : 'processing');
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setVoiceState('failed');
      setVoiceError(event.error === 'not-allowed'
        ? translateText('voicePermissionDenied')
        : translateText('voiceRecognitionFailed'));
    };

    recognition.onend = () => {
      setIsListening(false);
      setVoiceState((current) => {
        if (current === 'recording' && !transcriptionRef.current) {
          setVoiceError(translateText('voiceEmptyTranscription'));
          return 'failed';
        }
        return current;
      });
      if (!transcriptionRef.current) {
        setVoiceError(translateText('voiceEmptyTranscription'));
      }
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setVoiceState('awaiting-confirmation');
  };

  const confirmTranscription = () => {
    const confirmedText = transcription.trim();
    if (!confirmedText) {
      setVoiceState('failed');
      setVoiceError(translateText('voiceEmptyTranscription'));
      return;
    }

    onVoiceConfirm(confirmedText);
    confirmedValueRef.current = confirmedText;
    setVoiceState('confirmed');
    setVoiceError('');
  };

  const clearTranscription = () => {
    setTranscription('');
    transcriptionRef.current = '';
    onVoiceClear?.();
    setVoiceState('idle');
    setVoiceError('');
  };

  const handleManualChange = (event) => {
    setTranscription('');
    transcriptionRef.current = '';
    onVoiceClear?.();
    setVoiceState('idle');
    setVoiceError('');
    onManualChange(event);
  };

  return (
    <div className="voice-response-field">
      <textarea
        id={inputId}
        value={value}
        onChange={handleManualChange}
        rows="3"
        aria-invalid={invalid}
        aria-describedby={errorId}
      />
      <div className="voice-controls">
        {!isListening ? (
          <button className="voice-button" type="button" onClick={startListening} aria-label={translateText('startVoice')}>
            {translateText('startVoice')}
          </button>
        ) : (
          <button className="voice-button voice-button-stop" type="button" onClick={stopListening} aria-label={translateText('stopVoice')}>
            {translateText('stopVoice')}
          </button>
        )}
        {transcription && (
          <>
            <button className="voice-button" type="button" onClick={confirmTranscription}>{translateText('confirmTranscription')}</button>
            <button className="voice-text-button" type="button" onClick={clearTranscription}>{translateText('clearTranscription')}</button>
          </>
        )}
      </div>
      <p className="voice-status" role="status">
        {isListening ? translateText('voiceListening') : voiceState === 'awaiting-confirmation' ? translateText('voiceReviewPrompt') : supported ? translateText('voiceOptionalNotice') : translateText('voiceUnavailable')}
      </p>
      {transcription && (
        <label className="voice-transcription">
          <span>{translateText('transcriptionLabel')}</span>
          <textarea value={transcription} onChange={(event) => setTranscription(event.target.value)} rows="2" />
        </label>
      )}
      {voiceError && <p className="field-error" role="alert">{voiceError}</p>}
    </div>
  );
}

export default VoiceResponseField;
