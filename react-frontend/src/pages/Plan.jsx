import { Link } from 'react-router-dom';
import CourseList from '../components/CourseList';

export default function Plan({ tracker, onChange }) {
  const groups = Object.groupBy(tracker.courses, course => course.term || 'Semester not set');
  const terms = Object.keys(groups).sort((a, b) => {
    if (a === 'Semester not set') return 1;
    if (b === 'Semester not set') return -1;
    const year = term => Number(term.match(/\b(20\d{2})\b/)?.[1] || 9999);
    const season = term => ({ winter: 0, spring: 1, summer: 2, fall: 3, autumn: 3 }[term.toLowerCase().split(' ')[0]] ?? 4);
    return year(a) - year(b) || season(a) - season(b) || a.localeCompare(b);
  });
  return (
    <>
      <header className="page-heading heading-with-action"><div><p className="eyebrow">Look a semester ahead</p><h1>Make your next move.</h1><p>See your courses by semester and turn your remaining requirements into a plan.</p></div><Link className="button" to="/courses">Add a planned course</Link></header>
      <p className="notice">Choose a semester when adding or editing a course. Planned courses count toward your progress only after you mark them completed.</p>
      {terms.length ? terms.map(term => <section className="semester" key={term}>
        <div className="section-heading"><h2>{term}</h2><span className="muted">{groups[term].length} {groups[term].length === 1 ? 'course' : 'courses'} · {groups[term].filter(course => course.status === 'completed').length} completed</span></div>
        <CourseList courses={groups[term]} requirements={tracker.requirements} onStatus={(id, status) => onChange({ ...tracker, courses: tracker.courses.map(course => course.id === id ? { ...course, status } : course) })} />
        <Link className="semester-edit" to="/courses">Edit courses or move them to another semester →</Link>
      </section>) : <div className="empty-state"><span className="eyebrow">A fresh semester starts here</span><h3>Give your next courses a place.</h3><p>Add a course with “Planned” status and a semester, such as Spring 2027. It will appear here alongside your current and completed courses.</p><Link className="button" to="/courses">Plan your first course</Link></div>}
    </>
  );
}
