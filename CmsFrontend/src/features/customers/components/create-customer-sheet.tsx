'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useAppForm, useFormFields } from '@/components/ui/tanstack-form'
import { useMutation } from '@tanstack/react-query'
import { createCustomerMutation } from '../api/mutations'
import { toast } from 'sonner'
import { Icons } from '@/components/icons'
import * as z from 'zod'
import type { CreateCustomerPayload } from '../api/types'

export function CreateCustomerSheet() {
  const [open, setOpen] = useState(false)

  const create = useMutation({
    ...createCustomerMutation,
    onSuccess: () => {
      toast.success('Customer created')
      setOpen(false)
    },
    onError: () => toast.error('Failed to create customer')
  })

  const form = useAppForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      street: '',
      city: '',
      zipCode: '',
      country: ''
    } as CreateCustomerPayload,
    onSubmit: ({ value }) => create.mutate(value)
  })

  const { FormTextField } = useFormFields<CreateCustomerPayload>()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size='sm'>
          <Icons.add className='mr-2 h-4 w-4' />
          Add Customer
        </Button>
      </SheetTrigger>
      <SheetContent className='sm:max-w-md overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Add Customer</SheetTitle>
        </SheetHeader>

        <div className='mt-6'>
          <form.AppForm>
            <form.Form className='space-y-4'>
              <div className='grid grid-cols-2 gap-3'>
                <FormTextField
                  name='firstName'
                  label='First Name'
                  required
                  placeholder='Jane'
                  validators={{ onBlur: z.string().min(1, 'Required') }}
                />
                <FormTextField
                  name='lastName'
                  label='Last Name'
                  required
                  placeholder='Doe'
                  validators={{ onBlur: z.string().min(1, 'Required') }}
                />
              </div>

              <FormTextField
                name='email'
                label='Email'
                required
                type='email'
                placeholder='jane@example.com'
                validators={{ onBlur: z.string().email('Invalid email') }}
              />

              <FormTextField
                name='street'
                label='Street'
                required
                placeholder='123 Main St'
                validators={{ onBlur: z.string().min(1, 'Required') }}
              />

              <div className='grid grid-cols-2 gap-3'>
                <FormTextField
                  name='city'
                  label='City'
                  required
                  placeholder='New York'
                  validators={{ onBlur: z.string().min(1, 'Required') }}
                />
                <FormTextField
                  name='zipCode'
                  label='ZIP Code'
                  required
                  placeholder='10001'
                  validators={{ onBlur: z.string().min(1, 'Required') }}
                />
              </div>

              <FormTextField
                name='country'
                label='Country'
                required
                placeholder='United States'
                validators={{ onBlur: z.string().min(1, 'Required') }}
              />

              <div className='flex justify-end pt-2'>
                <form.SubmitButton>Create Customer</form.SubmitButton>
              </div>
            </form.Form>
          </form.AppForm>
        </div>
      </SheetContent>
    </Sheet>
  )
}
