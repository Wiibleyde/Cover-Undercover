'use client';
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation'
import { endpointApi } from "../page";
import useSWR from "swr";


export default function Game() {
    // Get arguments from URL gameCode and nickname
    const searchParams = useSearchParams()
    const gameCode = searchParams.get('gameCode');
    const nickname = searchParams.get('nickname');
    const [game, setGame] = useState(null as Game | null);

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
            console.log('No game');
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
                });
        }, 1000);
        return () => clearInterval(interval);
    }, [game]);

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-8 w-screen">
            <h1 className="text-xl font-bold animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Undercover - Game</h1>
            <h2 className="text-lg font-bold">Game code: <span className="blur-lg hover:blur-none transition-all" onClick={() => navigator.clipboard.writeText(gameCode!)}>{gameCode}</span> <span className="text-lg italic font-bold mt-0">(cliquer pour copier)</span></h2>
            {game && !game.started && (
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
            {game && game.players.map(player => (
                <li key={player.uuid} className="text-xl font-bold">{player.pseudo} - {player.role.name}</li>
            ))}
            </ul>
            <Footer />
        </div>
    );
}

type Role = {
    "name": string,
}

type Player = {
    "uuid": string,
    "pseudo": string,
    "role": Role,
    "eliminated": boolean,
    "connected": boolean
}

type GameData = {
    "normalWord": string,
    "undercoverWord": string
}

type GameState = {
    "state": string
}

type DescPlayData = {
    "player": Player,
    "word": string
}

type VoteData = {
    "player": Player,
    "targetPlayer": Player
}

type Game = {
    "uuid": string,
    "started": boolean,
    "ended": boolean,
    "host": Player,
    "players": Array<Player>,
    "gameData": GameData,
    "gameState": GameState,
    "playerTurn": number,
    "descPlayData": Array<DescPlayData>,
    "voteData": Array<VoteData>,
    "lastUpdate": number
}
