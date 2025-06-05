import { useEffect, useState } from "react";
import io from "socket.io-client";

type Freebie = {
  title: string;
  link: string;
  platform: string;
};

export default function Home() {
  const [freebies, setFreebies] = useState<Freebie[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Freebie[]>([]);

  useEffect(() => {
    fetch("/api/freebies")
      .then(r => r.json())
      .then(setFreebies);

    const socket = io();
    socket.on("update", (data: Freebie[]) => setFreebies(data));
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    setFiltered(
      freebies.filter(f =>
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.platform.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, freebies]);

  return (
    <main className="max-w-3xl mx-auto py-12 px-2">
      <h1 className="text-4xl font-bold mb-4 text-center">🎮 Game Hunt Pro</h1>
      <p className="mb-8 text-center text-lg">Monitoramento Automático E Em Tempo Real De jogos E DLCs Grátis Nas Principais Plataformas.</p>
      <input
        className="w-full p-3 rounded bg-gray-800 border-2 border-gray-700 mb-6 text-lg"
        placeholder="Buscar jogo, DLC ou plataforma..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="grid sm:grid-cols-2 gap-5">
        {filtered.map(f => (
          <a
            key={f.link}
            href={f.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 p-4 rounded-lg shadow-lg hover:bg-indigo-800 transition group border border-gray-700 flex flex-col justify-between"
          >
            <span className="text-xl font-semibold group-hover:underline">{f.title}</span>
            <span className="mt-2 text-sm opacity-80">{f.platform}</span>
            <span className="mt-3 text-xs text-indigo-400 group-hover:text-white">Acessar &rarr;</span>
          </a>
        ))}
      </div>
      <div className="text-center text-xs mt-10 opacity-60">
        &copy; {new Date().getFullYear()} Freebies Detector. Atualizado automaticamente.
      </div>
    </main>
  );
}
