'use client';
import Footer from "../components/footer";
import { LoadingRing } from "../components/icons/loadingring";
import useSWR from "swr";
import { endpointApi, isCompleteUUID } from "../page";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CreateGame() {
    const [gameCode, setGameCode] = useState('');
    const [nickname, setNickname] = useState('');

    const handleGameCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGameCode(event.target.value);
    }
    const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(event.target.value);
    }

    useSWR(`${endpointApi}/createGame`, async (url: string) => {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include'
        });
        const data = await response.text();
        return data;
    }, {
        onSuccess: (data) => {
            console.log(data);
            setGameCode(data);
        }
    });
    return (
        <main className="flex flex-col items-center justify-center h-screen space-y-8 w-screen">
            {gameCode ? (
                <div className="flex flex-col items-center space-y-4">
                    <h1 className="text-4xl">Game created!</h1>
                    <p className="text-2xl">Your game code is:</p>
                    <h2 className="text-2xl font-bold">
                        Game code:
                        <span className="mx-1 blur-lg hover:blur-none transition-all" onClick={() => navigator.clipboard.writeText(gameCode!)}>
                            {gameCode}
                        </span>
                        <span className="text-lg italic font-bold">(cliquer pour copier)</span>
                    </h2>
                    <div className="flex flex-col items-center space-y-4">
                        <p className="text-xl font-bold">Rejoindre une partie</p>
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
            ) : (
                <div className="flex flex-col items-center space-y-4">
                    <h1 className="text-4xl">Loading...</h1>
                    <LoadingRing className="w-16 h-16" />
                </div>
            )}
            <Footer />
        </main>
    );
}