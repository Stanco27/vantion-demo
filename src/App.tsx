import { useState, useEffect } from "react";
import { fetchFollowUp, fetchProgramMatches, type ProgramMatch } from "./api";
import {
  Sparkles,
  Check,
  MapPin,
  GraduationCap,
  Trophy,
  ArrowRight,
  Stars,
} from "lucide-react";

const PILLARS = [
  "Computer Science",
  "Entrepreneurship",
  "Social Justice",
  "Humanities",
  "Engineering",
  "Writing",
  "Leadership",
];
const CYCLE_WORDS = ["university", "scholarships", "majors", "programs"];

export default function App() {
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<ProgramMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [deepDive, setDeepDive] = useState<Record<number, string>>({});
  const [divingId, setDivingId] = useState<number | null>(null);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % CYCLE_WORDS.length);
    }, 2500);
    return () => clearInterval(intervalId);
  }, []);

  const togglePillar = (i: string) => {
    setSelected((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  };

  const onMatch = async () => {
    setLoading(true);
    try {
      const data = await fetchProgramMatches(selected);
      setResults(data);
    } catch {
      alert("System Offline.");
    } finally {
      setLoading(false);
    }
  };

  const onDeepDive = async (id: number, name: string) => {
    setDivingId(id);
    try {
      const res = await fetchFollowUp(name, selected);
      setDeepDive((prev) => ({ ...prev, [id]: res }));
    } finally {
      setDivingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-sans pb-24">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="flex justify-center mb-20">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-full shadow-sm">
            <div className="bg-[#E67E22] p-1.5 rounded-lg">
              <img
                src="https://www.vantion.com/favicon.svg"
                alt="Vantion Logo"
                width={20}
                height={20}
              />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              Vantion Scout
            </span>
          </div>
        </header>

        <div className="text-left mb-16 px-4">
          <p className="text-lg font-medium text-slate-500 mb-3">
            Your personal AI counselor for college planning.
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight flex items-center flex-wrap">
            Act on
            <span className="inline-grid grid-cols-1 grid-rows-1 bg-[#EAE7DE] px-5 py-2 rounded-2xl italic border border-slate-200 shadow-inner overflow-hidden mx-3">
              {CYCLE_WORDS.map((word, index) => (
                <span
                  key={word}
                  className={`col-start-1 row-start-1 flex items-center justify-center transition-all duration-500 ease-in-out relative -top-[3px] ${
                    index === wordIndex
                      ? "translate-y-0 opacity-100"
                      : index < wordIndex
                        ? "-translate-y-12 opacity-0"
                        : "translate-y-12 opacity-0"
                  }`}
                >
                  <span className="text-slate-900 leading-none">{word}</span>
                </span>
              ))}
            </span>
            <span>.</span>
          </h1>
        </div>

        <section className="bg-[#EAE7DE]/60 border border-slate-200 p-10 rounded-[40px] mb-20 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] text-slate-900 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
            <Stars size={140} />
          </div>

          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-4">
            01. Select Identity Pillars{" "}
            <span className="h-px flex-1 bg-slate-300" />
          </h2>

          <div className="flex flex-wrap gap-3 mb-12">
            {PILLARS.map((item) => (
              <button
                key={item}
                onClick={() => togglePillar(item)}
                className={`px-7 py-3.5 rounded-full text-sm font-bold border transition-all duration-300 ${
                  selected.includes(item)
                    ? "bg-[#E67E22] border-[#E67E22] text-white shadow-lg scale-105"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                }`}
              >
                {item}{" "}
                {selected.includes(item) && (
                  <Check size={16} className="inline ml-1 stroke-[3px]" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={onMatch}
            disabled={loading || selected.length === 0}
            className="px-12 py-5 bg-[#E67E22] text-white rounded-full font-black text-lg uppercase tracking-widest hover:bg-[#D35400] transition-all active:scale-[0.98] disabled:opacity-30 shadow-xl shadow-orange-900/10 flex items-center gap-3"
          >
            {loading ? (
              "Counselor Reasoning..."
            ) : (
              <>
                Send Request <ArrowRight size={20} />
              </>
            )}
          </button>
        </section>

        <div className="space-y-10">
          {results.length > 0 && (
            <h2 className="text-2xl font-black text-slate-900 ml-4 mb-8 tracking-tight">
              Optimal Placements
            </h2>
          )}

          {results.map((prog) => (
            <article
              key={prog.id}
              className="bg-white border border-slate-200 p-10 rounded-[40px] shadow-sm hover:shadow-md transition-all group relative"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[10px] font-black text-[#E67E22] uppercase tracking-[0.2em] mb-3 block">
                    {prog.focus}
                  </span>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-[#E67E22] transition-colors">
                    {prog.name}
                  </h3>
                  <div className="flex flex-wrap gap-5 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap size={18} className="text-[#E67E22]" />{" "}
                      {prog.university}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={18} className="text-[#E67E22]" />{" "}
                      {prog.location}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-2xl">
                {prog.desc}
              </p>

              <div className="bg-[#F4F1EA] p-8 rounded-[32px] mb-8 border-l-8 border-[#E67E22]">
                <div className="flex items-center gap-2 mb-4 text-[#E67E22]">
                  <Trophy size={20} />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                    Admissions Logic
                  </span>
                </div>
                <p className="text-slate-800 font-bold italic text-lg leading-relaxed">
                  "{prog.aiReasoning}"
                </p>
              </div>

              <footer className="pt-8 border-t border-slate-50">
                {!deepDive[prog.id] ? (
                  <button
                    onClick={() => onDeepDive(prog.id, prog.name)}
                    disabled={divingId === prog.id}
                    className="text-[#E67E22] font-black text-sm uppercase tracking-widest hover:underline flex items-center gap-2 group/btn"
                  >
                    {divingId === prog.id ? (
                      "Analyzing Potential..."
                    ) : (
                      <>
                        View Standout Strategy{" "}
                        <ArrowRight
                          size={16}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                ) : (
                  <div className="bg-[#E67E22]/5 p-6 rounded-2xl border border-[#E67E22]/20 animate-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#E67E22] p-1.5 rounded-lg text-white mt-1 shrink-0">
                        <Sparkles size={14} fill="currentColor" />
                      </div>
                      <p className="text-slate-700 font-bold italic text-sm leading-relaxed">
                        {deepDive[prog.id]}
                      </p>
                    </div>
                  </div>
                )}
              </footer>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
