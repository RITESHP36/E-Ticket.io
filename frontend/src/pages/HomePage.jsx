import React from 'react';

const HomePage = () => {
 return (
   <div className="p-2 sm:p-6 bg-gradient-to-br from-yellow-500 via-red-400 to-orange-500 ">
     <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:p-6 p-4 text-white">
       <h1 className="text-3xl font-bold mb-4 text-yellow-300">Jay Jagannath 🙏</h1>
       <p className="mb-4">Dear Kalinga Jyoti Community,</p>
       
       <p className="mb-4">Let's come together and celebrate the rich culture and traditions of Odisha.</p>
       <p className="mb-4">A big thank you to those who have already registered! We look forward to sharing a wonderful experience with you all tomorrow.</p>
       <p className="mb-4">See you there!</p>
       <p className="mb-4">Warmly,</p>
       <p>The Kalinga Jyoti Community Team</p>
     </div>
     <div className="mt-6">
       <img src="event_poster.jpg" alt="Event Poster" className="rounded-lg shadow-lg w-full" />
     </div>
   </div>
 );
};

export default HomePage;