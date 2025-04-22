"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile } from "@/lib/actions/user";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Phone number must be at least 8 characters"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(4, "ZIP/Postal code is required"),
  bank_account: z.string().min(8, "Bank account must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function OnboardingModal({ isOpen, onClose, userId }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      city: "",
      zip: "",
      bank_account: "",
    },
  });

  const totalSteps = 3;

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Create profile in Appwrite
      await updateProfile(data);
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden relative"
          >
            {/* Abstract background decoration */}
            <div className="absolute inset-0 overflow-hidden -z-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-30 transform translate-x-1/2 translate-y-1/2" />
            </div>
            
            <div className="px-6 py-8">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
                <p className="text-gray-600">
                  {step === 1 && "Tell us a bit about yourself to get started."}
                  {step === 2 && "Add your contact details so we can reach you."}
                  {step === 3 && "Add your bank details to receive expense reimbursements."}
                </p>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full mb-8 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                  initial={{ width: `${(step / totalSteps) * 100}%` }}
                  animate={{ width: `${(step / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step === 1 && (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            {...register("name")}
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            className={`w-full px-4 py-2.5 rounded-lg border ${
                              errors.name ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            {...register("phone")}
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            className={`w-full px-4 py-2.5 rounded-lg border ${
                              errors.phone ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                          />
                          {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {step === 2 && (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address
                          </label>
                          <input
                            {...register("address")}
                            id="address"
                            type="text"
                            placeholder="Enter your street address"
                            className={`w-full px-4 py-2.5 rounded-lg border ${
                              errors.address ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                          />
                          {errors.address && (
                            <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            {...register("city")}
                            id="city"
                            type="text"
                            placeholder="Enter your city"
                            className={`w-full px-4 py-2.5 rounded-lg border ${
                              errors.city ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                          />
                          {errors.city && (
                            <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP/Postal Code
                          </label>
                          <input
                            {...register("zip")}
                            id="zip"
                            type="text"
                            placeholder="Enter your ZIP/Postal code"
                            className={`w-full px-4 py-2.5 rounded-lg border ${
                              errors.zip ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                          />
                          {errors.zip && (
                            <p className="mt-1 text-sm text-red-500">{errors.zip.message}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {step === 3 && (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="bank_account" className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Account Number
                          </label>
                          <input
                            {...register("bank_account")}
                            id="bank_account"
                            type="text"
                            placeholder="Enter your bank account number"
                            className={`w-full px-4 py-2.5 rounded-lg border ${
                              errors.bank_account ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                          />
                          {errors.bank_account && (
                            <p className="mt-1 text-sm text-red-500">{errors.bank_account.message}</p>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-4">
                          Your information is secure and will only be used for expense reimbursements.
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                
                <div className="flex justify-between mt-8">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 text-blue-600 font-medium hover:text-blue-700 hover:bg-blue-50 rounded-lg transition duration-200"
                    >
                      Back
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 font-medium hover:text-gray-700 hover:bg-gray-50 rounded-lg transition duration-200"
                    >
                      Later
                    </button>
                  )}
                  
                  {step < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition duration-200"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Saving..." : "Complete"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 