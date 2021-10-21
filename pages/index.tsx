import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export default function Home() {
  const [user, setUser] = useLocalStorage("anonStory-user", null);
  const router = useRouter();

  React.useEffect(() => {
    if (user) {
      router.push("/posts");
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target["username"].value;
    if (name !== "") {
      setUser(name);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Anon Story</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 w-full h-screen px-20 text-center bg-indigo-900">
        <div className="flex flex-col items-stretch w-2/5 h-full gap-8 m-8 bg-purple-800 shadow-2xl justify-evenly">
          <div className="flex flex-col items-center gap-6">
            <p className="text-4xl font-semibold text-blue-300">
              anon<span className="text-white">story</span>
            </p>
            <p className="text-gray-200">Enter a username to continue</p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center gap-12"
          >
            <input
              type="text"
              name="username"
              className="w-full px-2 py-2 text-white bg-transparent border rounded-md outline-none md:w-7/12 border-gray-50"
              autoComplete="off"
            />
            <button className="w-full px-4 py-2 font-semibold text-center text-white bg-blue-500 rounded-full shadow-md md:w-7/12">
              Enter
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
