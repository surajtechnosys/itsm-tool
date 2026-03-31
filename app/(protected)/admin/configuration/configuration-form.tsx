"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useForm } from "react-hook-form";
import { Configuration } from "@/types";
import { configurationSchema } from "@/lib/validators";
import { toast } from "sonner";
import React from "react";
import { createOrUpdateConfiguration } from "@/lib/actions/configuration";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ConfigurationForm = ({ data }: { data?: Configuration }) => {
  const router = useRouter();

  const form = useForm<Configuration>({
    resolver: zodResolver(configurationSchema) as any,
    defaultValues: data || {
      name: "",
      logo: "",
      favicon: "",

      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      fromEmail: "",
    },
  });

  const [isPending, startTransition] = React.useTransition();

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();


      return data;
    } catch (error: any) {

      return {
        success: false,
        message: error.message,
      };
    }
  };

  async function onSubmit(values: Configuration) {
    startTransition(async () => {
      try {
        if (values.logo instanceof File) {
          const res = await uploadImage(values.logo);

          if (!res?.success) {
            throw new Error("Logo upload failed");
          }

          values.logo = res.url; 
        }

        if (values.favicon instanceof File) {
          const res = await uploadImage(values.favicon);

          if (!res?.success) {
            throw new Error("Favicon upload failed");
          }

          values.favicon = res.url; 
        }

        const result = await createOrUpdateConfiguration(values);

        if (!result?.success) {
          toast.error(result.message);
        } else {
          toast.success(result.message);
          router.refresh();
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  }

  return (
    <Card className="mt-2 shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Configuration</h1>
        </div>
      </CardHeader>

      <CardContent className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Accordion
              type="multiple"
              className="w-full"
              defaultValue={["general", "email"]}
            >
              <AccordionItem value="general">
                <AccordionTrigger>General</AccordionTrigger>
                <AccordionContent className="space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter project name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) => {
                              field.onChange(e.target.files?.[0]);
                            }}
                          />
                        </FormControl>
                        {data?.logo && (
                          <div className="mt-4">
                            <Image
                              src={data?.logo as string}
                              height={100}
                              width={100}
                              alt=""
                            />
                          </div>
                        )}

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="favicon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Favicon</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) => {
                              field.onChange(e.target.files?.[0]);
                            }}
                          />
                        </FormControl>
                        {data?.favicon && (
                          <div className="mt-4">
                            <Image
                              src={data?.favicon as string}
                              height={100}
                              width={100}
                              alt=""
                            />
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="email">
                <AccordionTrigger>Email</AccordionTrigger>
                <AccordionContent className="space-y-8 mt-4">
                  <FormField
                    control={form.control}
                    name="smtpHost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Host</FormLabel>
                        <FormControl>
                          <Input placeholder="smtp.gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="smtpPort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Port</FormLabel>
                        <FormControl>
                          <Input placeholder="587" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="smtpUser"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Username</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="smtpPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fromEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Email</FormLabel>
                        <FormControl>
                          <Input placeholder="system@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ConfigurationForm;
