import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError("root", {
          type: "server",
          message: result.message || "Registration failed",
        });
        return;
      }

      navigate("/");
    } catch (err) {
      setError("root", {
        type: "server",
        message: "Server not reachable",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
                    bg-[#0f1115]">
      <div className="w-full max-w-sm p-6
                      bg-[#161a20]
                      border border-[#242a33]
                      rounded-md">

        <h2 className="text-2xl font-medium mb-6 text-center
                       text-gray-100">
          Create account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              className="w-full px-3 py-2
                         bg-[#0f1115]
                         border border-[#242a33]
                         text-gray-100
                         placeholder-gray-500
                         rounded-sm
                         focus:outline-none focus:border-gray-400"
              placeholder="Name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-gray-400 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <input
              className="w-full px-3 py-2
                         bg-[#0f1115]
                         border border-[#242a33]
                         text-gray-100
                         placeholder-gray-500
                         rounded-sm
                         focus:outline-none focus:border-gray-400"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-sm text-gray-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              className="w-full px-3 py-2
                         bg-[#0f1115]
                         border border-[#242a33]
                         text-gray-100
                         placeholder-gray-500
                         rounded-sm
                         focus:outline-none focus:border-gray-400"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-sm text-gray-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            className="w-full py-2
                       bg-gray-100 text-black
                       rounded-sm
                       hover:bg-white transition
                       disabled:opacity-60"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          {/* SERVER ERROR */}
          {errors.root && (
            <p className="text-sm text-gray-400 text-center mt-2">
              {errors.root.message}
            </p>
          )}
        </form>

        <p className="text-sm text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-gray-200 underline hover:no-underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
