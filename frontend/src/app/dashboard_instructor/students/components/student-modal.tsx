"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Loader2, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { useAddStudent, useUpdateStudent } from "../hooks/use-students";
import type { Student } from "../types";

const studentSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .optional()
    .or(z.literal("")),  
  track_name: z.string().min(1, { message: "Track name is required" }),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  enrollment_date: z.date().optional().nullable(),
  status: z.enum(["active", "inactive", "suspended", "graduated"]).optional(),
  notes: z.string().optional().nullable(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  isEditMode?: boolean;
}

export function StudentModal({
  isOpen,
  onClose,
  student,
  isEditMode = !!student,
}: StudentModalProps) {
  const { toast } = useToast();
  const { mutate: addStudent, isPending: isAddingStudent } = useAddStudent();
  const { mutate: updateStudent, isPending: isUpdatingStudent } =
    useUpdateStudent();
  const [showPassword, setShowPassword] = useState(false);

  // Initialize form with default values to prevent controlled/uncontrolled warnings
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      track_name: "",
      phone: "",
      address: "",
      enrollment_date: new Date(),
      status: "active",
      notes: "",
    },
  });

  useEffect(() => {
    if (student) {
      // Set form values from the nested user object
      form.reset({
        username: student.user.username || "",
        email: student.user.email || "",
        // Don't set password for existing students
        password: "",
        track_name: student.track_name || "",
        phone: student.user.phone || "",
        address: student.user.address || "",
        enrollment_date: student.user.enrollment_date
          ? new Date(student.user.enrollment_date)
          : new Date(),
        status: (student.user.status as any) || "active",
        notes: student.user.notes || "",
      });
    } else {
      form.reset({
        username: "",
        email: "",
        password: "",
        track_name: "",
        phone: "",
        address: "",
        enrollment_date: new Date(),
        status: "active",
        notes: "",
      });
    }
  }, [student, form]);

  const onSubmit = (data: StudentFormValues) => {
    console.log("Form data to submit:", data);

    // Format the data to match API expectations
    const formattedData = {
      ...data,
      // Ensure enrollment_date is in the correct format (YYYY-MM-DD) if it exists
      ...(data.enrollment_date && {
        enrollment_date: format(data.enrollment_date, "yyyy-MM-dd"),
      }),
    };

    if (student) {
      // For updating, we need to structure the data correctly
      // Only include fields that have changed
      const userUpdates: Record<string, any> = {};

      // Only include password if provided
      // if (formattedData.password) {
      //   userUpdates.password = formattedData.password
      // }
      if (formattedData.password && formattedData.password.length >= 6) {
        userUpdates.password = formattedData.password; // يتم تحديث الباسورد فقط لو المستخدم أدخله
      }

      // Check which fields have changed and only include those
      if (formattedData.email !== student.user.email) {
        userUpdates.email = formattedData.email;
      }

      if (formattedData.phone !== student.user.phone) {
        userUpdates.phone = formattedData.phone || "";
      }

      if (formattedData.address !== student.user.address) {
        userUpdates.address = formattedData.address || "";
      }

      if (formattedData.status !== student.user.status) {
        userUpdates.status = formattedData.status || "active";
      }

      if (formattedData.notes !== student.user.notes) {
        userUpdates.notes = formattedData.notes || "";
      }
      if (formattedData.username !== student.user.username) {
        userUpdates.username = formattedData.username || "user";
      }

      if (formattedData.track_name !== student.track_name) {
        userUpdates.track_name = formattedData.track_name || "";
      }
     
      // if (formattedData.university !== student.university) {
      //   userUpdates.university = formattedData.university;
      // }
      // Format enrollment_date for comparison
      const currentEnrollmentDate = student.user.enrollment_date
        ? new Date(student.user.enrollment_date).toISOString().split("T")[0]
        : null;
      const newEnrollmentDate = formattedData.enrollment_date
        ? new Date(formattedData.enrollment_date).toISOString().split("T")[0]
        : null;

      if (newEnrollmentDate && newEnrollmentDate !== currentEnrollmentDate) {
        userUpdates.enrollment_date = newEnrollmentDate;
      }

      // Create the update payload with only changed fields
      const updatePayload: Record<string, any> = {
        id: student.id,
        user: {
          username: formattedData.username,  // إذا تم تغيير اسم المستخدم
          email: formattedData.email,        // إذا تم تغيير البريد الإلكتروني
          phone: formattedData.phone || "",  // إذا تم تغيير رقم الهاتف
          address: formattedData.address || "",  // إذا تم تغيير العنوان
          status: formattedData.status || "active", // إذا تم تغيير الحالة
          notes: formattedData.notes || "",  // إذا تم تغيير الملاحظات
          enrollment_date: formattedData.enrollment_date || "",  // إذا تم تغيير تاريخ التسجيل
        },
        track_name: formattedData.track_name, // إذا تم تغيير اسم المسار
      
        
      };

      // Only include track_name if it changed
      if (formattedData.track_name !== student.track_name) {
        updatePayload.track_name = formattedData.track_name;
      }

      // Only include user object if there are user updates
      if (Object.keys(userUpdates).length > 0) {
        updatePayload.user = userUpdates;
      }

      console.log("Update payload:", updatePayload);

      updateStudent(updatePayload, {
        onSuccess: () => {
          toast({
            title: "Student updated",
            description: "Student information has been updated successfully.",
          });
          onClose();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to update student: ${error.message}`,
            variant: "destructive",
          });
          console.error("Update error details:", error);
        },
      });
    } else {
      // For creating a new student
      const createPayload = {
        user: {
          username: formattedData.username,
          email: formattedData.email,
          password: formattedData.password, // Password is required for new students
          role: "student", // Set default role for new students
          phone: formattedData.phone || "",
          address: formattedData.address || "",
          enrollment_date:
            formattedData.enrollment_date ||
            new Date().toISOString().split("T")[0],
          status: formattedData.status || "active",
          notes: formattedData.notes || "",
        },
        track_name: formattedData.track_name,
      };

      console.log("Create payload:", createPayload);

      addStudent(createPayload, {
        onSuccess: () => {
          toast({
            title: "Student added",
            description: "New student has been added successfully.",
          });
          onClose();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to add student: ${error.message}`,
            variant: "destructive",
          });
          console.error("Add error details:", error);
        },
      });
    }
  };

  const isPending = isAddingStudent || isUpdatingStudent;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Student" : "Add New Student"}
          </DialogTitle>
          <DialogDescription>
            {student
              ? "Update the student's information below."
              : "Fill in the details to add a new student."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter student username' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='student@example.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='track_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Track Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Computer Science' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                !isEditMode && (
                  <FormItem>
                  <FormLabel>{student ? "New Password (leave empty to keep current)" : "Student Password"}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={student ? "Leave empty to keep current password" : "Enter student password"}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )
              )}
            /> */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) =>
                !isEditMode ? (
                  <FormItem>
                    <FormLabel>
                      {student
                        ? "New Password (leave empty to keep current)"
                        : "Student Password"}
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={
                            student
                              ? "Leave empty to keep current password"
                              : "Enter student password"
                          }
                          {...field}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='absolute right-0 top-0 h-full px-3'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) : (
                  <></> // ده هيرجع React Fragment فارغ لو `isEditMode` كان true
                )
              }
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='(123) 456-7890'
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='enrollment_date'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Enrollment Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
                          >
                            {(() => {
                              if (!field.value) return <span>Pick a date</span>;
                              try {
                                const date = new Date(field.value);
                                if (isNaN(date.getTime()))
                                  return <span>Pick a date</span>;
                                return format(date, "PPP");
                              } catch (e) {
                                return <span>Pick a date</span>;
                              }
                            })()}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value || undefined}
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
            </div>
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='123 Main St, City, State, Zip'
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value || "active"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select student status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='inactive'>Inactive</SelectItem>
                      <SelectItem value='suspended'>Suspended</SelectItem>
                      <SelectItem value='graduated'>Graduated</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Additional information about the student'
                      className='resize-none'
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='button' variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {student ? "Update Student" : "Add Student"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
