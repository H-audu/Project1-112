'use client';
import { FormEvent,useEffect,useState } from 'react'; import { useRouter } from 'next/navigation'; import { api } from '@/lib/api';
export default function Survey(){ const [questions,setQuestions]=useState<any[]>([]); const [error,setError]=useState(''); const router=useRouter();
  useEffect(()=>{api.get('/surveys/questions').then(r=>setQuestions(r.data)).catch(()=>setError('Please sign in before completing the survey.'));},[]);
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault(); setError(''); const fd=new FormData(e.currentTarget); const answers=questions.map(q=>({questionId:q.id,response:Number(fd.get(q.id))}));
    try{await api.post('/surveys/submissions',{reportingWeek:String(fd.get('reportingWeek')),hoursWorked:Number(fd.get('hoursWorked'))||undefined,vacationDays:Number(fd.get('vacationDays'))||0,sickDays:Number(fd.get('sickDays'))||0,comments:String(fd.get('comments')||''),answers}); router.push('/dashboard');}
    catch(err:any){setError(err.response?.data?.error||'Unable to submit survey.');}}
  const today=new Date().toISOString().slice(0,10);
  return <main className="container"><form className="card" onSubmit={submit}><h1>Weekly Leadership Pulse Survey</h1><p className="muted">Answer each item from 1 (Strongly disagree) to 5 (Strongly agree).</p>
    <div className="grid"><label>Reporting week<input name="reportingWeek" type="date" defaultValue={today} required/></label><label>Hours worked<input name="hoursWorked" type="number" min="0" max="168" step="0.5"/></label><label>Vacation days<input name="vacationDays" type="number" min="0" max="7" step="0.5"/></label><label>Sick days<input name="sickDays" type="number" min="0" max="7" step="0.5"/></label></div>
    {questions.map((q,i)=><div className="question" key={q.id}><strong>{i+1}. {q.prompt}</strong><div className="scale">{[1,2,3,4,5].map(v=><label key={v}><input required type="radio" name={q.id} value={v}/>{v}</label>)}</div></div>)}
    <label>Optional comments<textarea name="comments" rows={4}/></label>{error&&<p className="error">{error}</p>}<button className="btn" style={{marginTop:16}}>Submit survey</button>
  </form></main>;
}
