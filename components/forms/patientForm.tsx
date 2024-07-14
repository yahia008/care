"use client"

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormField
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import CustomFormField from '../ui/Customform'
import SubmitButton from '../Submit'
import { userform } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { createUser } from '@/lib/actions/patient.actions'





export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT ='phoneInput',
  CHECKBOX='checkbox',
  DATE_PICKER= 'datePicker',
  SELECT='select',
  SKELETON='skeleton',
}




const PatientForm = () => {
 const [isLoading, setLoading] = useState(false)
 const router = useRouter()

  const form = useForm<z.infer<typeof userform>>({
    resolver: zodResolver(userform),
    defaultValues: {
      name: "",
      email:'',
      phone:''
    },
  })
 
 async function onSubmit({name, email, phone}: z.infer<typeof userform>) {
  setLoading(true) 
  try{
    const userData = {
      name,
      email,
      phone
    }
    const user = await createUser(userData)
    if(user){
      console.log(user)
      router.push(`/patients/${user.$id}/register`)
    }
   }catch(error){
    console.log(error)
   }
    
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <section className='mb-12 space-y-4'>
      <h1>Hi there 👋</h1>
      <p className = "text-dark-700">Schedule your first appointment</p>
      </section>
      <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='name'
          label='full name'
          placeholder='yahya tijjani'
          iconSrc="/assets/icons/user.svg"
          iconAlt='user' disabled={false} renderSkeleton={undefined}      />
        
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='email'
          label='Email'
          placeholder='yahya@gmail.com'
          iconSrc="/assets/icons/email.svg"
          iconAlt='email' disabled={false} renderSkeleton={undefined}      />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name='phone'
          label='phone number'
          placeholder='(234) 123-4567' disabled={false}          
                 />
        
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm
