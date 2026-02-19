import DotGrid from "./ui/DotGrid";
import { ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Hero = () => {
    const { openAuthModal } = useAuth();

    return (
        <div className="w-full h-screen relative">
            <DotGrid
                dotSize={2.5}
                gap={20}
                baseColor="#a19daa"
                activeColor="#5227FF"
                proximity={5}
                shockRadius={250}
                shockStrength={5}
                resistance={750}
                returnDuration={1.5}
            />
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#f4f4f5,transparent,#f4f4f5),linear-gradient(to_bottom,#f4f4f5,transparent,#f4f4f5)]" >

            </div>
            <div className="absolute inset-0 z-20" >
                <div className="w-full absolute top-1/2 -translate-y-1/2 text-black flex flex-col items-center justify-center gap-8">
                    <h1 className="text-center w-[80%] text-8xl font-bold" >Skill-Based Volunteering That Creates Real Impact</h1>
                    <button
                        onClick={() => openAuthModal("signup")}
                        className="text-xl font-semibold px-5 py-3 bg-black text-white rounded-4xl border flex items-center gap-2 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                    >
                        <span className="pl-1" >Get Started</span>
                        <ChevronRight className=" text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
