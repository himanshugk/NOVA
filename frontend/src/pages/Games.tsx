import { Link } from "react-router-dom";

const Games = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black/95 text-white">
            <h1 className="text-4xl font-extrabold uppercase tracking-widest text-blue-500 mb-4">
                Games
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-md text-center">
                New multiplayer online games are currently in development. They will be available here soon!
            </p>
            <div className="flex gap-4">
                <Link
                    to="/chat"
                    className="rounded bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
                >
                    Go to Chat
                </Link>
                <Link
                    to="/"
                    className="rounded border border-gray-600 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default Games;
