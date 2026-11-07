// Compatibility shim: exposes the wouter API on top of TanStack Router,
// so the ported pages work without rewriting every navigation call.
import {
  Link as TanStackLink,
  useLocation as useTanStackLocation,
  useNavigate,
  useParams as useTanStackParams,
} from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

type LinkProps = Omit<ComponentProps<typeof TanStackLink>, "to"> & {
  href: string;
  children?: ReactNode;
};

export function Link({ href, ...props }: LinkProps) {
  return <TanStackLink to={href} {...props} />;
}

export function useLocation(): [string, (to: string) => void] {
  const location = useTanStackLocation();
  const navigate = useNavigate();
  return [
    location.pathname,
    (to: string) => {
      void navigate({ to });
    },
  ];
}

export function useSearch(): string {
  const location = useTanStackLocation();
  return location.searchStr;
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useTanStackParams({ strict: false } as never) as T;
}
