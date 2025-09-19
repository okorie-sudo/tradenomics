// src/components/PasswordStrength.tsx
import { passwordStrength } from "../utils/validators";

export default function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const { score, label } = passwordStrength(password);

  const colors = [
    "bg-danger",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-green-700",
  ];

  return (
    <div className="mt-1">
      <div className="w-full bg-gray-200 h-1 rounded">
        <div
          className={`h-1 rounded ${colors[score]}`}
          style={{ width: `${(score / 4) * 100}%` }}
        />
      </div>
      <p className="text-xs mt-1 text-primary">{label}</p>
    </div>
  );
}
