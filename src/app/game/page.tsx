'use client';
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation'
import { endpointApi } from "../page";
import useSWR from "swr";
import { GameObject } from "./types";
import Link from 'next/link';

export default function Game() {
    // Get arguments from URL gameCode and nickname
    const searchParams = useSearchParams()
    const gameCode = searchParams.get('gameCode');
    const nickname = searchParams.get('nickname');
    const [game, setGame] = useState(null as GameObject | null);
    const [accessible, setAccessible] = useState(true);
    const [gameFound, setGameFound] = useState(false);

    useSWR(`${endpointApi}/joinGame?gameId=${gameCode}&pseudo=${nickname}`, async (url: string) => {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    }, {
        onSuccess: (data) => {
            console.log(data);
            setGame(data);
        }
    });

    useSWR(`${endpointApi}/getCurrentGame`, async (url: string) => {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    }, {
        onSuccess: (data) => {
            setGame(data);
            console.log(data);
        }
    });

    useEffect(() => {
        if (!game) {
            setGameFound(false)
            console.log("Game not found");
            return;
        }
        const interval = setInterval(() => {
            fetch(`${endpointApi}/getCurrentGame`, {
                method: 'GET',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setGame(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setAccessible(false);
                }
            );
        }, 1000);
        return () => clearInterval(interval);
    }, [game, gameFound, accessible]);

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-8 w-screen">
            <h1 className="text-xl font-bold animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Undercover - Game</h1>
            {/* If server unreachable don't show the rest of the page */}
            {!accessible && (
                <div className="flex flex-col items-center space-y-4">
                    <p className="text-2xl font-bold">Server unreachable</p>
                </div>
            )}
            {/* If game not found don't show the rest of the page */}
            {!game && !gameFound && (
                <div className="flex flex-col items-center space-y-4">
                    <p className="text-2xl font-bold">Game not found</p>
                    <Link href={`/`} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                        Go back
                    </Link>
                </div>
            )}
            {game && (
                <div>
                    <h2 className="text-lg font-bold">
                        Game code:
                        <span className="blur-lg hover:blur-none transition-all" onClick={() => navigator.clipboard.writeText(gameCode!)}>
                            {gameCode}
                        </span>
                        <span className="text-lg italic font-bold mt-0">(cliquer pour copier)</span>
                    </h2>
                    {(game && !game.started) && (
                        <div className="flex flex-col items-center space-y-4">
                            {game.players.length < 3 ? (
                                <p className="text-2xl font-bold">Waiting for players...</p>
                            ) : (
                                <p className="text-2xl font-bold">Waiting to start...</p>
                            )}
                        </div>
                    )}
                    <h2 className="text-2xl font-bold">Players:</h2>
                    <ul className="flex flex-col items-center space-y-4">
                    {game && game.players.map((player: any) => (
                        <li key={player.uuid} className="text-xl font-bold">{player.pseudo}</li>
                    ))}
                    </ul>
                </div>
            )}
            <Footer />
        </div>
    );
}
