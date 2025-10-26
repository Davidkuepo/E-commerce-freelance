import { Link } from "react-router";

import TextInput from "@/components/TextInput";
import ButtonWrapper from "@/components/ButtonWrapper";

export default function Login() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <div className="flex flex-col md:flex-row w-full md:min-h-[560px] rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-lg">
        <div className="relative w-full md:w-1/2 h-48 sm:h-64 md:h-auto block bg-gray-100">
          <img
            loading="eager"
            className="h-full w-full object-cover"
            src="https://picsum.photos/id/0/1200/700"
            alt="Laptop product"
          />
        </div>

        <div className="w-full flex flex-col items-center justify-center px-4 py-8 md:py-12">
          <form className="Iw-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col items-center justify-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 font-medium">
              Sign in
            </h2>
            <p className="text-sm text-gray-500/90 mt-3">
              Welcome back! Please sign in to continue
            </p>

            <button
              type="button"
              className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full"
            >
              <img
                className="h-5"
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                alt="googleLogo"
              />
            </button>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 w-full my-5">
              <div className="h-px bg-gray-300/90"></div>
              <p className="text-center text-xs sm:text-sm text-gray-500/90 px-1">
                or sign in with email
              </p>
              <div className="h-px bg-gray-300/90"></div>
            </div>

            <div className="w-full">
              <TextInput label="Email" type="email" name="email" />
            </div>

            <div className="w-full mt-4">
              <TextInput label="Password" type="password" name="password" />
            </div>

            <div className="w-full flex items-center justify-between gap-2 flex-wrap mt-4 text-gray-500/80">
              <div className="flex items-center gap-2">
                <input className="h-5" type="checkbox" id="checkbox" />
                <label className="text-sm" htmlFor="checkbox">
                  Remember me
                </label>
              </div>
              <Link className="text-sm underline" to="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <div className="w-full mt-6">
              <ButtonWrapper variant="default" type="submit">
                Login
              </ButtonWrapper>
            </div>

            <p className="text-gray-500/90 text-sm mt-4">
              Don’t have an account?
              <Link className="text-indigo-400 hover:underline" to="/register">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
