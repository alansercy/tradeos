-- TradeOS Seed Data — Austin Kethavong's demo data
-- Run AFTER schema.sql

-- Crew
insert into crew (id, name, initials, role) values
  ('11111111-0000-0000-0000-000000000001', 'Austin Kethavong', 'AK', 'foreman'),
  ('11111111-0000-0000-0000-000000000002', 'Mike Reyes',       'MR', 'journeyman'),
  ('11111111-0000-0000-0000-000000000003', 'Derek Carter',     'DC', 'journeyman'),
  ('11111111-0000-0000-0000-000000000004', 'Jose Lopez',       'JL', 'apprentice')
on conflict (id) do nothing;

-- Jobs
insert into jobs (id, name, gc_name, gc_contact, location, phase, crew, margin, contract_value, status, progress, deadline) values
  (
    '22222222-0000-0000-0000-000000000001',
    'Skyline Office Buildout',
    'Hernandez Construction',
    'Carlos Hernandez · (214) 555-0142',
    'Plano, TX',
    'rough-in',
    array[
      '11111111-0000-0000-0000-000000000001'::uuid,
      '11111111-0000-0000-0000-000000000002'::uuid,
      '11111111-0000-0000-0000-000000000003'::uuid
    ],
    38, 48500, 'active', 45, '2026-06-15'
  ),
  (
    '22222222-0000-0000-0000-000000000002',
    'Ranch House Café',
    'Southwest Builders',
    'Tom Silva · (972) 555-0283',
    'Frisco, TX',
    'service',
    array[
      '11111111-0000-0000-0000-000000000001'::uuid,
      '11111111-0000-0000-0000-000000000004'::uuid
    ],
    29, 31200, 'active', 30, '2026-05-22'
  ),
  (
    '22222222-0000-0000-0000-000000000003',
    'Pinnacle Suites — Phase 2',
    'DFW Commercial Group',
    'Rachel Park · (469) 555-0317',
    'Allen, TX',
    'trim-out',
    array[
      '11111111-0000-0000-0000-000000000002'::uuid,
      '11111111-0000-0000-0000-000000000003'::uuid
    ],
    47, 67000, 'active', 72, '2026-05-29'
  ),
  (
    '22222222-0000-0000-0000-000000000004',
    'Morrison Cold Storage',
    'Lone Star Industrial',
    'Dave Morrison · (214) 555-0199',
    'Garland, TX',
    'inspection',
    array['11111111-0000-0000-0000-000000000001'::uuid],
    52, 22800, 'active', 90, '2026-05-15'
  )
on conflict (id) do nothing;

-- Materials
insert into materials (job_id, item, quantity, unit, source, status, notes) values
  -- Skyline
  ('22222222-0000-0000-0000-000000000001', '#12 THHN wire (black/white/green)', 500, 'ft', 'Home Depot Plano · Order #HD-88221', 'on-site', '500ft coil'),
  ('22222222-0000-0000-0000-000000000001', '1" EMT conduit', 100, '10ft sticks', 'Home Depot Plano', 'on-site', 'In truck'),
  ('22222222-0000-0000-0000-000000000001', '20A duplex receptacles (commercial grade)', 48, 'ea', 'Graybar Electric', 'ordered', 'Est. delivery Wed 5/13'),
  ('22222222-0000-0000-0000-000000000001', 'Square D QO 20A breakers', 12, 'ea', null, 'needed', 'Required for panel rough-in'),
  ('22222222-0000-0000-0000-000000000001', 'Square D QO 30A breakers', 4, 'ea', null, 'needed', 'Required for panel rough-in'),
  ('22222222-0000-0000-0000-000000000001', '4" square metal junction boxes', 48, 'ea', 'Plano HD', 'needed', 'Check stock first'),
  -- Ranch House
  ('22222222-0000-0000-0000-000000000002', '400A 3-phase panel — Square D I-Line 42-space', 1, 'ea', 'Rexel Supply Frisco', 'on-site', 'Will call ready'),
  ('22222222-0000-0000-0000-000000000002', '2" rigid conduit + fittings', 60, 'ft', 'Rexel', 'ordered', 'ETA Tue 5/12 AM'),
  ('22222222-0000-0000-0000-000000000002', '4/0 aluminum service entrance cable', 100, 'ft', 'Rexel', 'needed', 'Confirm Oncor drop schedule first'),
  -- Pinnacle
  ('22222222-0000-0000-0000-000000000003', 'Decora switches + dimmers (spec per plan)', 85, 'ea', 'Leviton SmartGrade', 'on-site', 'In job box'),
  ('22222222-0000-0000-0000-000000000003', 'LED recessed cans — 6" 90W equiv', 120, 'ea', 'Commercial Electric', 'on-site', 'In job box'),
  ('22222222-0000-0000-0000-000000000003', 'Cover plates — white Decora', 90, 'ea', null, 'on-site', 'In job box');

-- Invoices
insert into invoices (job_id, invoice_number, client, amount, sent_date, days_outstanding, follow_up_status, follow_up_note) values
  (
    '22222222-0000-0000-0000-000000000003',
    'INV-2026-041', 'DFW Commercial Group', 18200,
    '2026-04-07', 32, 'sent', 'Called Apr 21, Apr 30'
  ),
  (
    '22222222-0000-0000-0000-000000000004',
    'INV-2026-038', 'Lone Star Industrial', 9800,
    '2026-04-12', 27, 'sent', 'Email Apr 28'
  ),
  (
    '22222222-0000-0000-0000-000000000002',
    'INV-2026-044', 'Southwest Builders', 4500,
    '2026-05-01', 8, 'none', 'Net-30 — not due yet'
  ),
  (
    '22222222-0000-0000-0000-000000000001',
    'INV-2026-046', 'Hernandez Construction', 2250,
    '2026-05-05', 4, 'none', 'Net-30 — not due yet'
  );
