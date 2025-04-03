import Header from "@/components/header";
import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
   
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen">
      <LoginButton />
    </div>
    
    </>
  );
}
