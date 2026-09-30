'use client';
import { useEffect,useState } from 'react'; import { api } from '@/lib/api'; import TrendChart from '@/components/TrendChart';
export default function Dashboard(){ const [data,setData]=useState<any>(null); const [error,setError]=useState('');
  useEffect(()=>{api.get('/dashboard').then(r=>setData(r.data)).catch(()=>setError('Please sign in to view the dashboard.'));},[]);
  async function report(){ const r=await api.get('/reports/executive-summary.pdf',{responseType:'blob'}); const url=URL.createObjectURL(r.data); const a=document.createElement('a'); a.href=url; a.download='leadership-wellness-summary.pdf'; a.click(); URL.revokeObjectURL(url); }
  if(error)return <main className="container"><p className="error">{error}</p></main>; if(!data)return <main className="container">Loading…</main>;
  const latest=data.latest;
  return <main className="container"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h1>Wellness Dashboard</h1><button className="btn" onClick={report}>Download Executive Summary</button></div>
    {!latest?<div className="card">No survey data yet. Complete the weekly pulse survey.</div>:<>
    <section className="grid"><div className="card">Stress<div className="score">{latest.stress_score}</div></div><div className="card">Workload<div className="score">{latest.workload_score}</div></div><div className="card">Recovery<div className="score">{latest.recovery_score}</div></div><div className="card">Burnout Risk<div className="score">{latest.burnout_risk}</div></div></section>
    <section className="card" style={{marginTop:20}}><h2>12-week trend</h2><TrendChart data={data.trends}/></section>
    <section className="card" style={{marginTop:20}}><h2>Alerts</h2>{data.alerts.length?data.alerts.map((a:any)=><div className="alert" key={a.id}><strong>{a.alert_type}</strong><div>{a.message}</div></div>):<p>No active alerts.</p>}</section></>}
  </main>;
}
