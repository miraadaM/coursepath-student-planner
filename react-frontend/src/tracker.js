export const STORAGE_KEY = 'course-tracker.v1';
export const STATUSES = { planned: 'Planned', in_progress: 'In progress', completed: 'Completed' };
export const EMPTY_TRACKER = { version: 1, courseGoal: 32, courses: [], requirements: [] };

export function progressFor(courses, goal) {
  const completed = courses.filter(course => course.status === 'completed').length;
  return {
    completed,
    inProgress: courses.filter(course => course.status === 'in_progress').length,
    planned: courses.filter(course => course.status === 'planned').length,
    remaining: Math.max(0, goal - completed),
    percent: Math.min(100, Math.round(completed / goal * 100)),
  };
}

export function requirementProgress(requirement, courses) {
  return progressFor(courses.filter(course => course.requirementId === requirement.id), requirement.target);
}

export function isDuplicateCourse(courses, candidate, excludingId) {
  const normalized = value => value.trim().toLowerCase();
  return courses.some(course => course.id !== excludingId &&
    normalized(course.title) === normalized(candidate.title) &&
    normalized(course.term) === normalized(candidate.term));
}

export function removeRequirement(tracker, id) {
  return {
    ...tracker,
    requirements: tracker.requirements.filter(requirement => requirement.id !== id),
    courses: tracker.courses.map(course => course.requirementId === id ? { ...course, requirementId: '' } : course),
  };
}

export function validTracker(data) {
  if (!data || data.version !== 1 || !Number.isInteger(data.courseGoal) || data.courseGoal < 1 || data.courseGoal > 300 ||
    !Array.isArray(data.courses) || !Array.isArray(data.requirements)) return false;
  const requirementsValid = data.requirements.every(requirement => requirement && typeof requirement.id === 'string' &&
    typeof requirement.title === 'string' && requirement.title.trim() &&
    ['Major', 'KSA / general education', 'Elective'].includes(requirement.type) &&
    Number.isInteger(requirement.target) && requirement.target > 0 && requirement.target <= 100);
  if (!requirementsValid) return false;
  const requirementIds = new Set(data.requirements.map(requirement => requirement.id));
  return requirementIds.size === data.requirements.length &&
    new Set(data.courses.map(course => course?.id)).size === data.courses.length &&
    data.courses.every(course => course && typeof course.id === 'string' &&
      typeof course.title === 'string' && course.title.trim() && typeof course.term === 'string' &&
      Object.hasOwn(STATUSES, course.status) && typeof course.requirementId === 'string' &&
      (!course.requirementId || requirementIds.has(course.requirementId)));
}

export function readTracker() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { data: EMPTY_TRACKER, error: '' };
    const data = JSON.parse(stored);
    if (!validTracker(data)) throw new Error('Invalid saved tracker');
    return { data, error: '' };
  } catch {
    return { data: EMPTY_TRACKER, error: 'Your saved tracker could not be read. Changes will replace the saved copy. Check that browser storage is available before adding courses.' };
  }
}
