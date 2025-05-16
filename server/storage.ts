import {
  User, InsertUser, users,
  Client, InsertClient, clients,
  Plan, InsertPlan, plans,
  ClientPlan, InsertClientPlan, clientPlans,
  Payment, InsertPayment, payments,
  ProgressTracking, InsertProgressTracking, progressTracking,
  Alert, InsertAlert, alerts,
  Branding, InsertBranding, branding
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Client operations
  getClient(id: number): Promise<Client | undefined>;
  getClientsByTrainerId(trainerId: number): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
  archiveClient(id: number): Promise<Client | undefined>;
  
  // Plan operations
  getPlan(id: number): Promise<Plan | undefined>;
  getPlansByTrainerId(trainerId: number): Promise<Plan[]>;
  createPlan(plan: InsertPlan): Promise<Plan>;
  updatePlan(id: number, plan: Partial<InsertPlan>): Promise<Plan | undefined>;
  deletePlan(id: number): Promise<boolean>;
  
  // Client Plan operations
  getClientPlan(id: number): Promise<ClientPlan | undefined>;
  getClientPlansByClientId(clientId: number): Promise<ClientPlan[]>;
  assignPlanToClient(clientPlan: InsertClientPlan): Promise<ClientPlan>;
  updateClientPlan(id: number, clientPlan: Partial<InsertClientPlan>): Promise<ClientPlan | undefined>;
  removeClientPlan(id: number): Promise<boolean>;
  
  // Payment operations
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentsByClientId(clientId: number): Promise<Payment[]>;
  getPaymentsByTrainerId(trainerId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  deletePayment(id: number): Promise<boolean>;
  
  // Progress tracking operations
  getProgressTracking(id: number): Promise<ProgressTracking | undefined>;
  getProgressTrackingsByClientId(clientId: number): Promise<ProgressTracking[]>;
  createProgressTracking(progressTracking: InsertProgressTracking): Promise<ProgressTracking>;
  updateProgressTracking(id: number, progressTracking: Partial<InsertProgressTracking>): Promise<ProgressTracking | undefined>;
  deleteProgressTracking(id: number): Promise<boolean>;
  
  // Alert operations
  getAlert(id: number): Promise<Alert | undefined>;
  getAlertsByTrainerId(trainerId: number): Promise<Alert[]>;
  getUnreadAlertsByTrainerId(trainerId: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: number): Promise<Alert | undefined>;
  deleteAlert(id: number): Promise<boolean>;
  
  // Branding operations
  getBrandingByTrainerId(trainerId: number): Promise<Branding | undefined>;
  createOrUpdateBranding(branding: InsertBranding): Promise<Branding>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clients: Map<number, Client>;
  private plans: Map<number, Plan>;
  private clientPlans: Map<number, ClientPlan>;
  private payments: Map<number, Payment>;
  private progressTrackings: Map<number, ProgressTracking>;
  private alerts: Map<number, Alert>;
  private brandings: Map<number, Branding>;
  
  private userId: number;
  private clientId: number;
  private planId: number;
  private clientPlanId: number;
  private paymentId: number;
  private progressTrackingId: number;
  private alertId: number;
  private brandingId: number;
  
  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.plans = new Map();
    this.clientPlans = new Map();
    this.payments = new Map();
    this.progressTrackings = new Map();
    this.alerts = new Map();
    this.brandings = new Map();
    
    this.userId = 1;
    this.clientId = 1;
    this.planId = 1;
    this.clientPlanId = 1;
    this.paymentId = 1;
    this.progressTrackingId = 1;
    this.alertId = 1;
    this.brandingId = 1;
    
    // Initialize with demo data for development
    const demoUser: User = {
      id: this.userId++,
      username: 'fitprodash',
      password: 'password123',
      name: 'FitProDash',
      email: 'info@fitprodash.com',
      avatarUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120',
      createdAt: new Date()
    };
    this.users.set(demoUser.id, demoUser);
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Client operations
  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }
  
  async getClientsByTrainerId(trainerId: number): Promise<Client[]> {
    return Array.from(this.clients.values()).filter(client => client.trainerId === trainerId);
  }
  
  async createClient(client: InsertClient): Promise<Client> {
    const id = this.clientId++;
    const newClient: Client = { 
      ...client, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.clients.set(id, newClient);
    return newClient;
  }
  
  async updateClient(id: number, clientData: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient: Client = { 
      ...client, 
      ...clientData, 
      updatedAt: new Date() 
    };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }
  
  async deleteClient(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }
  
  async archiveClient(id: number): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const archivedClient: Client = { 
      ...client, 
      isActive: false, 
      updatedAt: new Date() 
    };
    this.clients.set(id, archivedClient);
    return archivedClient;
  }
  
  // Plan operations
  async getPlan(id: number): Promise<Plan | undefined> {
    return this.plans.get(id);
  }
  
  async getPlansByTrainerId(trainerId: number): Promise<Plan[]> {
    return Array.from(this.plans.values()).filter(plan => plan.trainerId === trainerId);
  }
  
  async createPlan(plan: InsertPlan): Promise<Plan> {
    const id = this.planId++;
    const newPlan: Plan = { ...plan, id, createdAt: new Date() };
    this.plans.set(id, newPlan);
    return newPlan;
  }
  
  async updatePlan(id: number, planData: Partial<InsertPlan>): Promise<Plan | undefined> {
    const plan = this.plans.get(id);
    if (!plan) return undefined;
    
    const updatedPlan: Plan = { ...plan, ...planData };
    this.plans.set(id, updatedPlan);
    return updatedPlan;
  }
  
  async deletePlan(id: number): Promise<boolean> {
    return this.plans.delete(id);
  }
  
  // Client Plan operations
  async getClientPlan(id: number): Promise<ClientPlan | undefined> {
    return this.clientPlans.get(id);
  }
  
  async getClientPlansByClientId(clientId: number): Promise<ClientPlan[]> {
    return Array.from(this.clientPlans.values()).filter(cp => cp.clientId === clientId);
  }
  
  async assignPlanToClient(clientPlan: InsertClientPlan): Promise<ClientPlan> {
    const id = this.clientPlanId++;
    const newClientPlan: ClientPlan = { ...clientPlan, id };
    this.clientPlans.set(id, newClientPlan);
    return newClientPlan;
  }
  
  async updateClientPlan(id: number, clientPlanData: Partial<InsertClientPlan>): Promise<ClientPlan | undefined> {
    const clientPlan = this.clientPlans.get(id);
    if (!clientPlan) return undefined;
    
    const updatedClientPlan: ClientPlan = { ...clientPlan, ...clientPlanData };
    this.clientPlans.set(id, updatedClientPlan);
    return updatedClientPlan;
  }
  
  async removeClientPlan(id: number): Promise<boolean> {
    return this.clientPlans.delete(id);
  }
  
  // Payment operations
  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }
  
  async getPaymentsByClientId(clientId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(payment => payment.clientId === clientId);
  }
  
  async getPaymentsByTrainerId(trainerId: number): Promise<Payment[]> {
    const trainerClients = await this.getClientsByTrainerId(trainerId);
    const clientIds = trainerClients.map(client => client.id);
    return Array.from(this.payments.values()).filter(payment => clientIds.includes(payment.clientId));
  }
  
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = this.paymentId++;
    const newPayment: Payment = { ...payment, id };
    this.payments.set(id, newPayment);
    return newPayment;
  }
  
  async updatePayment(id: number, paymentData: Partial<InsertPayment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updatedPayment: Payment = { ...payment, ...paymentData };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }
  
  async deletePayment(id: number): Promise<boolean> {
    return this.payments.delete(id);
  }
  
  // Progress tracking operations
  async getProgressTracking(id: number): Promise<ProgressTracking | undefined> {
    return this.progressTrackings.get(id);
  }
  
  async getProgressTrackingsByClientId(clientId: number): Promise<ProgressTracking[]> {
    return Array.from(this.progressTrackings.values())
      .filter(pt => pt.clientId === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createProgressTracking(progressTracking: InsertProgressTracking): Promise<ProgressTracking> {
    const id = this.progressTrackingId++;
    const newProgressTracking: ProgressTracking = { ...progressTracking, id };
    this.progressTrackings.set(id, newProgressTracking);
    return newProgressTracking;
  }
  
  async updateProgressTracking(id: number, progressTrackingData: Partial<InsertProgressTracking>): Promise<ProgressTracking | undefined> {
    const progressTracking = this.progressTrackings.get(id);
    if (!progressTracking) return undefined;
    
    const updatedProgressTracking: ProgressTracking = { ...progressTracking, ...progressTrackingData };
    this.progressTrackings.set(id, updatedProgressTracking);
    return updatedProgressTracking;
  }
  
  async deleteProgressTracking(id: number): Promise<boolean> {
    return this.progressTrackings.delete(id);
  }
  
  // Alert operations
  async getAlert(id: number): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }
  
  async getAlertsByTrainerId(trainerId: number): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.trainerId === trainerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getUnreadAlertsByTrainerId(trainerId: number): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.trainerId === trainerId && !alert.isRead)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = this.alertId++;
    const newAlert: Alert = { ...alert, id, createdAt: new Date() };
    this.alerts.set(id, newAlert);
    return newAlert;
  }
  
  async markAlertAsRead(id: number): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert: Alert = { ...alert, isRead: true };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }
  
  async deleteAlert(id: number): Promise<boolean> {
    return this.alerts.delete(id);
  }
  
  // Branding operations
  async getBrandingByTrainerId(trainerId: number): Promise<Branding | undefined> {
    return Array.from(this.brandings.values()).find(branding => branding.trainerId === trainerId);
  }
  
  async createOrUpdateBranding(brandingData: InsertBranding): Promise<Branding> {
    const existingBranding = await this.getBrandingByTrainerId(brandingData.trainerId);
    
    if (existingBranding) {
      const updatedBranding: Branding = { ...existingBranding, ...brandingData };
      this.brandings.set(existingBranding.id, updatedBranding);
      return updatedBranding;
    } else {
      const id = this.brandingId++;
      const newBranding: Branding = { ...brandingData, id };
      this.brandings.set(id, newBranding);
      return newBranding;
    }
  }
}

export const storage = new MemStorage();
