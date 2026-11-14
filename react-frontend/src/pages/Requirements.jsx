import { useState } from 'react';
import { Link } from 'react-router-dom';
import { removeRequirement, requirementProgress } from '../tracker';

export default function Requirements({ tracker, onChange }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Major');
  const [target, setTarget] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pendingRemoval, setPendingRemoval] = useState(null);
  function addRequirement(event) {
    event.preventDefault();
    const name = title.trim();
    if (!name) { setError('Enter a requirement name.'); return; }
    if (tracker.requirements.some(requirement => requirement.title.toLowerCase() === name.toLowerCase())) { setError('A requirement with this name already exists.'); return; }
    onChange({ ...tracker, requirements: [...tracker.requirements, { id: crypto.randomUUID(), title: name, type, target: Number(target) }] });
    setTitle(''); setTarget(1); setError(''); setMessage(`${name} added.`);
  }
  const fulfilled = tracker.requirements.filter(requirement => requirementProgress(requirement, tracker.courses).remaining === 0).length;
  return (
    <>
      <header className="page-heading"><p className="eyebrow">The bigger picture</p><h1>Know what’s left.</h1><p>Build your requirement checklist and connect courses to it. See what you’ve fulfilled and what still needs a plan.</p></header>
      <p className="notice">Use your degree audit or advisor’s checklist to enter your requirements. This tracker counts courses, not credits, and each course counts toward one requirement here.</p>
      <section className="panel" aria-labelledby="add-requirement-heading">
        <h2 id="add-requirement-heading">Add a requirement</h2>
        <form className="requirement-form" onSubmit={addRequirement}>
          <label htmlFor="requirement-title">Requirement name<input id="requirement-title" placeholder="e.g. Computer Science core" required maxLength="100" value={title} onChange={event => { setTitle(event.target.value); setError(''); }} /></label>
          <label htmlFor="requirement-type">Category<select id="requirement-type" value={type} onChange={event => setType(event.target.value)}><option>Major</option><option>KSA / general education</option><option>Elective</option></select></label>
          <label htmlFor="requirement-target">Courses needed<input id="requirement-target" type="number" min="1" max="100" step="1" required value={target} onChange={event => setTarget(event.target.value)} /></label>
          <button type="submit">Add requirement</button>
          {error && <p className="form-error" role="alert">{error}</p>}
        </form>
      </section>
      <p className="feedback" role="status">{message}</p>
      <div className="section-heading"><h2>Your checklist</h2><span className="muted">{fulfilled} of {tracker.requirements.length} requirements fulfilled</span></div>
      {tracker.requirements.length ? <div className="requirement-grid">{tracker.requirements.map(requirement => {
        const progress = requirementProgress(requirement, tracker.courses);
        return <section className="requirement-card" key={requirement.id}>
          <div className="section-heading"><span className="eyebrow">{requirement.type}</span><span className={`badge ${progress.remaining === 0 ? 'completed' : 'planned'}`}>{progress.remaining === 0 ? 'Fulfilled' : `${progress.remaining} still needed`}</span></div>
          <h3>{requirement.title}</h3>
          <p className="requirement-count"><strong>{progress.completed}</strong> / {requirement.target} courses completed</p>
          <progress value={Math.min(progress.completed, requirement.target)} max={requirement.target} aria-label={`Progress for ${requirement.title}`} />
          <p className="small-note">{progress.inProgress} in progress · {progress.planned} planned</p>
          <label className="target-editor">Course target for {requirement.title}<input aria-label={`Course target for ${requirement.title}`} type="number" min="1" max="100" step="1" value={requirement.target} onChange={event => { const value = Number(event.target.value); if (Number.isInteger(value) && value >= 1 && value <= 100) onChange({ ...tracker, requirements: tracker.requirements.map(item => item.id === requirement.id ? { ...item, target: value } : item) }); }} /></label>
          <div className="section-heading"><Link to="/courses">Assign courses →</Link><button className="text-button danger" aria-label={`Remove ${requirement.title}`} onClick={() => setPendingRemoval(requirement.id)}>Remove</button></div>
          {pendingRemoval === requirement.id && <div className="remove-confirm"><p>Remove this requirement? Its courses will stay in your tracker and become unassigned.</p><div className="actions"><button className="danger-button" onClick={() => { onChange(removeRequirement(tracker, requirement.id)); setPendingRemoval(null); setMessage(`${requirement.title} removed. Its courses were kept.`); }}>Remove requirement</button><button className="secondary" onClick={() => setPendingRemoval(null)}>Keep it</button></div></div>}
        </section>;
      })}</div> : <div className="empty-state"><h3>Your degree. Your checklist.</h3><p>Start with a major requirement, a general education area, or an elective goal. Then assign courses on the Courses page.</p></div>}
    </>
  );
}
