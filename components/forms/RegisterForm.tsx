"use client";
import CustomFormField from "../ui/Customform";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import {
    Doctors,
    IdentificationTypes,
  GenderOptions,
    PatientFormDefaultValues}
  from "@/constants";
// import { registerPatient } from "@/lib/actions/patient.actions";
 import { PatientFormValidation } from "@/lib/validation";
import { FormFieldType } from "./patientForm";
import { FileUploader } from "../FileUploaser";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import SubmitButton from "../Submit";
import { registerPatient } from "@/lib/actions/patient.actions";

const RegisterForm = ({user}:{user:User}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
          ...PatientFormDefaultValues,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });

      const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
        setIsLoading(true)

        let formData;
        if (
          values.identificationDocument &&
          values.identificationDocument?.length > 0
        ) {
          const blobFile = new Blob([values.identificationDocument[0]], {
            type: values.identificationDocument[0].type,
          });
    
          formData = new FormData();
          formData.append("blobFile", blobFile);
          formData.append("fileName", values.identificationDocument[0].name);
        }
        
      try{
        const patientData = {
          ...values,
          userId:user.$id,
          birthDate:new Date(values.birthDate),
          identificationDocument:formData
        }
         //@ts-ignore
        const patient = await registerPatient(patientData);
        if(patient) router.push(`/patients/${user.$id}/new-appointment`)

      }catch(error){
        console.log(error)
        setIsLoading(false)
      }

      }
  return (
    <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex-1 space-y-12"
    >
      <section className="space-y-4">
        <h1 className="header">Welcome 👋</h1>
        <p className="text-dark-700">Let us know more about yourself.</p>
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Personal Information</h2>
        </div>

        {/* NAME */}

        <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="name"
                      placeholder="John Doe"
                      iconSrc="/assets/icons/user.svg"
                      iconAlt="user" disabled={false}        />

        {/* EMAIL & PHONE */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
                          fieldType={FormFieldType.INPUT}
                          control={form.control}
                          name="email"
                          label="Email address"
                          placeholder="johndoe@gmail.com"
                          iconSrc="/assets/icons/email.svg"
                          iconAlt="email" disabled={false}          />

          <CustomFormField
                          fieldType={FormFieldType.PHONE_INPUT}
                          control={form.control}
                          name="phone"
                          label="Phone Number"
                          placeholder="(555) 123-4567" disabled={false}          />
        </div>

        {/* BirthDate & Gender */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
                          fieldType={FormFieldType.DATE_PICKER}
                          control={form.control}
                          name="birthDate"
                          label="Date of birth" disabled={false}          />

          <CustomFormField
                          fieldType={FormFieldType.SKELETON}
                          control={form.control}
                          name="gender"
                          label="Gender"
                          renderSkeleton={(field) => (
                              <FormControl>
                                  <RadioGroup
                                      className="flex h-11 gap-6 xl:justify-between"
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                  >
                                      {GenderOptions.map((option, i) => (
                                          <div key={option + i} className="radio-group">
                                              <RadioGroupItem value={option} id={option} />
                                              <Label htmlFor={option} className="cursor-pointer">
                                                  {option}
                                              </Label>
                                          </div>
                                      ))}
                                  </RadioGroup>
                              </FormControl>
                          )} disabled={false}          />
        </div>

        {/* Address & Occupation */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
                          fieldType={FormFieldType.INPUT}
                          control={form.control}
                          name="address"
                          label="Address"
                          placeholder="14 street, New york, NY - 5101" disabled={false}          />

          <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="occupation"
              label="Occupation"
              placeholder=" Software Engineer" disabled={false}          />
        </div>

        {/* Emergency Contact Name & Emergency Contact Number */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="emergencyContactName"
              label="Emergency contact name"
              placeholder="Guardian's name" disabled={false}          />

          <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="emergencyContactNumber"
              label="Emergency contact number"
              placeholder="(555) 123-4567" disabled={false}          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Medical Information</h2>
        </div>

        {/* PRIMARY CARE PHYSICIAN */}
        <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary care physician"
            placeholder="Select a physician" disabled={false}        >
          {Doctors.map((doctor, i) => (
            <SelectItem key={doctor.name + i} value={doctor.name}>
              <div className="flex cursor-pointer items-center gap-2">
                <Image
                  src={doctor.image}
                  width={32}
                  height={32}
                  alt="doctor"
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        {/* INSURANCE & POLICY NUMBER */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insuranceProvider"
              label="Insurance provider"
              placeholder="BlueCross BlueShield" disabled={false}          />

          <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insurancePolicyNumber"
              label="Insurance policy number"
              placeholder="ABC123456789" disabled={false}          />
        </div>

        {/* ALLERGY & CURRENT MEDICATIONS */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="allergies"
              label="Allergies (if any)"
              placeholder="Peanuts, Penicillin, Pollen" disabled={false}          />

          <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="currentMedication"
              label="Current medications"
              placeholder="Ibuprofen 200mg, Levothyroxine 50mcg" disabled={false}          />
        </div>

        {/* FAMILY MEDICATION & PAST MEDICATIONS */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="familyMedicalHistory"
              label=" Family medical history (if relevant)"
              placeholder="Mother had brain cancer, Father has hypertension" disabled={false}          />

          <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="pastMedicalHistory"
              label="Past medical history"
              placeholder="Appendectomy in 2015, Asthma diagnosis in childhood" disabled={false}          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Identification and Verfication</h2>
        </div>

        <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select identification type" disabled={false}        >
          {IdentificationTypes.map((type, i) => (
            <SelectItem key={type + i} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="123456789" disabled={false}        />

        <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )} disabled={false}        />
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Consent and Privacy</h2>
        </div>

        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition." disabled={false}        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to the use and disclosure of my health
          information for treatment purposes."
          disabled={false}
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I acknowledge that I have reviewed and agree to the
          privacy policy"
          disabled={false}
        />
      </section>

      <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
    </form>
  </Form>
  )
}

export default RegisterForm
