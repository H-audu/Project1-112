INSERT INTO departments (name) VALUES
  ('Executive Leadership'), ('Operations'), ('Finance'), ('Human Resources'), ('Public Health')
ON CONFLICT (name) DO NOTHING;

INSERT INTO survey_questions (prompt, domain, is_negative, display_order) VALUES
  ('I felt emotionally exhausted.', 'STRESS', TRUE, 1),
  ('I felt overwhelmed.', 'STRESS', TRUE, 2),
  ('My stress affected my decisions.', 'STRESS', TRUE, 3),
  ('I had difficulty concentrating.', 'STRESS', TRUE, 4),
  ('My workload is manageable.', 'WORKLOAD', FALSE, 5),
  ('Deadlines are reasonable.', 'WORKLOAD', FALSE, 6),
  ('Meetings are productive.', 'WORKLOAD', FALSE, 7),
  ('I can focus on important work.', 'WORKLOAD', FALSE, 8),
  ('I had enough time to recover this week.', 'RECOVERY', FALSE, 9),
  ('I slept well.', 'RECOVERY', FALSE, 10),
  ('I disconnected after work.', 'RECOVERY', FALSE, 11),
  ('I took sufficient breaks.', 'RECOVERY', FALSE, 12),
  ('I felt supported by my organization.', 'SUPPORT', FALSE, 13),
  ('My supervisor supports me.', 'SUPPORT', FALSE, 14),
  ('I feel psychologically safe.', 'SUPPORT', FALSE, 15),
  ('I have enough resources.', 'SUPPORT', FALSE, 16)
ON CONFLICT DO NOTHING;
