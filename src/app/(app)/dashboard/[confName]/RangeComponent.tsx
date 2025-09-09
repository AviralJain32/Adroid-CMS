import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { SubmittedPaper } from '@/types/SubmittedPaperType';
import { useState } from 'react';

// ✅ Validation Schema
const downloadRangeSchema = z.object({
  ranges: z.array(
    z
      .object({
        lowerRange: z
          .string()
          .transform(value => parseFloat(value))
          .refine(value => !isNaN(value) && value > 0, {
            message: 'Lower range must be a positive number',
          }),
        upperRange: z
          .string()
          .transform(value => parseFloat(value))
          .refine(value => !isNaN(value) && value > 0, {
            message: 'Upper range must be a positive number',
          }),
      })
      .refine(data => data.upperRange > data.lowerRange, {
        message: 'Upper range must be greater than lower range',
        path: ['upperRange'],
      }),
  ),
});

type DownloadRangeFormData = z.infer<typeof downloadRangeSchema>;

interface PaperSelectorProps {
  papers: SubmittedPaper[];
  onPapersSelected: (papers: SubmittedPaper[]) => void;
  open: boolean;                        // ✅ controlled prop
  onOpenChange: (open: boolean) => void; // ✅ controlled prop
}

export function PaperRangeSelector({
  papers,
  onPapersSelected,
  open,
  onOpenChange,
}: PaperSelectorProps) {
  const [availablePapers, setAvailablePapers] = useState<SubmittedPaper[]>([]);

  const form = useForm<DownloadRangeFormData>({
    resolver: zodResolver(downloadRangeSchema),
    defaultValues: {
      ranges: [{ lowerRange: 0, upperRange: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ 
    control: form.control,
    name: 'ranges',
  });

  // ✅ Core filter function
  const getPapersInRange = (
    ranges: DownloadRangeFormData['ranges'],
    papers: SubmittedPaper[],
  ) => {
    return papers.filter(paper => {
      const paperId = parseInt(paper.paperID.split('-').pop()!);
      return ranges.some(
        range => paperId >= range.lowerRange && paperId <= range.upperRange,
      );
    });
  };

  const onCheck = (data: DownloadRangeFormData) => {
    const filtered = getPapersInRange(data.ranges, papers);
    setAvailablePapers(filtered);
  };

  const onConfirm = (data: DownloadRangeFormData) => {
    const filtered = getPapersInRange(data.ranges, papers);
    onPapersSelected(filtered); // ✅ Give back sanitized list
    onOpenChange(false);        // ✅ close after confirm
  };

  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onConfirm)} className="space-y-6">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Enter the range of papers you want to select
              </AlertDialogTitle>
              <AlertDialogDescription>
                Provide multiple ranges of paper numbers (e.g., 1-10, 15-30).
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* Dynamic Range Fields */}
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4">
                <FormField
                  control={form.control}
                  name={`ranges.${index}.lowerRange`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From (Lower Range)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="Enter lower range" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`ranges.${index}.upperRange`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To (Upper Range)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="Enter upper range" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      variant="outline"
                      className="text-red-600"
                    >
                      Remove Range
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {/* Add new range */}
            <Button
              type="button"
              onClick={() => append({ lowerRange: 0, upperRange: 0 })}
              variant="outline"
            >
              Add Range
            </Button>

            {/* Check Available Papers */}
            <Button
              type="button"
              onClick={form.handleSubmit(onCheck)}
              variant="outline"
            >
              Check Available Papers
            </Button>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
              <Button type="submit">Confirm Selection</Button>
            </AlertDialogFooter>
          </form>
        </Form>

        {/* Preview Available Papers */}
        {availablePapers.length > 0 ? (
          <div className="mt-4">
            <h3 className="font-bold">Available Papers:</h3>
            <ul className="list-disc list-inside">
              {availablePapers.map(paper => (
                <li key={paper.paperID}>Paper ID: {paper.paperID}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div>No papers in these ranges</div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
