'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
export default function TrendChart({data}:{data:any[]}) { return <div style={{width:'100%',height:320}}><ResponsiveContainer><LineChart data={data}>
  <XAxis dataKey="reporting_week"/><YAxis domain={[0,100]}/><Tooltip/><Legend/>
  <Line type="monotone" dataKey="stress_score" name="Stress"/><Line type="monotone" dataKey="workload_score" name="Workload"/>
  <Line type="monotone" dataKey="recovery_score" name="Recovery"/><Line type="monotone" dataKey="support_score" name="Support"/>
</LineChart></ResponsiveContainer></div>; }
