import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="site-header">
      <NavLink className="brand" to="/">Course Tracker</NavLink>
      <nav aria-label="Main navigation">
        <NavLink to="/" end>Overview</NavLink>
        <NavLink to="/courses">Courses</NavLink>
        <NavLink to="/requirements">Requirements</NavLink>
        <NavLink to="/plan">Plan</NavLink>
      </nav>
    </header>
  );
}
