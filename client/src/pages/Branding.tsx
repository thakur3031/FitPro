import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as Icons from "@/lib/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Create schema for branding form
const brandingSchema = z.object({
  logoUrl: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message: "Must be a valid hex color code (e.g., #4B5563)",
  }),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message: "Must be a valid hex color code (e.g., #9CA3AF)",
  }),
  messageStyle: z.enum(["professional", "friendly", "motivational"]),
  termsOfService: z.string().min(10, {
    message: "Terms of service must be at least 10 characters",
  }),
});

type BrandingFormValues = z.infer<typeof brandingSchema>;

const Branding: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("branding");
  const trainerId = 1; // In a real app, this would be the logged-in trainer's ID

  const { data: branding, isLoading } = useQuery({
    queryKey: [`/api/branding/${trainerId}`],
    retry: 1,
  });

  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      logoUrl: "",
      primaryColor: "#4338ca", // Default primary color
      secondaryColor: "#9ca3af", // Default secondary color
      messageStyle: "professional",
      termsOfService: "Default terms of service for fitness training. Clients must agree to these terms before starting any training program.",
    },
  });

  useEffect(() => {
    if (branding) {
      form.reset({
        logoUrl: branding.logoUrl || "",
        primaryColor: branding.primaryColor || "#4338ca",
        secondaryColor: branding.secondaryColor || "#9ca3af",
        messageStyle: branding.messageStyle || "professional",
        termsOfService: branding.termsOfService || "Default terms of service for fitness training. Clients must agree to these terms before starting any training program.",
      });
    }
  }, [branding, form]);

  const updateBranding = useMutation({
    mutationFn: (data: BrandingFormValues) => 
      apiRequest("POST", "/api/branding", {
        ...data,
        trainerId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/branding/${trainerId}`] });
      toast({
        title: "Branding updated",
        description: "Your branding settings have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating branding",
        description: error.message || "There was an error updating your branding settings.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: BrandingFormValues) => {
    updateBranding.mutate(data);
  };

  // Preview component for branding
  const BrandingPreview = () => {
    const { primaryColor, secondaryColor, messageStyle } = form.watch();
    
    let messageStyleClass = "font-normal";
    if (messageStyle === "friendly") {
      messageStyleClass = "font-medium text-blue-600 dark:text-blue-400";
    } else if (messageStyle === "motivational") {
      messageStyleClass = "font-bold text-orange-600 dark:text-orange-400";
    }

    return (
      <div className="space-y-6">
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Brand Preview</h3>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Primary Color:</p>
            <div 
              className="w-full h-10 rounded-md border"
              style={{ backgroundColor: primaryColor }}
            ></div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Secondary Color:</p>
            <div 
              className="w-full h-10 rounded-md border"
              style={{ backgroundColor: secondaryColor }}
            ></div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">Message Style Sample:</p>
            <p className={messageStyleClass}>
              {messageStyle === "professional" && "We look forward to helping you achieve your fitness goals."}
              {messageStyle === "friendly" && "Hey there! Excited to work with you on your fitness journey! 😊"}
              {messageStyle === "motivational" && "YOU'VE GOT THIS! Every step takes you closer to your goals! 💪"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Branding & Customization</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Customize Your Brand</CardTitle>
                <CardDescription>
                  Personalize how your clients see your brand across all platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-full h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
                    ))}
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <TabsContent value="branding" className="m-0">
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="logoUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Logo URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://example.com/logo.svg" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Enter the URL to your logo image (SVG recommended)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="primaryColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Color</FormLabel>
                                <div className="flex items-center gap-2">
                                  <Input {...field} />
                                  <div 
                                    className="w-10 h-10 rounded-md border"
                                    style={{ backgroundColor: field.value }}
                                  ></div>
                                </div>
                                <FormDescription>
                                  Use hexadecimal color code (e.g., #4338ca)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="secondaryColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Secondary Color</FormLabel>
                                <div className="flex items-center gap-2">
                                  <Input {...field} />
                                  <div 
                                    className="w-10 h-10 rounded-md border"
                                    style={{ backgroundColor: field.value }}
                                  ></div>
                                </div>
                                <FormDescription>
                                  Use hexadecimal color code (e.g., #9ca3af)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="messageStyle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Message Style</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a style" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="friendly">Friendly</SelectItem>
                                    <SelectItem value="motivational">Motivational</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Choose the tone for automated messages to clients
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="terms" className="m-0">
                        <FormField
                          control={form.control}
                          name="termsOfService"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Terms of Service</FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={12}
                                  placeholder="Enter your terms of service here..."
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                These terms will be displayed to clients during onboarding
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      
                      <TabsContent value="preview" className="m-0">
                        <BrandingPreview />
                      </TabsContent>
                      
                      <CardFooter className="px-0 pt-6">
                        <Button 
                          type="submit" 
                          disabled={updateBranding.isPending}
                          className="ml-auto"
                        >
                          {updateBranding.isPending ? (
                            <>
                              <Icons.Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>Save Changes</>
                          )}
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:mt-0 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Branding Tips</CardTitle>
                <CardDescription>
                  Maximize your brand impact with these professional tips
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400">
                    <Icons.PaletteIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Color Psychology</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Blue conveys trust and reliability, green suggests health and growth, while red creates urgency and passion.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
                    <Icons.MessageCircleIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Consistent Messaging</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Keep your tone consistent across all client communications to build a recognizable brand voice.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full text-purple-600 dark:text-purple-400">
                    <Icons.ImageIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Visual Identity</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Use a high-quality logo that works well at different sizes and across various platforms.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full text-amber-600 dark:text-amber-400">
                    <Icons.ScrollIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Terms of Service</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Clear, professional terms build trust while protecting your business. Consider having a legal professional review your terms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Preview Clients View</CardTitle>
                <CardDescription>
                  See how clients will experience your branding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-md text-center">
                  <div className="flex justify-center mb-4">
                    <Icons.MonitorSmartphoneIcon className="h-16 w-16 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Preview how your branding appears across client platforms
                  </p>
                  <Button variant="outline" disabled>
                    Client View (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Branding;
