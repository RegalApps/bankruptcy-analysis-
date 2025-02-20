
interface AuthFieldsProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isDisabled?: boolean;  // Added this prop definition
}

export const AuthFields = ({
  email,
  setEmail,
  password,
  setPassword,
  isDisabled = false
}: AuthFieldsProps) => {
  return (
    <>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isDisabled}
          className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isDisabled}
          minLength={6}
          className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Password must be at least 6 characters long
        </p>
      </div>
    </>
  );
};
