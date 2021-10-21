import axios from "axios";
import React, { ReactElement } from "react";
import faker from "faker";
import { format } from "date-fns";
import { useRouter } from "next/router";
import useLocalStorage from "../hooks/useLocalStorage";

export async function getStaticProps(context) {
  const response = await axios.get(
    "https://my-app.farhanlmntrix.workers.dev/posts"
  );
  const generatedAvatar = faker.image.avatar();
  let data: any = await response.data;
  return {
    props: { data: data.reverse(), avatar: generatedAvatar }, // will be passed to the page component as props
  };
}

interface Props {
  data: any;
  avatar: string;
}

export default function Posts({ data, avatar }: Props): ReactElement {
  const [formIsOpen, setFormIsOpen] = React.useState(false);
  const [user, setUser] = useLocalStorage("anonStory-user", null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target["title"].value;
    const content = e.target["content"].value;
    if (title !== "" && content !== "") {
      data = {
        title,
        username: user,
        content,
      };
      await axios.post("https://my-app.farhanlmntrix.workers.dev/posts", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      router.push(router.asPath);
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-indigo-900">
      <nav className="sticky top-0 p-4 bg-transparent">
        <p className="text-2xl font-semibold text-blue-300">
          anon<span className="text-white">story</span>
        </p>
      </nav>
      <main className="flex flex-col items-center w-full gap-4 p-4">
        {!formIsOpen && (
          <button
            onClick={() => setFormIsOpen(true)}
            className="w-full p-2 font-semibold text-white bg-blue-500 rounded-full md:w-2/5 text-middle"
          >
            Create new post
          </button>
        )}
        {formIsOpen && (
          <div className="flex flex-col items-end w-full px-8 py-4 bg-white md:w-2/5">
            <button
              onClick={() => setFormIsOpen(false)}
              className="px-3 pb-1 text-lg text-center text-white bg-red-500 rounded-full"
            >
              x
            </button>
            <form
              onSubmit={handleSubmit}
              action=""
              className="flex flex-col items-stretch w-full gap-4 py-4"
            >
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  name="title"
                  className="px-2 py-2 border border-gray-400 rounded-md outline-none"
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="content">Content:</label>
                <textarea
                  name="content"
                  className="px-2 py-2 border border-gray-400 rounded-md outline-none"
                />
              </div>
              <div className="flex justify-center w-full pt-4">
                <button
                  type="submit"
                  className="w-full p-2 font-semibold text-white bg-blue-500 rounded-full md:w-2/5 text-middle"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        )}
        {data.map((post, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-center w-full gap-6 p-6 bg-gray-100 border border-gray-200 rounded-md shadow-md md:w-2/5"
          >
            <div className="flex items-center gap-4">
              <img
                src={avatar}
                alt="avatar"
                className="w-12 h-12 rounded-full"
              />
              <div className="flex flex-col justify-center">
                <h5 className="font-semibold text-blue-800">{post.username}</h5>
                <small className="font-medium text-gray-500">
                  {format(new Date(post.created), "dd MMM yyyy p")}
                </small>
              </div>
            </div>
            <p className="text-lg text-justify text-gray-700">{post.content}</p>
          </div>
        ))}
        <p className="mt-8 font-semibold text-gray-400">- End of the post -</p>
      </main>
    </div>
  );
}
