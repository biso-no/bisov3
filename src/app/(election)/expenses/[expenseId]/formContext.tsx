"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Models } from "node-appwrite";

const formContext = createContext(null);

export type ExpenseForm = {
  campus: string | null;
  department: string | null;
  bank_account: string | null;
  description: string | null;
  expense_attachments: attachments[];
  total: number;
  prepayment_amount: number;
  expense_attachments_ids: [];
};

export type attachments = {
  amount: number;
  date: Date;
  description: string;
  image: File;
};

export const FormContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuth();

  const [step, setStep] = useState(1);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const [formData, setFormData] = useState<ExpenseForm | null>(null);

  const updateFormData = (values: Partial<ExpenseForm>) => {
    setFormData((prevData) => ({ ...prevData, ...values } as ExpenseForm));
  };

  useEffect(() => {
    if (profile) {
      setFormData({
        campus: profile.campus.$id || null,
        department: null,
        bank_account: profile.bank_account|| null,
        description: null,
        expense_attachments: [],
        total: 0,
        prepayment_amount: 0,
        expense_attachments_ids: [],
      });
      //console.log(profile.departments)
    }
  }, [profile]);

  if (!formData) {
    return null;
  }

  return (
    <formContext.Provider value={{ formData, updateFormData, step, nextStep, prevStep }}>
      {children}
    </formContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(formContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormContextProvider");
  }
  return context;
};
