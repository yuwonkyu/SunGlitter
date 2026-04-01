import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-snippet": -1,
      "max-image-preview": "none",
    },
  },
};

const AdminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return children;
};

export default AdminLayout;
