import test from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_TRACKER, isDuplicateCourse, progressFor, removeRequirement, requirementProgress, validTracker } from './tracker.js';

const courses = [
  { id: 'a', title: 'CS 112', term: 'Fall 2026', status: 'completed', requirementId: 'major' },
  { id: 'b', title: 'CS 232', term: 'Spring 2027', status: 'in_progress', requirementId: 'major' },
  { id: 'c', title: 'CS 330', term: 'Fall 2027', status: 'planned', requirementId: 'major' },
  { id: 'd', title: 'Art', term: '', status: 'completed', requirementId: '' },
];
const requirement = { id: 'major', title: 'CS core', type: 'Major', target: 3 };

test('only completed courses contribute to completion, with distinct current and planned counts', () => {
  assert.deepEqual(progressFor(courses, 4), { completed: 2, inProgress: 1, planned: 1, remaining: 2, percent: 50 });
  assert.equal(progressFor(courses.map(course => ({ ...course, status: 'planned' })), 4).percent, 0);
});

test('requirements count only assigned completed courses and recalculate when a status changes', () => {
  assert.equal(requirementProgress(requirement, courses).remaining, 2);
  const updated = courses.map(course => course.id === 'b' ? { ...course, status: 'completed' } : course);
  assert.equal(requirementProgress(requirement, updated).remaining, 1);
  assert.equal(progressFor(updated, 4).percent, 75);
});

test('progress is capped at 100 percent without hiding completed courses above the goal', () => {
  assert.equal(progressFor(courses, 1).completed, 2);
  assert.equal(progressFor(courses, 1).percent, 100);
  assert.equal(progressFor(courses, 1).remaining, 0);
});

test('removing a requirement preserves courses and total completion', () => {
  const tracker = { ...EMPTY_TRACKER, courses, requirements: [requirement] };
  const updated = removeRequirement(tracker, requirement.id);
  assert.equal(updated.courses.length, 4);
  assert.equal(updated.requirements.length, 0);
  assert.ok(updated.courses.every(course => course.requirementId === ''));
  assert.equal(progressFor(updated.courses, 32).completed, 2);
  assert.equal(tracker.courses[0].requirementId, 'major');
  assert.ok(validTracker(updated));
});

test('duplicate detection ignores case and spaces while allowing a course in another semester', () => {
  assert.ok(isDuplicateCourse(courses, { title: ' cs 112 ', term: 'fall 2026 ' }));
  assert.equal(isDuplicateCourse(courses, { title: 'CS 112', term: 'Spring 2027' }), false);
  assert.equal(isDuplicateCourse(courses, courses[0], 'a'), false);
});

test('saved data validation rejects malformed courses, goals, duplicate IDs, and orphan assignments', () => {
  const tracker = { ...EMPTY_TRACKER, courses, requirements: [requirement] };
  assert.ok(validTracker(JSON.parse(JSON.stringify(tracker))));
  assert.equal(validTracker({ ...tracker, courseGoal: 0 }), false);
  assert.equal(validTracker({ ...tracker, courses: [null] }), false);
  assert.equal(validTracker({ ...tracker, requirements: [] }), false);
  assert.equal(validTracker({ ...tracker, courses: [...courses, courses[0]] }), false);
  assert.equal(validTracker({ ...tracker, courses: [{ ...courses[0], status: 'unknown' }] }), false);
});
