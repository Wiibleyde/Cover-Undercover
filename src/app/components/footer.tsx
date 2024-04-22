export default function Footer() {
    return (
        <footer className="bg-neutral-950 p-4 text-white flex flex-row justify-between bottom-0 w-full absolute">
            <div className="flex flex-col items-center space-y-4">
                <a href="#" className="text-blue-500 hover:underline">Undercover</a>
                <a href="#" className="text-blue-500 hover:underline">GitHub</a>
            </div>
            <div className="flex flex-col items-center space-y-4">
                <p className="text-gray-500">&copy; 2024 Undercover (student project)</p>
                <p className="text-gray-500">All rights reserved (or not)</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
                <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
                <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
            </div>
        </footer>
    );
}