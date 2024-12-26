export const config = {
    siteMeta: {
      title: "\"Helo! Wold?\"",
      siteName: "Helo",
      description: "Heloは技術ブログをまとめて管理できるブックマークサイトです。",
    },
    siteRoot:
      process.env.NODE_ENV === "production"
        ? "https://helo.dev"
        : "http://localhost:3000",
    headerLinks: [
      {
        title: "About",
        href: "/about",
      },
      {
        title: "",
        href: "/",
      },
      {
        title: "",
        href: "/",
      },
    ],
  };