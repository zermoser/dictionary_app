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
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg transform hover:scale-110 transition-all duration-300">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dictionary
            </h1>
          </div>
          <p className="text-slate-600 mb-4">ค้นหาความหมายและการออกเสียงของคำศัพท์ภาษาอังกฤษ</p>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>ใช้ Free Dictionary API (dictionaryapi.dev)</span>
          </div>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            </div>
            <input
              className="w-full pl-12 pr-32 py-4 border border-slate-300 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
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
              className="absolute inset-y-0 right-2 flex items-center"
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none">
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
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 animate-pulse">
            <div className="flex items-center justify-center gap-3 text-slate-600">
              <div className="relative">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <div className="absolute inset-0 w-6 h-6 border-2 border-blue-200 rounded-full animate-ping"></div>
              </div>
              <span className="text-lg">กำลังค้นหาข้อมูลจาก Dictionary API...</span>
            </div>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-6 animate-shake">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-50 rounded-full">
                <AlertCircle className="w-5 h-5 flex-shrink-0 animate-pulse" />
              </div>
              <div>
                <p className="font-medium">{error}</p>
                <p className="text-sm text-red-500 mt-1">ลองตรวจสอบการพิมพ์หรือใช้คำอื่น</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-6 animate-slideInUp">
            {/* Word Header */}
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between">
                <div className="group">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {result.word}
                  </h2>
                  {result.phonetics.find(p => p.text) && (
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                      <p className="text-slate-500 font-mono text-lg bg-slate-50 px-3 py-1 rounded-lg">
                        {result.phonetics.find(p => p.text)?.text}
                      </p>
                    </div>
                  )}
                </div>
                {result.phonetics.find(p => p.audio) && (
                  <button
                    onClick={playAudio}
                    className="group flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-600 px-5 py-3 rounded-xl transition-all duration-200 border border-green-200 hover:border-green-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">ฟังเสียง</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </button>
                )}
              </div>
            </div>

            {/* API Credit */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  ข้อมูลจาก Free Dictionary API - dictionaryapi.dev
                </span>
              </div>
            </div>

            {/* Meanings */}
            <div className="space-y-4">
              {result.meanings.map((meaning, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
                  <div className={`px-5 py-4 border-b border-inherit ${getPartOfSpeechColor(meaning.partOfSpeech)} group-hover:shadow-md transition-all duration-300`}>
                    <h3 className="font-bold capitalize text-lg flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-current opacity-70"></div>
                      {meaning.partOfSpeech}
                    </h3>
                  </div>
                  <div className="p-5 space-y-4 bg-gradient-to-br from-white to-slate-50">
                    {meaning.definitions.slice(0, 3).map((def, i) => (
                      <div key={i} className="space-y-3 hover:bg-white p-3 rounded-lg transition-all duration-200">
                        <div className="flex items-start gap-3">
                          <span className="text-slate-400 font-bold text-sm mt-1 flex-shrink-0 bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center">
                            {i + 1}
                          </span>
                          <p className="text-slate-700 leading-relaxed text-lg">
                            {def.definition}
                          </p>
                        </div>
                        {def.example && (
                          <div className="ml-9 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-l-4 border-amber-300 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-start gap-2">
                              <span className="text-amber-600 font-medium text-sm flex-shrink-0 bg-amber-100 px-2 py-1 rounded-md">
                                ตัวอย่าง
                              </span>
                              <p className="text-slate-700 italic font-medium">
                                "{def.example}"
                              </p>
                            </div>
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