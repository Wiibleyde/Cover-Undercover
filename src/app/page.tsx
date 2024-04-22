'use client'
import Link from 'next/link'
import Footer from './components/footer';
import { useState } from 'react';

export const endpointApi: string = "http://localhost:5000";

export default function Home() {
    const [gameCode, setGameCode] = useState('');
    const [nickname, setNickname] = useState('');

    const handleGameCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGameCode(event.target.value);
    }
    const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(event.target.value);
    }
    return (
        <main className="flex flex-col items-center justify-center h-screen space-y-8 w-screen">
            <div className="flex flex-col items-center space-y-2">
                <h2 className="text-2xl font-bold">Bienvenue sur :</h2>
                <h1 className="text-6xl font-bold animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Undercover</h1>
            </div>
            <div className="flex flex-col items-center space-y-4">
                <p className="text-2xl font-bold">Un jeu de déduction et de bluff</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
                <p className="text-2xl font-bold">Pour jouer :</p>
                <div className="flex flex-row space-x-8">
                    {/* <div className="flex flex-col items-center space-y-4">
                        <p className="text-xl font-bold">Créer une partie</p>
                        <Link href="/createGame" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                            Créer une partie
                        </Link>
                    </div> */}
                    <div className="flex flex-col items-center space-y-4">
                        <p className="text-xl font-bold">Rejoindre une partie</p>
                        <input type="text" name="gameCode" id="gameCode" placeholder="Code de la partie" className="border-2 border-blue-500 rounded p-2 text-black w-[22rem]" value={gameCode} onChange={handleGameCodeChange}/>
                        <input type="text" name="nickname" id="nickname" placeholder="Pseudo" className="border-2 border-blue-500 rounded p-2 text-black w-[22rem]" value={nickname} onChange={handleNicknameChange}/>
                        {gameCode && isCompleteUUID(gameCode) && nickname ? (
                            <Link href={`/game?gameCode=${gameCode}&nickname=${nickname}`} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                                Rejoindre la partie
                            </Link>
                        ) : (
                            <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-not-allowed' disabled>
                                Rejoindre la partie
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

function isCompleteUUID(uuid: string): boolean {
    return uuid.length === 36;
}