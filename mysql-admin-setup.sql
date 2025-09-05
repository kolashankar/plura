-- MySQL Setup Commands for Admin User Credentials
-- Run these commands in your MySQL database to create admin users

-- 1. Create a super admin user (replace with your email)
INSERT INTO User (
  id, 
  name, 
  email, 
  avatarUrl, 
  role, 
  plan, 
  isActive, 
  createdAt, 
  updatedAt
) VALUES (
  UUID(), 
  'Super Admin', 
  'admin@yourwebsite.com', 
  'https://avatars.githubusercontent.com/u/1?v=4', 
  'AGENCY_OWNER', 
  'agency', 
  true, 
  NOW(), 
  NOW()
);

-- 2. Create admin user record (get the user ID from step 1)
-- Replace 'USER_ID_FROM_STEP_1' with the actual ID generated above
INSERT INTO AdminUser (
  id,
  userId,
  permissions,
  isSuperAdmin,
  createdAt,
  updatedAt
) VALUES (
  UUID(),
  (SELECT id FROM User WHERE email = 'admin@yourwebsite.com'),
  '["manage_users", "manage_agencies", "manage_plans", "manage_features", "manage_financial", "manage_marketplace", "manage_automation", "manage_support", "manage_api", "manage_announcements", "view_audit_logs", "manage_backups", "manage_system", "manage_security", "manage_scalability", "manage_settings", "view_analytics"]',
  true,
  NOW(),
  NOW()
);

-- 3. Create additional admin users (optional)
INSERT INTO User (
  id, 
  name, 
  email, 
  avatarUrl, 
  role, 
  plan, 
  isActive, 
  createdAt, 
  updatedAt
) VALUES 
(UUID(), 'Admin User 1', 'admin1@yourwebsite.com', 'https://avatars.githubusercontent.com/u/2?v=4', 'AGENCY_ADMIN', 'unlimited', true, NOW(), NOW()),
(UUID(), 'Admin User 2', 'admin2@yourwebsite.com', 'https://avatars.githubusercontent.com/u/3?v=4', 'AGENCY_ADMIN', 'unlimited', true, NOW(), NOW());

-- 4. Create admin records for additional users
INSERT INTO AdminUser (
  id,
  userId,
  permissions,
  isSuperAdmin,
  createdAt,
  updatedAt
) VALUES 
(
  UUID(),
  (SELECT id FROM User WHERE email = 'admin1@yourwebsite.com'),
  '["manage_users", "manage_agencies", "manage_features", "manage_support", "view_analytics"]',
  false,
  NOW(),
  NOW()
),
(
  UUID(),
  (SELECT id FROM User WHERE email = 'admin2@yourwebsite.com'),
  '["manage_marketplace", "manage_automation", "view_audit_logs"]',
  false,
  NOW(),
  NOW()
);

-- 5. Set up initial feature flags for AI agent control
INSERT INTO FeatureFlag (
  id,
  name,
  `key`,
  description,
  isEnabled,
  rolloutType,
  rolloutData,
  createdAt,
  updatedAt
) VALUES 
(UUID(), 'AI Agent Feature', 'ai_agent_enabled', 'Controls access to AI agent functionality', true, 'plan_based', '{"plans": ["basic", "unlimited", "agency"]}', NOW(), NOW()),
(UUID(), 'Code Export Feature', 'code_export_enabled', 'Controls access to code export functionality', true, 'plan_based', '{"plans": ["basic", "unlimited", "agency"]}', NOW(), NOW()),
(UUID(), 'Automation Workflows', 'automation_workflows_enabled', 'Controls access to automation workflows', true, 'plan_based', '{"plans": ["unlimited", "agency"]}', NOW(), NOW()),
(UUID(), 'Theme Marketplace Selling', 'theme_selling_enabled', 'Controls access to selling themes in marketplace', true, 'plan_based', '{"plans": ["agency"]}', NOW(), NOW()),
(UUID(), 'White Label Branding', 'white_label_enabled', 'Controls access to white label branding', true, 'plan_based', '{"plans": ["unlimited", "agency"]}', NOW(), NOW()),
(UUID(), 'Advanced Analytics', 'advanced_analytics_enabled', 'Controls access to advanced analytics', true, 'plan_based', '{"plans": ["basic", "unlimited", "agency"]}', NOW(), NOW());

-- 6. Set up initial system configurations
INSERT INTO SystemConfig (
  id,
  `key`,
  `value`,
  type,
  description,
  isPublic,
  lastModifiedBy,
  createdAt,
  updatedAt
) VALUES 
(UUID(), 'max_ai_credits_per_user', '10000', 'number', 'Maximum AI credits per user per month', false, (SELECT id FROM AdminUser WHERE isSuperAdmin = true LIMIT 1), NOW(), NOW()),
(UUID(), 'max_automations_per_user', '50', 'number', 'Maximum automations per user', false, (SELECT id FROM AdminUser WHERE isSuperAdmin = true LIMIT 1), NOW(), NOW()),
(UUID(), 'enable_marketplace_selling', 'true', 'boolean', 'Enable theme and plugin selling in marketplace', true, (SELECT id FROM AdminUser WHERE isSuperAdmin = true LIMIT 1), NOW(), NOW()),
(UUID(), 'maintenance_mode', 'false', 'boolean', 'Put system in maintenance mode', false, (SELECT id FROM AdminUser WHERE isSuperAdmin = true LIMIT 1), NOW(), NOW()),
(UUID(), 'new_user_default_plan', 'free', 'string', 'Default plan for new users', false, (SELECT id FROM AdminUser WHERE isSuperAdmin = true LIMIT 1), NOW(), NOW());

-- 7. Create sample agency for testing (optional)
INSERT INTO Agency (
  id,
  name,
  agencyLogo,
  companyEmail,
  companyPhone,
  address,
  city,
  zipCode,
  state,
  country,
  goal,
  isActive,
  createdAt,
  updatedAt
) VALUES (
  UUID(),
  'Sample Agency',
  'https://avatars.githubusercontent.com/u/1?v=4',
  'agency@yourwebsite.com',
  '+1234567890',
  '123 Admin Street',
  'Admin City',
  '12345',
  'Admin State',
  'USA',
  10,
  true,
  NOW(),
  NOW()
);

-- 8. Link super admin to the sample agency (optional)
UPDATE User 
SET agencyId = (SELECT id FROM Agency WHERE name = 'Sample Agency')
WHERE email = 'admin@yourwebsite.com';

-- Verification queries to check if everything was set up correctly:
-- Check users:
SELECT u.id, u.name, u.email, u.role, u.plan, u.isActive, au.isSuperAdmin 
FROM User u 
LEFT JOIN AdminUser au ON u.id = au.userId 
WHERE u.email LIKE '%admin%';

-- Check admin permissions:
SELECT au.id, u.email, au.permissions, au.isSuperAdmin 
FROM AdminUser au 
JOIN User u ON au.userId = u.id;

-- Check feature flags:
SELECT * FROM FeatureFlag ORDER BY createdAt DESC;

-- Check system configs:
SELECT * FROM SystemConfig ORDER BY createdAt DESC;