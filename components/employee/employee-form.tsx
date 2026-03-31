"use client";

import { employeeDefaultValues } from '@/lib/constants'
import { employeeSchema } from '@/lib/validators'
import { Department, Employee, Location } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { ArrowRight, CalendarIcon, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DeviceStatus, Status } from '@/lib/generated/prisma/enums';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { createEmployee, updateEmployee } from '@/lib/actions/employee';

const EmployeeForm = ({ data, update = false, locations, departments }: { data?: Employee, update: boolean, locations: Location[], departments: Department[] }) => {
    const router = useRouter()
    const id = data?.id;

    const form = useForm<z.infer<typeof employeeSchema>>({
        resolver: zodResolver(employeeSchema),
        defaultValues: data || employeeDefaultValues
    })

    const [isPending, startTransition] = React.useTransition()

    const onSubmit: SubmitHandler<z.infer<typeof employeeSchema>> = async (values: any) => {

        startTransition(async () => {
            let res;

            if (update && id) {
                res = await updateEmployee(values, id)
            } else {
                res = await createEmployee(values)
            }

            if (!res?.success) {
                toast.error("Error", {
                    description: res?.message
                })
            } else {
                router.push("/admin/employee")
            }

        })
    }
    return (
        <Form {...form}>
            <form className='space-y-4 grid grid-cols-2 gap-4' onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}>
                <div className='flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='first_name'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof employeeSchema>, "first_name">
                        }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter First name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='last_name'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof employeeSchema>, "last_name">
                        }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter Last name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof employeeSchema>, "email">
                        }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter email' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='phoneNumber'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof employeeSchema>, "phoneNumber">
                        }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter Phone Number' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>               
               
                <div className='flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='dateOfBirth'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof employeeSchema>, "dateOfBirth">
                        }) => (
                            <FormItem>
                                <FormLabel>Date of birth</FormLabel>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value as Date}
                                                onSelect={field.onChange}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='hireDate'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof employeeSchema>, "hireDate">
                        }) => (
                            <FormItem>
                                <FormLabel>Hire Date</FormLabel>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value as Date}
                                                onSelect={field.onChange}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='salary'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof employeeSchema>, "salary">
                        }) => (
                            <FormItem>
                                <FormLabel>Salary</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter Salary' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <div className='flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='departmentId'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof employeeSchema>, "departmentId">
                        }) => (
                            <FormItem>
                                <FormLabel>Department</FormLabel>
                                <FormControl>
                                    <Select
                                        defaultValue={field.value}
                                        onValueChange={(v) => field.onChange(v as string)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((department) => (department.id &&
                                                <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
                                            ))}

                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='locationId'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof employeeSchema>, "locationId">
                        }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Select
                                        defaultValue={field.value}
                                        onValueChange={(v) => field.onChange(v as string)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locations.map((location) => (location.id &&
                                                <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='status'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof employeeSchema>, "status">
                        }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Select
                                        defaultValue={field.value}
                                        onValueChange={(v) => field.onChange(v as Status)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={DeviceStatus.ACTIVE}>Active</SelectItem>
                                            <SelectItem value={DeviceStatus.INACTIVE}>Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex gap-2'>
                    <Button type='submit' className='cursor-pointer' disabled={isPending}>
                        {
                            isPending ? (<Loader className='w-4 h-4 animate-spin cursor-pointer' />) : (
                                <ArrowRight className='w-4 h-4' />
                            )
                        }{" "} Save
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default EmployeeForm