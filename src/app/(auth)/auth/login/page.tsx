import { Login } from "@/components/login";

export default async function Page() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-primary-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-gold-default/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[35rem] h-[35rem] rounded-full bg-secondary-100/5 blur-3xl" />
      </div>
      
      <Login />
      
      {/* Footer text */}
      <div className="absolute bottom-4 text-center w-full text-xs text-gray-400">
        &copy; {new Date().getFullYear()} BISO. All rights reserved.
      </div>
    </div>
  )
}