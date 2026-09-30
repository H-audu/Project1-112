import Link from 'next/link';
export default function Home() {
  return <main className="container"><section className="card" style={{marginTop:40}}>
    <p className="muted">Public Health Surveillance · Occupational Health</p>
    <h1>Monitor leadership stress, workload, recovery, and support.</h1>
    <p>Complete a short weekly pulse survey, receive immediate risk scores, track trends, and generate an executive wellness summary.</p>
    <div style={{display:'flex',gap:12,marginTop:20}}><Link className="btn" href="/survey">Take the survey</Link><Link className="btn secondary" href="/dashboard">View dashboard</Link></div>
  </section></main>;
}
