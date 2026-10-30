export type PlatformId = "facebook" | "instagram" | "youtube" | "tiktok" | "x";

export type Platform = {
  id: PlatformId;
  name: string;
  short: string;
  color: string;
  captionLimit: number;
  acceptsImage: boolean;
  acceptsVideo: boolean;
  loginNote: string;
};

export const PLATFORMS: Platform[] = [
  { id: "facebook", name: "Facebook", short: "f", color: "#1877F2", captionLimit: 63206, acceptsImage: true, acceptsVideo: true, loginNote: "Posts to your Facebook Page" },
  { id: "instagram", name: "Instagram", short: "IG", color: "#D62976", captionLimit: 2200, acceptsImage: true, acceptsVideo: true, loginNote: "Needs a Business or Creator account" },
  { id: "youtube", name: "YouTube", short: "YT", color: "#FF0000", captionLimit: 5000, acceptsImage: false, acceptsVideo: true, loginNote: "Videos are posted as Shorts" },
  { id: "tiktok", name: "TikTok", short: "TT", color: "#121212", captionLimit: 2200, acceptsImage: true, acceptsVideo: true, loginNote: "Login renews itself every day" },
  { id: "x", name: "X", short: "X", color: "#000000", captionLimit: 280, acceptsImage: true, acceptsVideo: true, loginNote: "Captions up to 280 letters" },
];

export const platformById = (id: PlatformId) => PLATFORMS.find((p) => p.id === id)!;
