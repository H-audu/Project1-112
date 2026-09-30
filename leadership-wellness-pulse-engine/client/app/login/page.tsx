'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
export default function Login() {
  const [mode,setMode]=useState<'login'|'register'>('login'); const [error,setError]=useState(''); const router=useRouter();
  async function submit(e:FormEvent<HTMLFormElement>) { e.preventDefault(); setError(''); const data=Object.fromEntries(new FormData(e.currentTarget));
    try { const response=await api.post(`/auth/${mode}`, mode==='login'?{email:data.email,password:data.password}:{fullName:data.fullName,email:data.email,password:data.password}); localStorage.setItem('token',response.data.token); router.push('/dashboard'); }
    catch(err:any){ setError(err.response?.data?.error || 'Unable to continue.'); }
  }
  return <main className="container"><form className="card form" onSubmit={submit}><h1>{mode==='login'?'Sign in':'Create account'}</h1>
    {mode==='register'&&<label>Full name<input name="fullName" required minLength={2}/></label>}
    <label>Email<input name="email" type="email" required/></label><label>Password<input name="password" type="password" required minLength={8}/></label>
    {error&&<p className="error">{error}</p>}<button className="btn">{mode==='login'?'Sign in':'Register'}</button>
    <button type="button" className="btn secondary" onClick={()=>setMode(mode==='login'?'register':'login')}>{mode==='login'?'Create an account':'Use existing account'}</button>
  </form></main>;
}
