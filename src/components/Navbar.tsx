"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// hooks
import { useHandleOutsideClick } from "@/hooks/useHandleOutsideClick";
import { useHeaderShadowOnScroll } from "@/hooks/useHeaderShadowOnScroll";

// 3rd party
import { signOut, useSession } from "next-auth/react";
import { FaCircleUser } from "react-icons/fa6";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navbarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session, status, update } = useSession();
  const user = session?.user;
  const role = user?.role;
  const image = user?.image;

  useHeaderShadowOnScroll(navbarRef);
  useHandleOutsideClick(dropdownRef, setIsDropdownOpen);

  const skeletonLink = (
    <Link
      href="/pages/signin"
      className="px-2 py-1 ml-4 rounded-[50px] text-transparent skeleton"
    >
      Skeleton
    </Link>
  );

  const skeletonAvatar = (
    <div className="relative h-[40px] w-[40px] rounded-full ml-4 skeleton"></div>
  );

  const authLoading = (
    <div className="flex items-center">
      {[1, 2, 3].map((_, index) => (
        <span key={index}>{skeletonLink}</span>
      ))}
      {skeletonAvatar}
    </div>
  );

  const avatar = (
    <div ref={dropdownRef} className="relative">
      {image ? (
        <div
          className="relative h-[40px] w-[40px] rounded-full ml-8 cursor-pointer bg-slate-300"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <Image
            src={image}
            alt="User Avatar"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover rounded-full"
          />
        </div>
      ) : (
        <div
          className="relative h-[40px] w-[40px] rounded-full ml-8 cursor-pointer bg-slate-300"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <FaCircleUser className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-white" />
        </div>
      )}

      <div
        className={`absolute mt-2 w-[170px] flex flex-col border border-slate-300 p-2 bg-white origin-top-right right-0 ${
          isDropdownOpen ? "scale-100 opacity-1" : "scale-0 opacity-0"
        } shadow-md transition`}
      >
        <button
          onClick={() => {
            signOut().then(() => update());
            setIsDropdownOpen((prev) => !prev);
          }}
          className="px-4 py-2 w-full text-start hover:bg-slate-100 transition"
        >
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div
      ref={navbarRef}
      className="fixed z-20 top-0 left-0 right-0 bg-white h-[4.25rem] flex items-center justify-center"
    >
      <div className="max-w-5xl w-full flex items-center justify-between px-4">
        <Link href="/" className="text-3xl font-extrabold text-violet-600">
          J
          <span className="relative inline-block h-6 w-6 rounded-full bg-violet-600 mr-[1px]">
            <span className="absolute top-1/2 left-1/2 -translate-x-[36%] -translate-y-1/2 h-[14px] w-[14px] bg-white rounded-full">
              <span className="absolute top-1/2 left-1/2 -translate-x-[30%] -translate-y-1/2 h-[7px] w-[7px] bg-gradient-to-t from-black to-[#bababa] rounded-full">
                {/* <span className="absolute top-1/2 left-1/2 -translate-x-[0%] -translate-y-1/2 h-[3px] w-[3px] bg-white rounded-full"></span> */}
              </span>
            </span>
          </span>
          <span className="relative inline-block h-5 w-5 rounded-full bg-violet-600 mr-[0.5px]">
            <span className="absolute top-1/2 left-1/2 -translate-x-[60%] -translate-y-1/2 h-3 w-3 bg-white rounded-full">
              <span className="absolute top-1/2 left-1/2 -translate-x-[60%] -translate-y-1/4 h-[6px] w-[6px] bg-gradient-to-t from-black to-[#bababa] rounded-full">
                {/* <span className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-1/6 h-[3px] w-[3px] bg-white rounded-full"></span> */}
              </span>
            </span>
          </span>
          ble
        </Link>
        <div>
          {status === "loading" ? (
            authLoading
          ) : (
            <div className="flex items-center">
              {role === "JOB_SEEKER" && (
                <>
                  <Link href="/pages/jobs" className="ml-8 font-semibold">
                    Jobs
                  </Link>
                  <Link
                    href="/pages/jobs/saved-jobs"
                    className="ml-8 font-semibold"
                  >
                    Saved
                  </Link>
                  <Link
                    href="/pages/jobs/applied-jobs"
                    className="ml-8 font-semibold"
                  >
                    Applied
                  </Link>
                </>
              )}

              {role === "RECRUITER" && (
                <Link href="/pages/post-job" className="ml-8 font-semibold">
                  Post Job
                </Link>
              )}

              {user && avatar}

              {!user && (
                <Link
                  href="/pages/signin"
                  className="px-5 py-2 bg-black text-white hover:bg-[#333] transition rounded-[50px]"
                >
                  Sign in
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
