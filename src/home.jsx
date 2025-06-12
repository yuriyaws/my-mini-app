// Home.jsx
import { useState } from "react";
import HomeMain from "./homeMain";
import HomeAbout from "./homeAbout";
import HomeFAQ from "./homeFAQ";

function Home({ setPage, tgUserId }) {
  const [homeTab, setHomeTab] = useState("homeMain");

  return (
    <>
      {/* Хедер */}
      <nav className="fixed top-0 left-0 bg-white pb-2 w-full z-10">
        <ul className="flex space-x-8 px-6 pt-3 text-blue-500 font-base text-sm">
          <li className="relative">
            <button onClick={() => setHomeTab("homeMain")} className="relative">
              Главная
              {homeTab === "homeMain" && (
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-2.5 h-1 w-full bg-blue-500 rounded-t-full"></span>
              )}
            </button>
          </li>
          <li>
            <button
              onClick={() => setHomeTab("homeAbout")}
              className="relative"
            >
              О нас
              {homeTab === "homeAbout" && (
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-2.5 h-1 w-full bg-blue-500 rounded-t-full"></span>
              )}
            </button>
          </li>
          <li>
            <button onClick={() => setHomeTab("homeFAQ")} className="relative">
              FAQ
              {homeTab === "homeFAQ" && (
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-2.5 h-1 w-full bg-blue-500 rounded-t-full"></span>
              )}
            </button>
          </li>
        </ul>
      </nav>

      {/* Контент */}
      {homeTab === "homeMain" && (
        <HomeMain setPage={setPage} tgUserId={tgUserId} />
      )}
      {homeTab === "homeAbout" && <HomeAbout />}
      {homeTab === "homeFAQ" && <HomeFAQ />}
    </>
  );
}

export default Home;
