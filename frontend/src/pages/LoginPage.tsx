import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type LoginFormValues, loginSchema } from "../schemas/loginSchema";

//! creates a form for the login page using react hook form and zod schema
function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset: resetForm,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log("form submitted");
  };

  return (
    <div>
      <h1>Login</h1>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert">
            {errors.email.message}
          </p>
        )}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <p id="password-error" role="alert">
            {errors.password.message}
          </p>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
export default LoginPage;
