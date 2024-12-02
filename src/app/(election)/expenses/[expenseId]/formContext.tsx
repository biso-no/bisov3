import { Image } from "@react-pdf/renderer";
import React, { createContext, useContext, useState, useEffect } from "react";
// Define the context
const formContext = createContext(null);



export type expenseForm = {
campus:string,
department:string,
bank_account:string,
description:string,
//expense_attachments
expenseAttachments: attachments[],
total:number,
prepayment_amount:number,
//invoice_id:number,
//user:
//userId:
  }

export type attachments = {
    amount: number, // Ensure amount is a number
    date: Date, // Default date value
    description: string,
    image: Image,

}


// Define the provider component
export const AppContextProvider = ({ children }) => {
  const [formData, setFormData] =useState()


  return (
    <formContext.Provider value={{ formData}}>
      {children}
    </formContext.Provider>
  );
};

export const useAppContext = () => {
    const context = useContext(formContext)
    if (!context) {
      throw new Error('useNewPropertyFormContext must be used within a NewUserFormContextProvider')
    }
  
    return context
  }