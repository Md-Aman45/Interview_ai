import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Layout } from '../components/Layout.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { interviewService } from '../services/interview.service.js';
import { mockService, getActiveSession, clearActiveSession } from '../services/mock.service.js';
import { formatDate } from '../utils/formatters.js';

// ─────────────────────────────────────────────────────────
// INSTRUCTIONS  — premium two-column layout
// ─────────────────────────────────────────────────────────
function InstructionsScreen({ onConfirm }) {
  const rules = [
    { num: '01', color: '#6366f1', bg: 'rgba(99,102,241,0.08)', title: '30-minute timer', desc: 'Session starts immediately. Auto-ends when time runs out and your score is saved.' },
    { num: '02', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', title: 'Mic → Speak → Auto-submit', desc: 'Press the mic and speak your answer. An 8-second bar counts down after silence, then submits.' },
    { num: '03', color: '#06b6d4', bg: 'rgba(6,182,212,0.08)', title: 'AI reads questions only', desc: 'Your scores and feedback appear in the sidebar — never spoken aloud.' },
    { num: '04', color: '#10b981', bg: 'rgba(16,185,129,0.08)', title: 'Groq scores in < 1 second', desc: 'Every answer is evaluated instantly out of 10, with detailed written feedback.' },
    { num: '05', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', title: 'Stay on this tab', desc: 'Switching tabs 3 times ends your session automatically (cheat detection).' },
    { num: '06', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', title: '3× bad = pause prompt', desc: 'Three consecutive 1/10 scores triggers a pause so you can collect yourself.' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Hero banner */}
      <div style={{
        borderRadius: 28, overflow: 'hidden', marginBottom: 20,
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%)',
        padding: '40px 48px', position: 'relative',
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: 80, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🎤</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>InterviewAI</div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Voice Mock Interview</h1>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0, maxWidth: 460 }}>
            A real-time AI interview that listens to your voice, evaluates every answer instantly, and gives you detailed feedback — just like the real thing.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
            {['30 minutes', 'Voice powered', 'Groq AI scoring', 'Live feedback'].map(tag => (
              <span key={tag} style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 100, padding: '4px 12px' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Rules grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: 16 }}>
        {rules.map(r => (
          <div key={r.num} style={{
            border: '1px solid var(--border)', borderRadius: 20,
            background: 'var(--card)', padding: '18px 20px',
            display: 'flex', gap: 14, alignItems: 'flex-start',
            transition: 'box-shadow 0.15s',
          }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ width: 34, height: 34, borderRadius: 10, background: r.bg, border: `1px solid ${r.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: r.color }}>{r.num}</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)', marginBottom: 4 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', lineHeight: 1.6 }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row: warning + CTA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
          <p style={{ fontSize: 12, color: '#b45309', margin: 0, lineHeight: 1.5 }}>
            Use <strong>Google Chrome</strong> for best voice recognition. Allow microphone access when prompted.
          </p>
        </div>
        <button onClick={onConfirm} style={{
          display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap',
          padding: '13px 28px', borderRadius: 16, border: 'none',
          background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
          color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(99,102,241,0.35)', transition: 'opacity 0.15s',
        }}
          onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          <span style={{ fontSize: 18 }}>🚀</span> Start interview
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// REPORT PICKER
// ─────────────────────────────────────────────────────────
function ReportPicker({ reports, onStart, submitting }) {
  const [selected, setSelected] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-xl shadow-slate-900/5">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Step 2 of 2</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Which role are you practicing?</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-6">AI tailors questions to your selected resume report.</p>
        </div>
        <div className="px-8 py-5">
          {reports.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center">
              <div className="text-3xl mb-3">📄</div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No reports yet. Create one first.</p>
              <Link to="/reports/new" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition">Create a report</Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {reports.map(r => (
                <button key={r._id} type="button" onClick={() => setSelected(r._id)}
                  className={`w-full rounded-2xl border-2 px-5 py-4 text-left transition ${selected === r._id ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-950/40' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900'}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{r.jobRole}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{formatDate(r.createdAt)}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">{r.matchScore?.overall ?? r.matchScore}%</div>
                        <div className="text-xs text-slate-400">match</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${selected === r._id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 dark:border-slate-600'}`}>
                        {selected === r._id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {reports.length > 0 && (
          <div className="px-8 pb-8">
            <button type="button" onClick={() => { if (!selected) { toast.error('Select a report first.'); return; } setShowConfirm(true); }}
              disabled={!selected || submitting}
              className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-3.5 text-sm font-bold text-white transition shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed">
              {selected ? 'Start interview →' : 'Select a report above'}
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-2xl">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to begin?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-6">
              Your 30-minute session starts now. Leaving the page 3 times will auto-end the session. Use "End session" when done.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowConfirm(false)} className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition">Cancel</button>
              <button type="button" onClick={() => { setShowConfirm(false); onStart(selected); }} disabled={submitting}
                className="flex-1 rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-bold text-white transition shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                {submitting ? 'Starting...' : "Let's go 🚀"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// LIVE SESSION
// ─────────────────────────────────────────────────────────
function LiveSession({ session, onEnd }) {
  const [currentQuestion, setCurrentQuestion] = useState(session.firstQuestion || '');
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [silenceCountdown, setSilenceCountdown] = useState(null); // 0–8
  const [history, setHistory] = useState([
    { type: 'ai', text: session.message },
    { type: 'ai', text: session.firstQuestion },
  ]);
  const [timeRemaining, setTimeRemaining] = useState((session.timeLimit || 30) * 60);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [summary, setSummary] = useState(null);
  const [quitModal, setQuitModal] = useState(false);       // back-button confirmation
  const [cheatModal, setCheatModal] = useState(false);     // cheat detection
  const [exhaustedModal, setExhaustedModal] = useState(false); // 3× 1/10
  const [visibilityWarnings, setVisibilityWarnings] = useState(0);
  const [consecutiveLow, setConsecutiveLow] = useState(0);

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const historyEndRef = useRef(null);
  const isListeningRef = useRef(false);
  const submittingRef = useRef(false);
  const transcriptRef = useRef('');
  const visibilityRef = useRef(0);
  const consecutiveLowRef = useRef(0);

  useEffect(() => { submittingRef.current = submitting; }, [submitting]);
  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);
  useEffect(() => { historyEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);
  useEffect(() => { visibilityRef.current = visibilityWarnings; }, [visibilityWarnings]);
  useEffect(() => { consecutiveLowRef.current = consecutiveLow; }, [consecutiveLow]);

  const speak = useCallback((text, onDone) => {
    if (!window.speechSynthesis) { onDone?.(); return; }
    synthRef.current.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.92; utt.pitch = 1;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => { setIsSpeaking(false); onDone?.(); };
    utt.onerror = () => { setIsSpeaking(false); onDone?.(); };
    synthRef.current.speak(utt);
  }, []);

  // Speak on load
  useEffect(() => {
    const t = setTimeout(() => speak(session.message, () => { setTimeout(() => speak(session.firstQuestion), 600); }), 800);
    return () => { clearTimeout(t); synthRef.current?.cancel(); };
  }, []); // eslint-disable-line

  // Session timer
  useEffect(() => {
    if (session.startedAt) {
      const elapsed = Math.floor((Date.now() - new Date(session.startedAt)) / 1000);
      setTimeRemaining(Math.max(0, (session.timeLimit || 30) * 60 - elapsed));
    }
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) { clearInterval(interval); handleEnd('time'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  // ── CHEAT DETECTION: page visibility ──
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        const next = visibilityRef.current + 1;
        setVisibilityWarnings(next);
        if (next >= 3) {
          setCheatModal(true);
        } else {
          toast.warning(`⚠️ Warning ${next}/3 — Switching tabs may end your session`, { duration: 4000 });
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // ── BACK BUTTON GUARD ──
  useEffect(() => {
    // Push a dummy state so we can catch popstate
    window.history.pushState({ mockSession: true }, '');
    const handlePop = () => {
      window.history.pushState({ mockSession: true }, ''); // re-push so they stay
      setQuitModal(true);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  // ── beforeunload (refresh / close tab) ──
  useEffect(() => {
    const handler = e => { e.preventDefault(); e.returnValue = 'Your interview session will end if you leave.'; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // ── SPEECH RECOGNITION ──
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error('Use Chrome for voice support.'); return; }
    const rec = new SR();
    rec.continuous = true; rec.interimResults = true; rec.lang = 'en-US';

    rec.onresult = e => {
      const text = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(text); transcriptRef.current = text;
      // reset silence countdown
      clearTimeout(silenceTimerRef.current); clearInterval(countdownIntervalRef.current);
      setSilenceCountdown(8);
      let count = 8;
      countdownIntervalRef.current = setInterval(() => {
        count--;
        setSilenceCountdown(count > 0 ? count : null);
        if (count <= 0) clearInterval(countdownIntervalRef.current);
      }, 1000);
      silenceTimerRef.current = setTimeout(() => {
        setSilenceCountdown(null);
        if (!submittingRef.current && transcriptRef.current?.trim()) handleAutoSubmit(transcriptRef.current);
      }, 8000);
    };

    // KEY: only restart if still in listening mode
    rec.onend = () => {
      if (isListeningRef.current && !submittingRef.current) {
        try { rec.start(); } catch (_) {}
      } else {
        setIsListening(false);
      }
    };
    rec.onerror = e => {
      if (e.error === 'no-speech' || e.error === 'aborted') return; // ignore — don't stop mic
      setIsListening(false); isListeningRef.current = false;
    };
    recognitionRef.current = rec;
    return () => { rec.onend = null; rec.onerror = null; try { rec.stop(); } catch (_) {} };
  }, []); // eslint-disable-line

  const stopMic = () => {
    isListeningRef.current = false;
    clearTimeout(silenceTimerRef.current); clearInterval(countdownIntervalRef.current);
    setSilenceCountdown(null);
    try { recognitionRef.current?.stop(); } catch (_) {}
    setIsListening(false);
  };

  const handleAutoSubmit = async text => {
    if (!text?.trim() || submittingRef.current) return;
    stopMic();
    await doSubmit(text);
  };

  const toggleMic = () => {
    synthRef.current.cancel();
    if (isListening) {
      stopMic();
    } else {
      setTranscript(''); transcriptRef.current = '';
      isListeningRef.current = true;
      try { recognitionRef.current?.start(); } catch (_) {}
      setIsListening(true);
    }
  };

  const doSubmit = async answerText => {
    if (!answerText?.trim() || submittingRef.current) return;
    setSubmitting(true); synthRef.current.cancel();
    try {
      const res = await mockService.submitAnswer(session.sessionId, { question: currentQuestion, answer: answerText.trim() });

      // Track consecutive low scores
      if (res.score <= 1) {
        const next = consecutiveLowRef.current + 1;
        setConsecutiveLow(next);
        if (next >= 3) { setExhaustedModal(true); return; }
      } else {
        setConsecutiveLow(0);
      }

      setHistory(prev => [
        ...prev,
        { type: 'user', text: answerText.trim() },
        { type: 'feedback', score: res.score, feedback: res.feedback },
        ...(res.nextQuestion ? [{ type: 'ai', text: res.nextQuestion }] : []),
      ]);
      setTranscript(''); transcriptRef.current = '';
      setCurrentQuestion(res.nextQuestion || '');
      if (res.minutesRemaining) setTimeRemaining(Math.floor(res.minutesRemaining * 60));
      if (res.timeUp) { handleEnd('time'); return; }
      if (res.nextQuestion) speak(res.nextQuestion);
    } catch (err) {
      if (err?.response?.data?.timeUp) { handleEnd('time'); return; }
      toast.error('Submission failed. Try again.');
    } finally { setSubmitting(false); }
  };

  const handleEnd = async (reason = 'manual') => {
    synthRef.current.cancel();
    stopMic();
    clearInterval(countdownIntervalRef.current);
    setQuitModal(false); setCheatModal(false); setExhaustedModal(false);
    try { const res = await mockService.endSession(session.sessionId); setSummary(res.summary); } catch { setSummary(null); }
    setSessionEnded(true); clearActiveSession();
  };

  const fmtTime = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const isUrgent = timeRemaining < 300;

  // ── SESSION ENDED SUMMARY ───────────────────────────────
  if (sessionEnded) {
    const avg = summary?.averageScore ?? 0;
    const avgColor = avg >= 7 ? '#22c55e' : avg >= 5 ? '#f59e0b' : '#ef4444';
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--background)', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 28, overflow: 'hidden' }}>
            <div style={{ padding: '32px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg,rgba(99,102,241,0.07)0%,transparent 60%)' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#22c55e15', border: '2px solid #22c55e40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>✓</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 4px' }}>Session complete</h2>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: 0 }}>Here's how you performed</p>
            </div>
            <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'var(--muted)', borderRadius: 16, padding: '16px 18px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--foreground)', lineHeight: 1 }}>{summary?.totalQuestions || 0}</div>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 5 }}>Questions answered</div>
              </div>
              <div style={{ background: avgColor + '10', borderRadius: 16, padding: '16px 18px', border: `1px solid ${avgColor}30` }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: avgColor, lineHeight: 1 }}>{Number.isFinite(avg) ? avg.toFixed(1) : '—'}<span style={{ fontSize: 14, opacity: 0.5 }}>/10</span></div>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 5 }}>Average score</div>
              </div>
            </div>
            {summary?.answers?.length > 0 && (
              <div style={{ padding: '0 32px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--muted-foreground)', marginBottom: 4 }}>Answer breakdown</div>
                {summary.answers.map((a, i) => {
                  const c = a.score >= 7 ? '#22c55e' : a.score >= 5 ? '#f59e0b' : '#ef4444';
                  return (
                    <div key={i} style={{ padding: '12px 14px', background: 'var(--muted)', borderRadius: 14, border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.5, flex: 1 }}>{a.question}</span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: c, background: c + '18', padding: '2px 9px', borderRadius: 100, flexShrink: 0 }}>{a.score}/10</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--muted-foreground)', lineHeight: 1.6, margin: 0 }}>{a.feedback}</p>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ padding: '0 32px 32px' }}>
              <button onClick={onEnd} style={{ width: '100%', padding: 14, borderRadius: 16, background: '#6366f1', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Back to dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MODALS ──────────────────────────────────────────────
  const Modal = ({ icon, title, desc, confirmLabel, confirmColor = '#6366f1', onConfirm, onCancel, cancelLabel = 'Stay in session' }) => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 24, padding: 32, boxShadow: '0 32px 64px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 8px' }}>{title}</h3>
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', lineHeight: 1.7, margin: '0 0 24px' }}>{desc}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          {onCancel && (
            <button onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: 14, border: '1px solid var(--border)', background: 'var(--muted)', color: 'var(--foreground)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              {cancelLabel}
            </button>
          )}
          <button onClick={onConfirm} style={{ flex: 1, padding: '12px', borderRadius: 14, border: 'none', background: confirmColor, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  // ── FULLSCREEN LIVE UI ──────────────────────────────────
  const pct = silenceCountdown !== null ? ((8 - silenceCountdown) / 8) * 100 : 0;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--background)', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'inherit' }}>

      {/* Modals */}
      {quitModal && (
        <Modal icon="🚪" title="Leave the interview?"
          desc="Going back will end your session permanently. Your answers so far will be saved and scored."
          confirmLabel="End session" confirmColor="#ef4444"
          onConfirm={() => handleEnd('quit')}
          onCancel={() => setQuitModal(false)} />
      )}
      {cheatModal && (
        <Modal icon="🚨" title="Session ended — tab switching detected"
          desc="You switched tabs or minimized the window 3 times. Your session has been ended to maintain fairness."
          confirmLabel="View my results" confirmColor="#ef4444"
          onConfirm={() => handleEnd('cheat')} />
      )}
      {exhaustedModal && (
        <Modal icon="💪" title="Take a breath — you're struggling"
          desc="You've scored 1/10 three times in a row. That's okay — take a break, review the material, and come back stronger."
          confirmLabel="End & see results" confirmColor="#f59e0b"
          onCancel={() => { setExhaustedModal(false); setConsecutiveLow(0); }}
          cancelLabel="Continue anyway"
          onConfirm={() => handleEnd('exhausted')} />
      )}

      {/* ── TOP BAR ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--card)', flexShrink: 0, gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>AI</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)', lineHeight: 1 }}>Mock Interview</div>
            <div style={{ fontSize: 10, color: 'var(--muted-foreground)', marginTop: 2 }}>
              {visibilityWarnings > 0 && <span style={{ color: '#f59e0b' }}>⚠ {visibilityWarnings}/3 tab-switch warnings · </span>}
              Live session
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, background: isUrgent ? '#ef444412' : 'var(--muted)', border: `1px solid ${isUrgent ? '#ef444430' : 'var(--border)'}`, transition: 'all 0.3s' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: isUrgent ? '#ef4444' : '#6366f1', animation: 'livePulse 1.5s infinite' }} />
            <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'monospace', color: isUrgent ? '#ef4444' : 'var(--foreground)', letterSpacing: '0.06em' }}>{fmtTime(timeRemaining)}</span>
          </div>
          <button onClick={() => setQuitModal(true)} disabled={submitting}
            style={{ padding: '7px 14px', borderRadius: 10, border: '1px solid #fca5a5', background: 'transparent', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseOver={e => e.currentTarget.style.background = '#fef2f2'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            End session
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* CENTER */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 36px', gap: 24, overflow: 'hidden' }}>

          {/* AI Avatar */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isSpeaking && <>
              <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '1.5px solid rgba(99,102,241,0.25)', animation: 'ripple 2s ease-out infinite' }} />
              <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: '1.5px solid rgba(99,102,241,0.4)', animation: 'ripple 2s ease-out infinite 0.5s' }} />
            </>}
            {isListening && <>
              <div style={{ position: 'absolute', inset: -18, borderRadius: '50%', border: '1.5px solid rgba(239,68,68,0.25)', animation: 'ripple 1.5s ease-out infinite' }} />
              <div style={{ position: 'absolute', inset: -9, borderRadius: '50%', border: '1.5px solid rgba(239,68,68,0.4)', animation: 'ripple 1.5s ease-out infinite 0.4s' }} />
            </>}
            <div style={{
              width: 92, height: 92, borderRadius: '50%',
              border: `3px solid ${isSpeaking ? '#818cf8' : isListening ? '#f87171' : 'var(--border)'}`,
              background: isSpeaking ? 'rgba(99,102,241,0.07)' : isListening ? 'rgba(239,68,68,0.06)' : 'var(--muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38,
              transition: 'border-color 0.25s, background 0.25s',
              animation: isSpeaking ? 'bobSpeak 0.6s ease-in-out infinite alternate' : 'none',
            }}>🤖</div>
          </div>

          {/* Status pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 100,
            background: isListening ? 'rgba(239,68,68,0.08)' : isSpeaking ? 'rgba(99,102,241,0.08)' : submitting ? 'rgba(245,158,11,0.08)' : 'var(--muted)',
            border: `1px solid ${isListening ? '#ef444425' : isSpeaking ? '#6366f125' : submitting ? '#f59e0b25' : 'var(--border)'}`,
            transition: 'all 0.25s',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: isListening ? '#ef4444' : isSpeaking ? '#6366f1' : submitting ? '#f59e0b' : 'var(--muted-foreground)',
              animation: (isListening || isSpeaking || submitting) ? 'livePulse 1s infinite' : 'none',
            }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: isListening ? '#ef4444' : isSpeaking ? '#6366f1' : submitting ? '#f59e0b' : 'var(--muted-foreground)' }}>
              {isListening
                ? silenceCountdown !== null ? `Listening — auto-submit in ${silenceCountdown}s` : 'Listening…'
                : isSpeaking ? 'AI is speaking…'
                : submitting ? 'Evaluating your answer…'
                : 'Press the mic to speak'}
            </span>
          </div>

          {/* Current question */}
          <div style={{ width: '100%', maxWidth: 560, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: '18px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--muted-foreground)', marginBottom: 10 }}>Current question</div>
            <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--foreground)', lineHeight: 1.65, margin: 0 }}>{currentQuestion || 'Preparing first question…'}</p>
          </div>

          {/* Transcript + silence progress bar */}
          {(isListening || transcript) && (
            <div style={{ width: '100%', maxWidth: 560, background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 18px 10px', animation: 'fadeSlideIn 0.2s ease' }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--muted-foreground)', marginBottom: 8 }}>Your answer (live)</div>
              <p style={{ fontSize: 14, color: transcript ? 'var(--foreground)' : 'var(--muted-foreground)', lineHeight: 1.7, margin: '0 0 10px', fontStyle: transcript ? 'normal' : 'italic', minHeight: 32 }}>
                {transcript || 'Start speaking…'}
              </p>
              {/* 8-second countdown bar */}
              {silenceCountdown !== null && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b' }}>Auto-submitting in {silenceCountdown}s</span>
                    <span style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>silence detected</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 100, background: 'var(--border)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 100, background: '#f59e0b', width: `${pct}%`, transition: 'width 1s linear' }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mic button */}
          <button onClick={toggleMic} disabled={submitting || isSpeaking} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 36px', borderRadius: 100,
            background: isListening ? '#dc2626' : '#6366f1',
            color: '#fff', border: 'none',
            cursor: submitting || isSpeaking ? 'not-allowed' : 'pointer',
            fontSize: 14, fontWeight: 800,
            opacity: submitting || isSpeaking ? 0.45 : 1,
            boxShadow: isListening ? '0 8px 28px rgba(220,38,38,0.35)' : '0 8px 28px rgba(99,102,241,0.35)',
            transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: 20 }}>{isListening ? '🛑' : '🎤'}</span>
            {isListening
              ? silenceCountdown !== null ? `Stop (auto in ${silenceCountdown}s)` : 'Stop speaking'
              : submitting ? 'Evaluating…' : 'Click to speak'}
          </button>
        </div>

        {/* RIGHT PANEL — conversation */}
        <div style={{ width: 300, flexShrink: 0, borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--card)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--muted-foreground)' }}>Conversation</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map((item, i) => (
              <div key={i}>
                {item.type === 'ai' && item.text && (
                  <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0, marginTop: 2 }}>🤖</div>
                    <div style={{ flex: 1, background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '13px 13px 13px 3px', padding: '8px 11px', fontSize: 12, color: 'var(--foreground)', lineHeight: 1.6 }}>{item.text}</div>
                  </div>
                )}
                {item.type === 'user' && (
                  <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(100,116,139,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0, marginTop: 2 }}>🧑</div>
                    <div style={{ flex: 1, background: '#6366f1', borderRadius: '13px 13px 3px 13px', padding: '8px 11px', fontSize: 12, color: '#fff', lineHeight: 1.6 }}>{item.text}</div>
                  </div>
                )}
                {item.type === 'feedback' && (
                  <div style={{ marginLeft: 31 }}>
                    <div style={{
                      background: item.score >= 7 ? '#22c55e0c' : item.score >= 5 ? '#f59e0b0c' : '#ef44440c',
                      border: `1px solid ${item.score >= 7 ? '#22c55e25' : item.score >= 5 ? '#f59e0b25' : '#ef444425'}`,
                      borderRadius: 12, padding: '8px 11px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', background: item.score >= 7 ? '#22c55e' : item.score >= 5 ? '#f59e0b' : '#ef4444', padding: '1px 7px', borderRadius: 100 }}>{item.score}/10</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: item.score >= 7 ? '#16a34a' : item.score >= 5 ? '#d97706' : '#dc2626' }}>
                          {item.score >= 7 ? '✓ Strong' : item.score >= 5 ? '~ Fair' : '✗ Needs work'}
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: 'var(--muted-foreground)', lineHeight: 1.55, margin: 0 }}>{item.feedback}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={historyEndRef} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1}50%{opacity:0.25} }
        @keyframes ripple { 0%{transform:scale(1);opacity:0.5}100%{transform:scale(1.5);opacity:0} }
        @keyframes bobSpeak { 0%{transform:translateY(0)}100%{transform:translateY(-5px)} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────
export function MockInterview() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('instructions');
  const [reports, setReports] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const saved = getActiveSession();
        if (saved) { setActiveSession(saved); setPhase('session'); setLoading(false); return; }
        setReports(await interviewService.getAllReports());
      } catch { toast.error('Could not load data.'); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleStart = async reportId => {
    setSubmitting(true);
    try {
      const session = await mockService.startSession({ reportId });
      setActiveSession(session); setPhase('session');
    } catch (err) { toast.error(err?.response?.data?.message || 'Could not start session.'); }
    finally { setSubmitting(false); }
  };

  const handleEnd = () => {
    clearActiveSession(); setActiveSession(null); setPhase('instructions');
    navigate('/dashboard');
  };

  if (loading) return <LoadingSpinner fullScreen label="Loading mock interview" />;
  if (phase === 'session' && activeSession) return <LiveSession session={activeSession} onEnd={handleEnd} />;

  return (
    <Layout title="Mock interview" eyebrow="Practice">
      {phase === 'instructions' && <InstructionsScreen onConfirm={() => setPhase('picker')} />}
      {phase === 'picker' && <ReportPicker reports={reports} onStart={handleStart} submitting={submitting} />}
    </Layout>
  );
}