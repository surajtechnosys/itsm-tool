"use client";

import { deviceCategoryDefaultValues, deviceDefaultValues } from '@/lib/constants'
import { deviceSchema } from '@/lib/validators'
import { Device, DeviceCategory } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { ArrowRight, CalendarIcon, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DeviceStatus, Status } from '@/lib/generated/prisma/enums';
import { createDevice, updateDevice } from '@/lib/actions/device-action';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const DeviceForm = ({ data, update = false, categories }: { data?: Device, update: boolean, categories: DeviceCategory[] }) => {
    const router = useRouter()
    const id = data?.id;

    const form = useForm<z.infer<typeof deviceSchema>>({
        resolver: zodResolver(deviceSchema) as any,
        defaultValues: (data ?? deviceDefaultValues) as z.infer<typeof deviceSchema>
    })

    const [isPending, startTransition] = React.useTransition()

    const onSubmit: SubmitHandler<z.infer<typeof deviceSchema>> = async (values: any) => {

        startTransition(async () => {
            let res;

            if (update && id) {
                res = await updateDevice(values, id)
            } else {
                res = await createDevice(values)
            }

            if (!res?.success) {
                toast.error("Error", {
                    description: res?.message
                })
            } else {
                router.push("/admin/device")
            }

        })
    }

    return (
        <Form {...form}>
            <form className='space-y-4  ' onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='flex flex-col gap-5 '>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof deviceSchema>, "name">
                        }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='serialNumber'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof deviceSchema>, "serialNumber">
                        }) => (
                            <FormItem>
                                <FormLabel>SerialNumber</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter Serial Number' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='manufacturer'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof deviceSchema>, "manufacturer">
                        }) => (
                            <FormItem>
                                <FormLabel>Manufacturer</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter manufacturer' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='model'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof deviceSchema>, "model">
                        }) => (
                            <FormItem>
                                <FormLabel>Model</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter model' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='purchaseDate'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof deviceSchema>, "purchaseDate">
                        }) => (
                            <FormItem>
                                <FormLabel>Purchase Date</FormLabel>
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
                        name='warrantyEnd'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof deviceSchema>, "warrantyEnd">
                        }) => (
                            <FormItem>
                                <FormLabel>Warranty End</FormLabel>
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
                        name='categoryId'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof deviceSchema>, "categoryId">
                        }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Select
                                        defaultValue={field.value}
                                        onValueChange={(v) => field.onChange(v as string)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (category.id &&
                                                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
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
                            field: ControllerRenderProps<z.infer<typeof deviceSchema>, "status">
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
                                            <SelectItem value={DeviceStatus.MAINTENANCE}>Maintenance</SelectItem>
                                            <SelectItem value={DeviceStatus.RETIRED}>Retired</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                </div>
                <div className='flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='description'
                        render={({
                            field
                        }: {
                            field: ControllerRenderProps<z.infer<typeof deviceSchema>, "description">
                        }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea rows={20} className='h-40' placeholder='Enter name' {...field} />
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

export default DeviceForm