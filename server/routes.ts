import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import {
  insertUserSchema,
  insertClientSchema,
  insertPlanSchema,
  insertClientPlanSchema,
  insertPaymentSchema,
  insertProgressTrackingSchema,
  insertAlertSchema,
  insertBrandingSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = express.Router();
  
  // Error handler middleware
  const handleError = (err: any, res: Response) => {
    if (err instanceof ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: err.errors 
      });
    }
    
    console.error("API Error:", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  };

  // Users routes
  apiRouter.post("/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.get("/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Clients routes
  apiRouter.get("/clients", async (req: Request, res: Response) => {
    try {
      const trainerId = parseInt(req.query.trainerId as string);
      
      if (isNaN(trainerId)) {
        return res.status(400).json({ message: "Valid trainerId is required" });
      }
      
      const clients = await storage.getClientsByTrainerId(trainerId);
      res.json(clients);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.post("/clients", async (req: Request, res: Response) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(clientData);
      res.status(201).json(client);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.get("/clients/:id", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.id);
      const client = await storage.getClient(clientId);
      
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      res.json(client);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.patch("/clients/:id", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.id);
      const clientData = req.body;
      
      const updatedClient = await storage.updateClient(clientId, clientData);
      
      if (!updatedClient) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      res.json(updatedClient);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.delete("/clients/:id", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.id);
      const success = await storage.deleteClient(clientId);
      
      if (!success) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.post("/clients/:id/archive", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.id);
      const client = await storage.archiveClient(clientId);
      
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      res.json(client);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Plans routes
  apiRouter.get("/plans", async (req: Request, res: Response) => {
    try {
      const trainerId = parseInt(req.query.trainerId as string);
      
      if (isNaN(trainerId)) {
        return res.status(400).json({ message: "Valid trainerId is required" });
      }
      
      const plans = await storage.getPlansByTrainerId(trainerId);
      res.json(plans);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.post("/plans", async (req: Request, res: Response) => {
    try {
      const planData = insertPlanSchema.parse(req.body);
      const plan = await storage.createPlan(planData);
      res.status(201).json(plan);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.get("/plans/:id", async (req: Request, res: Response) => {
    try {
      const planId = parseInt(req.params.id);
      const plan = await storage.getPlan(planId);
      
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      
      res.json(plan);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.patch("/plans/:id", async (req: Request, res: Response) => {
    try {
      const planId = parseInt(req.params.id);
      const planData = req.body;
      
      const updatedPlan = await storage.updatePlan(planId, planData);
      
      if (!updatedPlan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      
      res.json(updatedPlan);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.delete("/plans/:id", async (req: Request, res: Response) => {
    try {
      const planId = parseInt(req.params.id);
      const success = await storage.deletePlan(planId);
      
      if (!success) {
        return res.status(404).json({ message: "Plan not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      handleError(err, res);
    }
  });

  // Client Plans routes
  apiRouter.get("/client-plans", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.query.clientId as string);
      
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "Valid clientId is required" });
      }
      
      const clientPlans = await storage.getClientPlansByClientId(clientId);
      res.json(clientPlans);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.post("/client-plans", async (req: Request, res: Response) => {
    try {
      const clientPlanData = insertClientPlanSchema.parse(req.body);
      const clientPlan = await storage.assignPlanToClient(clientPlanData);
      res.status(201).json(clientPlan);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.patch("/client-plans/:id", async (req: Request, res: Response) => {
    try {
      const clientPlanId = parseInt(req.params.id);
      const clientPlanData = req.body;
      
      const updatedClientPlan = await storage.updateClientPlan(clientPlanId, clientPlanData);
      
      if (!updatedClientPlan) {
        return res.status(404).json({ message: "Client plan not found" });
      }
      
      res.json(updatedClientPlan);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.delete("/client-plans/:id", async (req: Request, res: Response) => {
    try {
      const clientPlanId = parseInt(req.params.id);
      const success = await storage.removeClientPlan(clientPlanId);
      
      if (!success) {
        return res.status(404).json({ message: "Client plan not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      handleError(err, res);
    }
  });

  // Payments routes
  apiRouter.get("/payments", async (req: Request, res: Response) => {
    try {
      const trainerId = req.query.trainerId as string;
      const clientId = req.query.clientId as string;
      
      let payments;
      
      if (trainerId) {
        payments = await storage.getPaymentsByTrainerId(parseInt(trainerId));
      } else if (clientId) {
        payments = await storage.getPaymentsByClientId(parseInt(clientId));
      } else {
        return res.status(400).json({ message: "Either trainerId or clientId is required" });
      }
      
      res.json(payments);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.post("/payments", async (req: Request, res: Response) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(paymentData);
      res.status(201).json(payment);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.patch("/payments/:id", async (req: Request, res: Response) => {
    try {
      const paymentId = parseInt(req.params.id);
      const paymentData = req.body;
      
      const updatedPayment = await storage.updatePayment(paymentId, paymentData);
      
      if (!updatedPayment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      res.json(updatedPayment);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Progress tracking routes
  apiRouter.get("/progress", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.query.clientId as string);
      
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "Valid clientId is required" });
      }
      
      const progressTrackings = await storage.getProgressTrackingsByClientId(clientId);
      res.json(progressTrackings);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.post("/progress", async (req: Request, res: Response) => {
    try {
      const progressData = insertProgressTrackingSchema.parse(req.body);
      const progress = await storage.createProgressTracking(progressData);
      res.status(201).json(progress);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.patch("/progress/:id", async (req: Request, res: Response) => {
    try {
      const progressId = parseInt(req.params.id);
      const progressData = req.body;
      
      const updatedProgress = await storage.updateProgressTracking(progressId, progressData);
      
      if (!updatedProgress) {
        return res.status(404).json({ message: "Progress tracking not found" });
      }
      
      res.json(updatedProgress);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Alerts routes
  apiRouter.get("/alerts", async (req: Request, res: Response) => {
    try {
      const trainerId = parseInt(req.query.trainerId as string);
      const unreadOnly = req.query.unreadOnly === 'true';
      
      if (isNaN(trainerId)) {
        return res.status(400).json({ message: "Valid trainerId is required" });
      }
      
      const alerts = unreadOnly
        ? await storage.getUnreadAlertsByTrainerId(trainerId)
        : await storage.getAlertsByTrainerId(trainerId);
      
      res.json(alerts);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.post("/alerts", async (req: Request, res: Response) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(alertData);
      res.status(201).json(alert);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.post("/alerts/:id/read", async (req: Request, res: Response) => {
    try {
      const alertId = parseInt(req.params.id);
      const alert = await storage.markAlertAsRead(alertId);
      
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      res.json(alert);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.delete("/alerts/:id", async (req: Request, res: Response) => {
    try {
      const alertId = parseInt(req.params.id);
      const success = await storage.deleteAlert(alertId);
      
      if (!success) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      handleError(err, res);
    }
  });

  // Branding routes
  apiRouter.get("/branding/:trainerId", async (req: Request, res: Response) => {
    try {
      const trainerId = parseInt(req.params.trainerId);
      const branding = await storage.getBrandingByTrainerId(trainerId);
      
      if (!branding) {
        return res.status(404).json({ message: "Branding not found" });
      }
      
      res.json(branding);
    } catch (err) {
      handleError(err, res);
    }
  });

  apiRouter.post("/branding", async (req: Request, res: Response) => {
    try {
      const brandingData = insertBrandingSchema.parse(req.body);
      const branding = await storage.createOrUpdateBranding(brandingData);
      res.status(201).json(branding);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Mount API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
