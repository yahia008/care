'use client'
import PatientForm from "@/components/forms/patientForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import PasskeyModal from "@/components/PasskeyModal";

export default function Home({searchParams}:SearchParamProps) {

  const isAdmin = searchParams.admin === 'true'
  return (
   
       <div className="flex h-screen max-h-screen" >
        {isAdmin && <PasskeyModal/>}
        <section className="remove-scrollbar container my-auto ">
          <div className="sub-container max-w-[496px]">
                <Image src='/assets/icons/logo-full.svg' width={1000}
                height={1000} alt="patient" className="mb12 h-10 w-fit"/>
          </div>

          <PatientForm />
          <div className="text-14-regular mt-20 flex justify-between">
          <p className="justify-items-end text-dark-600 xl:text-left">
          &copy; 2024 Care
          </p>
          <Link
           href ="/?admin=true" className ='text-green-500'>
                Admin          
         </Link>
          </div>
        </section>
          <Image src="/assets/images/onboarding-img.png" 
          className="side-img w-[50%]"
          width={1000} height={1000} alt="pnboard"/>  
        
       </div>
      
        
  );
}
