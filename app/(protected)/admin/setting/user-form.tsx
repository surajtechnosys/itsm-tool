"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createRole } from "@/lib/actions/role-action"
import { createUser } from "@/lib/actions/user-action";
import { roleDefaultValues } from "@/lib/constants"
import { userSchema } from "@/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function AddAndUpdateUserPopover({ data, update }: { data?: any, update: boolean }) {

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: data || roleDefaultValues
    })

    const [isPending, startTransition] = React.useTransition()

    const onSubmit: SubmitHandler<z.infer<typeof userSchema>> = async (values: any) => {
        startTransition(async () => {
            const res = await createUser(values)

            if (!res?.success) {
                toast.error("Error", {
                    description: res?.message
                })
            }
        })
    }

    return <>
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline">{update ? "Edit" : "Add"} User</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{update ? "Edit" : "Add"} User</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name" defaultValue={data?.name} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">Email</Label>
                            <Input id="name-1" name="name" defaultValue={data?.name} />
                        </div>
                         <div className="grid gap-3">
                            <Label htmlFor="username-1">Image</Label>
                            <Input id="name-1" name="name" defaultValue={data?.name} />
                        </div>
                         <div className="grid gap-3">
                            <Label htmlFor="username-1">Password</Label>
                            <Input id="name-1" name="name" defaultValue={data?.name} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">Role</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Role" defaultValue={data?.status} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">Description</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Status" defaultValue={data?.status} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    </>
}