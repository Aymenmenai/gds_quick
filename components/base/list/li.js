import { useRouter } from "next/router";
import React from "react";

export default function Li({ element, children }) {
  const router = useRouter();

  // FUNCS
  const routerHandler = (link) => {
    router.push(`/${link}`);
  };

  return (
    <>
      <div>
        <div
          // onClick={hrefHandler}
          className={`flex px-3 
        bg-white z-10 relative 
       h-10 fill-[#00374d] pointer-events-none rounded-md justify-start items-center gap-2`}
        >
          <div className="z-10 h-full flex justify-center items-center  ">
            {children}
          </div>
          <div className=" w-full flex justify-between items-center">
            <div
              className={`block translate-x-0 opacity-100 font-bold  duration-700 text-xs tracking-widest`}
            >
              {element.title}
            </div>
          </div>
        </div>
        {element.subNav ? (
          <>
            <div className="  flex flex-col px-6 ">
              {element.subNav.map((el) => {
                return (
                  <div key={crypto.randomUUID()} className=" ">
                    <div
                      onClick={() => routerHandler(el.field)}
                      // style={{ color: "#19b8ff" }}
                      className={`${
                        router.asPath === `/${el.field}`
                          ? "font-bold bg-gray-600/20"
                          : "text-sm text-gray-400 hover:text-gray-700 hover:-translate-x-1 hover:bg-[#f6faff] "
                      }   transition-all ease-in-out duration-200  p-2 cursor-pointer rounded-md `}
                    >
                      {el.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
