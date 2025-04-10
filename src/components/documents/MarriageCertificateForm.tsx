
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, FileText, LoaderCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { documentRequirements } from '@/data/services';
import DocumentUploader from './DocumentUploader';

const formSchema = z.object({
  brideName: z.string().min(2, { message: "Bride's name is required" }),
  groomName: z.string().min(2, { message: "Groom's name is required" }),
  marriageDate: z.date({ required_error: "Date of marriage is required" }),
  placeOfMarriage: z.string().min(2, { message: "Place of marriage is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  purpose: z.string().min(5, { message: "Purpose is required" }),
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const MarriageCertificateForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brideName: "",
      groomName: "",
      placeOfMarriage: "",
      address: "",
      purpose: "",
      additionalNotes: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (attachments.length === 0) {
      toast.error("Please upload required documents");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form Data:', data);
      console.log('Attachments:', attachments);
      
      toast.success("Marriage certificate request submitted successfully");
      form.reset();
      setAttachments([]);
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-gov-blue-800">
          <FileText className="mr-2 h-5 w-5" />
          Marriage Certificate Request
        </CardTitle>
        <CardDescription>
          Fill out the form to request a marriage certificate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brideName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bride's Full Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter bride's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="groomName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Groom's Full Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter groom's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="marriageDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Marriage <span className="text-red-500">*</span></FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select date of marriage</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="placeOfMarriage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place of Marriage <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter place of marriage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Address <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter current address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose of Certificate <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea placeholder="Explain why you need this certificate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Label>Required Documents <span className="text-red-500">*</span></Label>
              <div className="bg-gov-blue-50 rounded-lg p-4 border border-gov-blue-100 mb-4">
                <ul className="list-disc pl-5 space-y-1">
                  {documentRequirements.marriage.map((requirement, index) => (
                    <li key={index} className="text-sm text-gov-blue-700">
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
              
              <DocumentUploader 
                attachments={attachments}
                setAttachments={setAttachments}
              />
            </div>
            
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional information" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-gov-blue-600 hover:bg-gov-blue-700 text-white transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t px-6 py-3">
        <p className="text-xs text-gray-500">
          Note: Processing of marriage certificate applications typically takes 7-10 working days. You will receive updates on your application status.
        </p>
      </CardFooter>
    </Card>
  );
};

export default MarriageCertificateForm;
