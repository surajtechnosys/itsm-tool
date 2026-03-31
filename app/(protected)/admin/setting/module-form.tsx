"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createUser } from "@/lib/actions/user-action";
import { moduleDefaultValues } from "@/lib/constants"
import { moduleSchema } from "@/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function AddAndUpdateModulePopover({ data, update }: { data?: any, update: boolean }) {

    const form = useForm<z.infer<typeof moduleSchema>>({
        resolver: zodResolver(moduleSchema),
        defaultValues: data || moduleDefaultValues
    })

    const [isPending, startTransition] = React.useTransition()

    const onSubmit: SubmitHandler<z.infer<typeof moduleSchema>> = async (values: any) => {
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
                    <Button variant="outline">{update ? "Edit" : "Add"} Module</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{update ? "Edit" : "Add"} Module</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name" defaultValue={data?.name} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">Description</Label>
                            <Textarea placeholder="Type your message here." defaultValue={data?.description} />
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