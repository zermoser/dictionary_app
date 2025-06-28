import React, { useState } from "react";
import { Search, Volume2, BookOpen, Loader2, AlertCircle, ArrowRight } from "lucide-react";

interface Definition {
  definition: string;
  example?: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface Phonetic {
  text?: string;
  audio?: string;
}

interface DictionaryResult {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
}

const DictionaryApp: React.FC = () => {
  const [word, setWord] = useState("");
  const [result, setResult] = useState<DictionaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchWord = async () => {
    if (!word.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word.trim()}`
      );
      if (!res.ok) throw new Error("Word not found");
      const data = await res.json();
      setResult(data[0]);
    } catch (err) {
      setError("ไม่พบคำนี้ในพจนานุกรม กรุณาลองคำอื่น");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    const audioUrl = result?.phonetics.find(p => p.audio)?.audio;
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(() => {
        console.log("Cannot play audio");
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchWord();
    }
  };

  const getPartOfSpeechColor = (pos: string) => {
    const colors: { [key: string]: string } = {
      noun: "bg-blue-50 text-blue-700 border-blue-200",
      verb: "bg-green-50 text-green-700 border-green-200",
      adjective: "bg-purple-50 text-purple-700 border-purple-200",
      adverb: "bg-orange-50 text-orange-700 border-orange-200",
      preposition: "bg-pink-50 text-pink-700 border-pink-200",
      pronoun: "bg-indigo-50 text-indigo-700 border-indigo-200",
      conjunction: "bg-teal-50 text-teal-700 border-teal-200",
      interjection: "bg-yellow-50 text-yellow-700 border-yellow-200",
    };
    return colors[pos.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto pt-8 pb-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-blue-500 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Dictionary</h1>
          </div>
          <p className="text-slate-600">ค้นหาความหมายและการออกเสียงของคำศัพท์ภาษาอังกฤษ</p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              type="text"
              placeholder="พิมพ์คำศัพท์ที่ต้องการค้นหา..."
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button
              onClick={searchWord}
              disabled={loading || !word.trim()}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <div className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                <span className="font-medium">ค้นหา</span>
              </div>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center justify-center gap-3 text-slate-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>กำลังค้นหา...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
            {/* Word Header */}
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">
                    {result.word}
                  </h2>
                  {result.phonetics.find(p => p.text) && (
                    <p className="text-slate-500 font-mono text-lg">
                      {result.phonetics.find(p => p.text)?.text}
                    </p>
                  )}
                </div>
                {result.phonetics.find(p => p.audio) && (
                  <button
                    onClick={playAudio}
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="font-medium">ฟังเสียง</span>
                  </button>
                )}
              </div>
            </div>

            {/* Meanings */}
            <div className="space-y-4">
              {result.meanings.map((meaning, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className={`px-4 py-3 border-b border-inherit ${getPartOfSpeechColor(meaning.partOfSpeech)}`}>
                    <h3 className="font-semibold capitalize">
                      {meaning.partOfSpeech}
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {meaning.definitions.slice(0, 3).map((def, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-slate-400 font-medium text-sm mt-1 flex-shrink-0">
                            {i + 1}.
                          </span>
                          <p className="text-slate-700 leading-relaxed">
                            {def.definition}
                          </p>
                        </div>
                        {def.example && (
                          <div className="ml-6 p-3 bg-slate-50 rounded-lg border-l-4 border-slate-300">
                            <p className="text-slate-600 italic text-sm">
                              <span className="font-medium text-slate-700">ตัวอย่าง:</span> "{def.example}"
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryApp;