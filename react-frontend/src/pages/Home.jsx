import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="reference-home" aria-labelledby="home-title">
      <div className="announcement"><span>NEW</span><p>Student Course Planning</p></div>
      <h1 id="home-title">Stay on track to graduate<em>one semester at a time</em></h1>
      <p className="reference-description">Track your courses, plan upcoming semesters, and see your progress in<br className="desktop-break" /> one simple workspace.</p>
      <div className="reference-actions">
        <Link className="reference-primary" to="/courses">Track courses <span aria-hidden="true">→</span></Link>
        <Link className="reference-secondary" to="/plan">Make a plan <span aria-hidden="true">→</span></Link>
      </div>
      <p className="reference-caption">A clearer path to graduation</p>
    </section>
  );
}
