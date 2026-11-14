import { useState } from 'react';
import { STATUSES } from '../tracker';

export default function CourseForm({ initialCourse, requirements, onSave, onCancel }) {
  const [form, setForm] = useState(initialCourse || { title: '', requirementId: '', term: '', status: 'planned' });
  const [error, setError] = useState('');
  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError('');
  }
  function submit(event) {
    event.preventDefault();
    const course = { ...form, title: form.title.trim(), term: form.term.trim() };
    if (!course.title) { setError('Enter a course name or code.'); return; }
    const message = onSave(course);
    if (message) { setError(message); return; }
    if (!initialCourse) setForm({ title: '', requirementId: '', term: '', status: 'planned' });
  }
  return (
    <form className="course-form" onSubmit={submit}>
      <label htmlFor="course-title">Course name or code<input id="course-title" name="title" autoFocus={Boolean(initialCourse)} placeholder="e.g. CS 112 · Introduction to Computing" maxLength="120" required value={form.title} onChange={change} /></label>
      <label htmlFor="course-requirement">Requirement<select id="course-requirement" name="requirementId" value={form.requirementId} onChange={change}><option value="">Not assigned yet</option>{requirements.map(requirement => <option key={requirement.id} value={requirement.id}>{requirement.title}</option>)}</select></label>
      <label htmlFor="course-term">Semester <span className="optional">(optional)</span><input id="course-term" name="term" placeholder="e.g. Spring 2027" maxLength="60" value={form.term} onChange={change} /></label>
      <label htmlFor="course-status">Status<select id="course-status" name="status" value={form.status} onChange={change}>{Object.entries(STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <div className="form-actions"><button type="submit">{initialCourse ? 'Save changes' : 'Add course'}</button>{initialCourse && <button className="secondary" type="button" onClick={onCancel}>Cancel</button>}</div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
