import { Image } from "@react-pdf/renderer";
import React, { createContext, useContext, useState, useEffect } from "react";
// Define the context
const formContext = createContext(null);



export type ExpenseForm = {
campus:string,
department:string,
bank_account:string,
description:string,
//expense_attachments
expense_attachments: attachments[],
total:number,
prepayment_amount:number,
expense_attachments_ids: []
//invoice_id:number,
//user:
//userId:
  }

export type attachments = {
    amount: number, // Ensure amount is a number
    date: Date, // Default date value
    description: string,
    image: File,
}


// Define the provider component
export const FormContextProvider = ({ children }) => {
  const  [step, setStep]=useState(1)
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const [formData, setFormData] =useState<ExpenseForm>({
    campus:null,
    department:null,
    bank_account:null,
    description:null,
    expense_attachments: [],
    total:0,
    prepayment_amount:0, 
    expense_attachments_ids: []
  })
// adding this code 👇🏽
const updateFormData = (values: Partial<ExpenseForm>) => {
    setFormData((prevData) => ({ ...prevData, ...values }));
   }

   useEffect(() => {
    console.log("formData updated:", formData);
  }, [formData]);

  return (
    <formContext.Provider value={{ formData,updateFormData, step,nextStep, prevStep}}>
      {children}
    </formContext.Provider>
  );
};

export const useFormContext = () => {
    const context = useContext(formContext)
    if (!context) {
      throw new Error('useFormContext must be used within a formContextProvider')
    }
  
    return context
  }