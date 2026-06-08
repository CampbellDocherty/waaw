const projectId = 'e0jpcgds';
const dataset = 'production';
const apiVersion = '2025-06-01';

export const SANITY_READ_URL = `https://${projectId}.apicdn.sanity.io/v${apiVersion}`;

export const getApiUrl = (query: string) =>
  `${SANITY_READ_URL}/data/query/${dataset}?query=${encodeURIComponent(query)}`;

export type PortfolioSong = {
  _key: string;
  title: string;
  artist: string;
  audio: string;
};

export type PortfolioNextParty = {
  poster: string;
  link: string;
};

export type PortfolioSecretMix = {
  name: string;
  audio: string;
};

export type Portfolio = {
  _id: string;
  aboutText: string;
  songs: PortfolioSong[];
  image: string;
  logo: string;
  secretMix: PortfolioSecretMix | null;
  instagramLink: string;
  mixesLink: string;
  upcomingLink: string;
  nextParty: PortfolioNextParty | null;
};

export const PORTFOLIO_QUERY = `
  *[_type == 'portfolio'][0]{
    _id,
    aboutText,
    songs[]{
      _key,
      title,
      artist,
      "audio": audio.asset->url
    },
    "image": image.asset->url,
    "logo": logo.asset->url,
    secretMix{
      name,
      "audio": audio.asset->url
    },
    instagramLink,
    mixesLink,
    upcomingLink,
    nextParty{
      "poster": poster.asset->url,
      link
    }
  }
`;

type PortfolioResponse = {
  result: Portfolio | null;
};

export const fetchPortfolio = async (): Promise<Portfolio | null> => {
  const response = await fetch(getApiUrl(PORTFOLIO_QUERY));

  if (!response.ok) {
    throw new Error(`Failed to fetch portfolio: ${response.status}`);
  }

  const { result } = (await response.json()) as PortfolioResponse;
  return result;
};
