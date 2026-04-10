import Image from "next/image";

export function Logo({ variant = "light", className = "" }) {
  const src = variant === "dark" ? "/logo-dark.svg" : "/logo-full.svg";
  return (
    <Image
      src={src}
      alt="CareerGrid - Your Future, Mapped"
      width={160}
      height={40}
      className={className}
      priority
    />
  );
}

export function LogoIcon({ size = 32, className = "" }) {
  return (
    <Image
      src="/icon.svg"
      alt="CareerGrid"
      width={size}
      height={size}
      className={className}
    />
  );
}
