import { useState } from "react";
import { usePayments } from "@/hooks/use-payments";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import * as Icons from "@/lib/icons";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Payment } from "@shared/schema";

// Create a schema for payment validation
const paymentSchema = z.object({
  clientId: z.number().min(1, "Please select a client"),
  amount: z.number().min(1, "Amount must be at least 1"),
  description: z.string().min(2, "Description is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please select a valid date",
  }),
  isPaid: z.boolean().default(false),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const Payments: React.FC = () => {
  const { payments, clients, isLoading, createPayment, updatePayment } = usePayments();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { toast } = useToast();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      clientId: 0,
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
      isPaid: false,
    },
  });

  const filteredPayments = payments?.filter(
    (payment) =>
      (filterStatus === "all" || 
       (filterStatus === "paid" && payment.isPaid) || 
       (filterStatus === "unpaid" && !payment.isPaid)) &&
      ((payment.description && payment.description.toLowerCase().includes(searchQuery.toLowerCase())) || 
       (clients?.find(c => c.id === payment.clientId)?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddNew = () => {
    form.reset({
      clientId: 0,
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
      isPaid: false,
    });
    setSelectedPayment(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (payment: Payment) => {
    form.reset({
      clientId: payment.clientId,
      amount: payment.amount,
      description: payment.description,
      date: new Date(payment.date).toISOString().split("T")[0],
      isPaid: payment.isPaid,
    });
    setSelectedPayment(payment);
    setIsFormModalOpen(true);
  };

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      if (selectedPayment) {
        await updatePayment.mutateAsync({
          id: selectedPayment.id,
          ...data,
        });
        toast({
          title: "Payment updated",
          description: "The payment has been successfully updated.",
        });
      } else {
        await createPayment.mutateAsync(data);
        toast({
          title: "Payment added",
          description: "The payment has been successfully added.",
        });
      }
      setIsFormModalOpen(false);
    } catch (error) {
      console.error("Error saving payment:", error);
      toast({
        title: "Error",
        description: "There was an error saving the payment.",
        variant: "destructive",
      });
    }
  };

  const getClientName = (clientId: number) => {
    return clients?.find(client => client.id === clientId)?.name || "Unknown Client";
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Payment Tracking</h1>
        <div className="flex w-full sm:w-auto gap-2">
          <Button onClick={handleAddNew}>
            <Icons.PlusIcon className="h-4 w-4 mr-2" />
            Add Payment
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Icons.SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search payments or clients"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
              ))}
            </div>
          ) : filteredPayments && filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{getClientName(payment.clientId)}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">${payment.amount}</TableCell>
                      <TableCell>
                        <Badge variant={payment.isPaid ? "default" : "destructive"} className={payment.isPaid ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : ""}>
                          {payment.isPaid ? "Paid" : "Unpaid"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(payment)}
                        >
                          <Icons.PencilIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              {payments && payments.length > 0 ? (
                <div>
                  <Icons.SearchXIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-semibold">No results found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              ) : (
                <div>
                  <Icons.CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-semibold">No payments yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Start tracking payments by adding your first payment record.
                  </p>
                  <Button onClick={handleAddNew}>
                    <Icons.PlusIcon className="h-4 w-4 mr-2" />
                    Add Payment
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Form Modal */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedPayment ? "Edit Payment" : "Add New Payment"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients?.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPaid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Payment Status</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Mark if this payment has been received
                      </div>
                    </div>
                    <FormControl>
                      <Button
                        type="button"
                        variant={field.value ? "default" : "outline"}
                        onClick={() => field.onChange(!field.value)}
                        className={field.value ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {field.value ? "Paid" : "Unpaid"}
                      </Button>
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || createPayment.isPending || updatePayment.isPending}
                >
                  {form.formState.isSubmitting || createPayment.isPending || updatePayment.isPending ? (
                    <Icons.Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  {selectedPayment ? "Update Payment" : "Add Payment"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
