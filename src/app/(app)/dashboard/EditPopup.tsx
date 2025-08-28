'use client';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { paperSubmissionSchema } from '@/schemas/paperCreation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react'; // Loading spinner icon

interface DefaultValues {
  paperAuthor: [];
  correspondingAuthor: [];
  paperTitle: string;
  paperFile: string;
  paperKeywords: string[];
  paperAbstract: string;
  paperSubmissionDate: Date;
  conference: { conferenceAcronym: string };
  paperStatus: 'submitted' | 'accepted' | 'rejected' | 'review';
  paperID: string;
}

const EditPopup = ({
  paperID,
  paperTitle,
  paperKeywords,
  paperAbstract,
  paperAuthor,
  correspondingAuthor,
  conference
}: DefaultValues) => {
  const CorrespondingAuthors = correspondingAuthor.map((author: Object) => ({
    ...author,
    isCorrespondingAuthor: true,
  }));

  const params = useParams<{ confAcronym: string }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof paperSubmissionSchema>>({
    resolver: zodResolver(paperSubmissionSchema),
    defaultValues: {
      paperTitle: paperTitle,
      paperKeywords: paperKeywords.join(', '),
      paperAbstract: paperAbstract,
      paperAuthors: [...paperAuthor, ...CorrespondingAuthors],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'paperAuthors',
  });

  const fileRef = form.register('paperFile');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof paperSubmissionSchema>) => {
    console.log(data);
    setIsLoading(true);
    const formData = new FormData();
    formData.append('paperTitle', data.paperTitle);
    formData.append('paperKeywords', data.paperKeywords);
    formData.append('paperAbstract', data.paperAbstract);
    formData.append('paperFile', data.paperFile[0]);
    formData.append('paperAuthors', JSON.stringify(data.paperAuthors));
    formData.append('conference', conference.conferenceAcronym);

    try {
      const response = await axios.put(
        `/api/edit-paper?paperID=${paperID}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log(response);

      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message,
          variant: 'default',
        });
        router.replace('/dashboard');
      } else {
        toast({
          title: 'Update Failed',
          description: response.data.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Edit</Button>
        </SheetTrigger>
        <SheetContent className="overflow-scroll w-full">
          <SheetHeader>
            <SheetTitle>Edit Paper Submission</SheetTitle>
            <SheetDescription>
              Make changes to your paper submission details.
            </SheetDescription>
          </SheetHeader>
          <div className="p-6 max-w-lg mx-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  name="paperTitle"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paper Title</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="paperKeywords"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paper Keywords</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="paperAbstract"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paper Abstract</FormLabel>
                      <Textarea {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="paperFile"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paper File</FormLabel>
                      <Input
                        type="file"
                        {...fileRef}
                        onChange={event => {
                          field.onChange(event.target?.files?.[0] ?? undefined);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <fieldset>
                  <legend className="text-lg font-medium">Authors</legend>
                  <div className="space-y-4 mt-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="space-y-4 mb-4 border-b pb-4"
                      >
                        {/* <FormField
                          name={`paperAuthors.${index}.FirstName`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <Input {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name={`paperAuthors.${index}.LastName`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <Input {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        /> */}
                        <FormField
                          name={`paperAuthors.${index}.name`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <Input {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name={`paperAuthors.${index}.email`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <Input {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Author Affiliation */}
                        <FormField
                          name={`paperAuthors.${index}.affiliation`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Affiliation</FormLabel>
                              <Input {...field} placeholder="Enter author affiliation" />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Author Country */}
                        <FormField
                          name={`paperAuthors.${index}.country`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Input {...field} placeholder="Enter author's country" />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* <FormField
                          name={`paperAuthors.${index}.Country`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Input {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name={`paperAuthors.${index}.Affiliation`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Affiliation</FormLabel>
                              <Input {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name={`paperAuthors.${index}.WebPage`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Web Page</FormLabel>
                              <Input {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        /> */}
                        <FormField
                          control={form.control}
                          name={`paperAuthors.${index}.isCorrespondingAuthor`}
                          render={({ field }) => (
                            <FormItem className="flex items-start space-x-3 py-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="leading-none">
                                Corresponding Author
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => remove(index)}
                        >
                          Remove Author
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        append({
                         email: '',
                        name:"",
                        isCorrespondingAuthor: false,
                        affiliation:"",
                        country: "",
                        })
                      }
                    >
                      Add Author
                    </Button>
                  </div>
                </fieldset>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    'Submit Paper'
                  )}
                </Button>
              </form>
            </Form>
          </div>
          <SheetFooter>
            <SheetClose>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EditPopup;
