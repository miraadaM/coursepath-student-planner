import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseForm from '../components/CourseForm';
import ProgressCard from '../components/ProgressCard';
import CourseList from '../components/CourseList';
import { isDuplicateCourse, progressFor, STATUSES } from '../tracker';

export default function Courses({ tracker, onChange }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const [removed, setRemoved] = useState(null);
  const formPanel = useRef(null);
  const progress = progressFor(tracker.courses, tracker.courseGoal);
  function saveCourse(course) {
    if (isDuplicateCourse(tracker.courses, course, editing?.id)) return 'This course is already listed for that semester. Edit the existing course instead.';
    onChange({ ...tracker, courses: editing ? tracker.courses.map(item => item.id === editing.id ? course : item) : [...tracker.courses, { ...course, id: crypto.randomUUID() }] });
    setMessage(editing ? `${course.title} updated.` : `${course.title} added.`);
    setEditing(null);
    return '';
  }
  function removeCourse(id) {
    const course = tracker.courses.find(item => item.id === id);
    setRemoved(course);
    setMessage(`${course.title} removed.`);
    onChange({ ...tracker, courses: tracker.courses.filter(item => item.id !== id) });
    if (editing?.id === id) setEditing(null);
  }
  function undo() {
    if (isDuplicateCourse(tracker.courses, removed)) { setMessage('A matching course already exists.'); return; }
    onChange({ ...tracker, courses: [...tracker.courses, removed] });
    setMessage(`${removed.title} restored.`);
    setRemoved(null);
  }
  const filtered = tracker.courses.filter(course => (filter === 'all' || course.status === filter) && `${course.title} ${course.term}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <header className="page-heading"><p className="eyebrow">Your academic record</p><h1>Every course counts.</h1><p>Keep track of the courses you’ve finished, are taking now, and want to take next.</p></header>
      <ProgressCard tracker={tracker} onChange={onChange} />
      <div className="summary-strip"><span><strong>{progress.completed}</strong> completed</span><span><strong>{progress.inProgress}</strong> in progress</span><span><strong>{progress.planned}</strong> planned</span><a href="#progress-heading">View overall progress ↑</a></div>
      <section className="panel" ref={formPanel} aria-labelledby="course-form-heading">
        <div className="section-heading"><h2 id="course-form-heading">{editing ? 'Edit course' : 'Add a course'}</h2><Link to="/requirements">Manage requirements →</Link></div>
        <CourseForm key={editing?.id || 'new'} initialCourse={editing} requirements={tracker.requirements} onSave={saveCourse} onCancel={() => setEditing(null)} />
      </section>
      <div className="feedback" role="status">{message}{removed && <button className="text-button" onClick={undo}>Undo removal</button>}</div>
      <section aria-labelledby="courses-heading">
        <div className="section-heading"><h2 id="courses-heading">Your courses <span className="count">{tracker.courses.length}</span></h2></div>
        <div className="list-filters"><label htmlFor="search-courses">Search courses<input id="search-courses" placeholder="Search by course or semester" value={search} onChange={event => setSearch(event.target.value)} /></label><label htmlFor="filter-status">Show<select id="filter-status" value={filter} onChange={event => setFilter(event.target.value)}><option value="all">All statuses</option>{Object.entries(STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
        {filtered.length ? <CourseList courses={filtered} requirements={tracker.requirements} onStatus={(id, status) => onChange({ ...tracker, courses: tracker.courses.map(course => course.id === id ? { ...course, status } : course) })} onEdit={course => { setEditing(course); formPanel.current?.scrollIntoView({ block: 'center' }); }} onDelete={removeCourse} /> : <div className="empty-state"><h3>{tracker.courses.length ? 'No matching courses' : 'Your story starts with one course.'}</h3><p>{tracker.courses.length ? 'Try a different search or status.' : 'Add a completed, current, or planned course above. Your progress will update automatically.'}</p></div>}
      </section>
    </>
  );
}
