import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { getUsers } from "@/lib/actions/user-action"
import { Module, Role, User } from "@/types"
import { getRoles } from "@/lib/actions/role-action"
import { getModules } from "@/lib/actions/module-action"
import { RoleTable } from "./role-table"
import { UserTable } from "./user-table"
import { ModuleTable } from "./module-table"
import React from "react"
import { Button } from "@/components/ui/button"
import AddAndUpdateRolePopover from "./role-form"
import { roleDefaultValues } from "@/lib/constants"
import AddAndUpdateUserPopover from "./user-form"
import AddAndUpdateModulePopover from "./module-form"

export default async function Setting() {
    const users = await getUsers()
    const roles = await getRoles()
    const modules = await getModules()

    return (
        <div className="flex w-full flex-col gap-6">
            <Tabs defaultValue="user" className="w-full">
                <TabsList className="flex w-full justify-between">
                    <TabsTrigger value="user">User</TabsTrigger>
                    <TabsTrigger value="role">Role</TabsTrigger>
                    <TabsTrigger value="module">Module</TabsTrigger>
                </TabsList>
                <TabsContent value="user">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>User</CardTitle>
                                <AddAndUpdateUserPopover update={false} />
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <UserTable user={users as User[]} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="role">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Role</CardTitle>
                                <AddAndUpdateRolePopover update={false} />
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <RoleTable role={roles as Role[]} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="module">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Module</CardTitle>
                                <AddAndUpdateModulePopover update={false} />
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <ModuleTable modules={modules as Module[]} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
