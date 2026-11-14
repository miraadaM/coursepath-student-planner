import { STATUSES } from '../tracker';

export default function CourseList({ courses, requirements, onStatus, onEdit, onDelete }) {
  return (
    <ul className="course-list">
      {courses.map(course => {
        const requirement = requirements.find(item => item.id === course.requirementId);
        return (
          <li className="course-row" key={course.id}>
            <div className="course-details"><h3>{course.title}</h3><p>{requirement?.title || 'Requirement not assigned'}<span aria-hidden="true"> · </span>{course.term || 'Semester not set'}</p></div>
            <div className="course-controls">
              <select className={`status-select ${course.status}`} aria-label={`Status for ${course.title}`} value={course.status} onChange={event => onStatus(course.id, event.target.value)}>{Object.entries(STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
              {onEdit && <button className="text-button" aria-label={`Edit ${course.title}`} onClick={() => onEdit(course)}>Edit</button>}
              {onDelete && <button className="text-button danger" aria-label={`Remove ${course.title}`} onClick={() => onDelete(course.id)}>Remove</button>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
