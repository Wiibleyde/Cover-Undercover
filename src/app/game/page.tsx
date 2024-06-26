'use client';
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation'
import { endpointApi } from "../page";
import useSWR from "swr";
import { GameObject, GameState } from "./types";
import Link from 'next/link';
import { LoadingRing } from "../components/icons/loadingring";
import { getCookie, setCookie } from "cookies-next";

function toLowerCase(str: string) {
    return str.toLowerCase();
}

export default function Game() {
    const searchParams = useSearchParams()
    const gameCode = searchParams.get('gameCode');
    const nickname = searchParams.get('nickname');
    const [game, setGame] = useState(null as GameObject | null);
    const [accessible, setAccessible] = useState(true);
    const [gameFound, setGameFound] = useState(false);
    const [isTheHost, setIsTheHost] = useState(false);
    const [playerWord, setPlayerWord] = useState('');

    useEffect(() => {
        fetch(`${endpointApi}/joinGame?gameId=${gameCode}&pseudo=${nickname}`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    if (data.error == 'Player already in a game') return;
                    setAccessible(false);
                    return;
                }
                setGame(data);
            })
            .catch(error => {
                console.error('Error:', error);
                setAccessible(false);
            }
        );
    }, [gameCode, nickname]);

    const { data, error, isLoading } = useSWR(`${endpointApi}/getCurrentGame`, async (url: string) => {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    }, {
        onSuccess: (data) => {
            if (data.error) {
                console.error("GLOBAL", data.error);
                return;
            }
            setGame(data);
            const playerUUID = getCookie('playerUWUID');
            if (data.host.uuid === playerUUID) {
                setIsTheHost(true);
            }
            console.log(data);
        }
    });

    useEffect(() => {
        if (isLoading) {
            setGameFound(false);
        }
        if (error) {
            setAccessible(false);
        }
        if (data) {
            setGameFound(true);
            setGame(data);
        }
    }, [data, error, isLoading]);

    useEffect(() => {
        if (data) {
            if (data.error) {
                console.error("GLOBAL", data.error);
                return;
            } else {
                setGame(data);
                const playerUUID = getCookie('playerUWUID');
                const player = data.players.find((player: any) => player.uuid === playerUUID);
                if (data.started) {
                    if (player) {
                        setPlayerWord(data.gameData[toLowerCase(player.role.name)+'Word']);
                    }
                }
            }
        }
    }, [data]);

    const startGame = () => {
        fetch(`${endpointApi}/startGame`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                fetch(`${endpointApi}/getCurrentGame`, {
                    method: 'GET',
                    credentials: 'include'
                })
                    .then(response => response.json())
                    .then(data => {
                        setGame(data);
                        console.log(data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        setAccessible(false);
                    }
                );
            })
            .catch(error => {
                console.error('Error:', error);
                setAccessible(false);
            }
        );
    }

    const leaveGame = () => {
        fetch(`${endpointApi}/leaveGame`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setGame(null);
                setCookie('playerUWUID', '', { expires: new Date(0) });
                setCookie('gameUWUID', '', { expires: new Date(0) });
                window.location.href = '/';
            })
            .catch(error => {
                console.error('Error:', error);
                setAccessible(false);
            }
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-8 w-screen">
            <h1 className="text-2xl font-bold animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Undercover - Game</h1>
            {!accessible && (
                <div className="flex flex-col items-center space-y-4">
                    <p className="text-2xl font-bold">Server unreachable</p>
                    <Link href={`/`} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                        Go back
                    </Link>
                </div>
            )}
            {!game && !gameFound && (
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex flex-row space-x-2">
                        <p className="text-2xl font-bold">Game loading... (It can take some time)</p>
                        <LoadingRing className="w-8 h-8" />
                    </div>
                    <Link href={`/`} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                        Go back
                    </Link>
                </div>
            )}
            {game && (
                <div>
                    <div>
                        <div className="flex flex-col items-center space-y-4">
                            <h2 className="text-md font-bold">
                                Game code:
                                <span className="mx-1 blur-md hover:blur-none transition-all hover:cursor-pointer" onClick={() => navigator.clipboard.writeText(gameCode!)}>
                                    {gameCode}
                                </span>
                                <span className="text-sm italic font-bold hover:cursor-pointer" onClick={() => navigator.clipboard.writeText(gameCode!)}>(Click to copy)</span>
                            </h2>
                        </div>
                        {(!game.started) && (
                            <div>
                                <div className="flex flex-col items-center space-y-4">
                                    {game.players && game.players.length < 3 ? (
                                        <p className="text-2xl font-bold">Waiting for players...</p>
                                    ) : (
                                        <div className="flex flex-col items-center space-y-4">
                                            <p className="text-2xl font-bold">Waiting to start...</p>
                                            {isTheHost && (
                                                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={startGame}>
                                                    Start the game
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {game.started && (
                            <div className="flex flex-col items-center space-y-4">
                                <p className="text-2xl font-bold">Your word : {playerWord}</p>
                                {game && data.gameState.state === "description" && (
                                    <div>
                                        <p className="text-2xl font-bold">Description</p>
                                        <input type="text" name="descriptionGiven" id="descriptionGiven" className="border-2 border-gray-300 p-2 rounded-lg text-black" placeholder="Your description :" />
                                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => {
                                            const description = (document.getElementById("descriptionGiven") as HTMLInputElement).value;
                                            fetch(`${endpointApi}/playDescTurn?desc=${description}`, {
                                                method: 'POST',
                                                credentials: 'include'
                                            })
                                                .then(response => response.json())
                                                .then(data => {
                                                    console.log(data);
                                                })
                                                .catch(error => {
                                                    console.error('Error:', error);
                                                    setAccessible(false);
                                                }
                                            );
                                        }}>
                                            Send description
                                        </button>
                                        <ul className="text-lg font-bold">
                                            {game.descPlayData.map((desc: any) => (
                                                <li key={desc.uuid}>{desc.desc}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {game.gameState.state === "discussion" && (
                                    <div className="flex flex-col items-center space-y-4">
                                        <p className="text-2xl font-bold">Discussion</p>
                                    </div>
                                )}
                                {game.gameState.state === "vote" && (
                                    <div className="flex flex-col items-center space-y-4">
                                        <p className="text-2xl font-bold">Vote</p>
                                        <ul className="text-lg font-bold">
                                            {game.voteData.map((vote: any) => (
                                                <li key={vote.uuid}>{vote.vote}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex flex-col items-center space-y-4">
                            <h2 className="text-2xl font-bold">Players:</h2>
                            <div className="flex flex-row space-x-4 flex-wrap">
                            {game && game.players && game.players.map((player: any) => (
                                <div key={player.uuid} className="bg-gray-200 p-4 rounded-lg flex flex-col items-center space-y-2 w-40">
                                    <p className="text-xl text-black font-bold">{player.pseudo}</p>
                                    {player.eliminated && (
                                        <p className="text-xl font-bold text-red-500">Eliminated</p>
                                    )}
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center space-y-4 mt-6">
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4' onClick={leaveGame}>
                            Leave the game
                        </button>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
