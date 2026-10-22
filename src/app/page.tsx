import Hero from "../components/layout/public/Hero/hero";
import About from "../components/layout/public/About/page";
import Breathing from '../components/layout/public/forBreak/Breathing/page (5)';
import Eyerule from '../components/layout/public/forBreak/Eye-rule/page (4)'
import Pomodoro from '../components/layout/public/forBreak/Promodor/page (3)'
export default function Home() {
  return (
    <div className="bg-[#051817] bg-[image:radial-gradient(ellipse_at_75%_30%,#0a2a28_0%,transparent_60%)] flex flex-col flex-1 font-sans">
      <Hero />
      <About />
      <Breathing/>
      <Eyerule/>
      <Pomodoro/>
    </div>
  );
}
