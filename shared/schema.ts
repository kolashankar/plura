import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  boolean,
  text,
  integer,
  decimal,
} from "drizzle-orm/pg-core";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  plan: varchar("plan").default("STARTER"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Funnel settings configuration
export const funnelSettings = pgTable("funnel_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  funnelId: varchar("funnel_id").notNull(),
  subaccountId: varchar("subaccount_id"),
  individualId: varchar("individual_id"),
  
  // SEO Settings
  metaTitle: varchar("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  ogImage: varchar("og_image"),
  customFavicon: varchar("custom_favicon"),
  
  // Analytics Settings
  googleAnalyticsId: varchar("google_analytics_id"),
  facebookPixelId: varchar("facebook_pixel_id"),
  customAnalyticsCode: text("custom_analytics_code"),
  
  // Performance Settings
  enableCaching: boolean("enable_caching").default(true),
  enableCompression: boolean("enable_compression").default(true),
  enableLazyLoading: boolean("enable_lazy_loading").default(true),
  
  // Security Settings
  enableSSL: boolean("enable_ssl").default(true),
  enableCsrfProtection: boolean("enable_csrf_protection").default(true),
  allowedOrigins: text("allowed_origins"),
  
  // Custom Code Settings
  customCss: text("custom_css"),
  customJs: text("custom_js"),
  customHeadCode: text("custom_head_code"),
  customBodyCode: text("custom_body_code"),
  
  // Domain Settings
  customDomain: varchar("custom_domain"),
  subDomain: varchar("sub_domain"),
  enableWwwRedirect: boolean("enable_www_redirect").default(false),
  
  // Backup & Export Settings
  autoBackupEnabled: boolean("auto_backup_enabled").default(true),
  backupFrequency: varchar("backup_frequency").default("daily"),
  exportFormat: varchar("export_format").default("react"),
  
  // Notification Settings
  emailNotifications: boolean("email_notifications").default(true),
  slackWebhookUrl: varchar("slack_webhook_url"),
  discordWebhookUrl: varchar("discord_webhook_url"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Automation configurations
export const automations = pgTable("automations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // 'social-media', 'email', 'ecommerce', 'analytics'
  webhookUrl: varchar("webhook_url"),
  isActive: boolean("is_active").default(false),
  config: jsonb("config"),
  status: varchar("status").default("stopped"),
  lastRun: timestamp("last_run"),
  executionCount: integer("execution_count").default(0),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }).default("0"),
  subaccountId: varchar("subaccount_id"),
  individualId: varchar("individual_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI component generations
export const aiGenerations = pgTable("ai_generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  prompt: text("prompt").notNull(),
  code: text("code").notNull(),
  preview: text("preview"),
  type: varchar("type").default("component"),
  isActive: boolean("is_active").default(true),
  usageCount: integer("usage_count").default(0),
  subaccountId: varchar("subaccount_id"),
  individualId: varchar("individual_id"),
  funnelId: varchar("funnel_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Billing and subscription
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  agencyId: varchar("agency_id"),
  individualId: varchar("individual_id"),
  customerId: varchar("customer_id").notNull(),
  subscriptionId: varchar("subscription_id").unique(),
  priceId: varchar("price_id").notNull(),
  plan: varchar("plan").notNull(),
  status: varchar("status").default("active"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type FunnelSetting = typeof funnelSettings.$inferSelect;
export type InsertFunnelSetting = typeof funnelSettings.$inferInsert;
export type Automation = typeof automations.$inferSelect;
export type InsertAutomation = typeof automations.$inferInsert;
export type AIGeneration = typeof aiGenerations.$inferSelect;
export type InsertAIGeneration = typeof aiGenerations.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;