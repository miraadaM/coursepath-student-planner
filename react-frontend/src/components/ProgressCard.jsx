import { useState } from 'react';
import { progressFor } from '../tracker';

export default function ProgressCard({ tracker, onChange }) {
  const [editing, setEditing] = useState(false);
  const [goal, setGoal] = useState(tracker.courseGoal);
  const progress = progressFor(tracker.courses, tracker.courseGoal);
  function saveGoal(event) {
    event.preventDefault();
    onChange({ ...tracker, courseGoal: Number(goal) });
    setEditing(false);
  }
  return (
    <section className="progress-card" aria-labelledby="progress-heading">
      <div className="section-heading">
        <h2 id="progress-heading">Your course progress</h2>
        <span className="eyebrow">{progress.percent}% complete</span>
      </div>
      <p className="progress-number">{progress.completed}<span> / {tracker.courseGoal} courses</span></p>
      <progress value={Math.min(progress.completed, tracker.courseGoal)} max={tracker.courseGoal} aria-label={`${progress.completed} of ${tracker.courseGoal} courses completed`} />
      <p className="progress-caption">{progress.remaining > 0 ? `${progress.remaining} more ${progress.remaining === 1 ? 'course' : 'courses'} to reach your goal.` : 'You’ve reached your course goal! Check your requirements, too.'}</p>
      <div className="stat-row">
        <div><strong>{progress.completed}</strong><span>Completed</span></div>
        <div><strong>{progress.inProgress}</strong><span>In progress</span></div>
        <div><strong>{progress.planned}</strong><span>Planned</span></div>
      </div>
      {editing ? (
        <form className="goal-form" onSubmit={saveGoal}>
          <label htmlFor="course-goal">Course goal<input id="course-goal" type="number" min="1" max="300" step="1" required value={goal} onChange={event => setGoal(event.target.value)} /></label>
          <button type="submit">Save goal</button>
          <button className="text-button" type="button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      ) : <button className="text-button" onClick={() => { setGoal(tracker.courseGoal); setEditing(true); }}>Edit course goal</button>}
      <p className="small-note">Your personal course-count goal, not an official graduation audit. Adjust it to match your degree.</p>
    </section>
  );
}
