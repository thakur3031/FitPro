import { pgTable, text, serial, integer, boolean, json, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  avatarUrl: true,
});

// Client schema
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url"),
  phone: text("phone"),
  goals: text("goals"),
  notes: text("notes"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertClientSchema = createInsertSchema(clients).pick({
  trainerId: true,
  name: true,
  email: true,
  avatarUrl: true,
  phone: true,
  goals: true,
  notes: true,
  isActive: true,
});

// Plan types enum
export const planTypeEnum = pgEnum("plan_type", ["fitness", "nutrition", "combined"]);

// Plans schema
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  type: planTypeEnum("type").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlanSchema = createInsertSchema(plans).pick({
  trainerId: true,
  name: true,
  description: true,
  type: true,
  content: true,
});

// Client Plans schema
export const clientPlans = pgTable("client_plans", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  planId: integer("plan_id").notNull().references(() => plans.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true).notNull(),
  notes: text("notes"),
});

export const insertClientPlanSchema = createInsertSchema(clientPlans).pick({
  clientId: true,
  planId: true,
  startDate: true,
  endDate: true,
  isActive: true,
  notes: true,
});

// Payment schema
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  isPaid: boolean("is_paid").default(false).notNull(),
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  clientId: true,
  amount: true,
  description: true,
  date: true,
  isPaid: true,
});

// Progress tracking schema
export const progressTracking = pgTable("progress_tracking", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  date: timestamp("date").defaultNow().notNull(),
  metrics: json("metrics").notNull(),
  notes: text("notes"),
});

export const insertProgressTrackingSchema = createInsertSchema(progressTracking).pick({
  clientId: true,
  date: true,
  metrics: true,
  notes: true,
});

// Alert schema
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").notNull().references(() => users.id),
  clientId: integer("client_id").references(() => clients.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAlertSchema = createInsertSchema(alerts).pick({
  trainerId: true,
  clientId: true,
  title: true,
  message: true,
  isRead: true,
});

// Branding schema
export const branding = pgTable("branding", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").notNull().references(() => users.id).unique(),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color"),
  secondaryColor: text("secondary_color"),
  messageStyle: text("message_style").default("professional").notNull(),
  termsOfService: text("terms_of_service"),
});

export const insertBrandingSchema = createInsertSchema(branding).pick({
  trainerId: true,
  logoUrl: true,
  primaryColor: true,
  secondaryColor: true,
  messageStyle: true,
  termsOfService: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Plan = typeof plans.$inferSelect;
export type InsertPlan = z.infer<typeof insertPlanSchema>;

export type ClientPlan = typeof clientPlans.$inferSelect;
export type InsertClientPlan = z.infer<typeof insertClientPlanSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type ProgressTracking = typeof progressTracking.$inferSelect;
export type InsertProgressTracking = z.infer<typeof insertProgressTrackingSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type Branding = typeof branding.$inferSelect;
export type InsertBranding = z.infer<typeof insertBrandingSchema>;
