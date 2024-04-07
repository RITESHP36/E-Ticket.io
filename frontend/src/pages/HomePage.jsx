import React from "react";

const HomePage = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
			<div className="text-center">
				<h1 className="text-5xl font-bold mb-4 animate-pulse">
					Utkal Diwas Ticket Distribution and Verification Portal
				</h1>
				<p className="text-2xl mb-8 animate-bounce">Coming Soon</p>
				<div className="flex justify-center items-center mb-8">
					<span className="mr-4 animate-spin">🎫</span>
					<p className="text-lg">
						Get ready to experience a seamless ticketing journey!
					</p>
				</div>
				<div className="flex justify-center items-center mb-8">
					<span className="mr-4 animate-ping">✨</span>
					<p className="text-lg">
						Stay tuned for exciting updates and features.
					</p>
				</div>
				<div className="flex justify-center items-center">
					<span className="mr-4 animate-bounce">🎉</span>
					<p className="text-lg">
						Join us in celebrating the rich cultural heritage of Odisha!
					</p>
				</div>
			</div>
			<div className="mt-16">
				<p className="text-sm text-gray-300">
					Developed by Technical@KalingaJyoti &copy; {new Date().getFullYear()}
				</p>
			</div>
		</div>
	);
};

export default HomePage;
