const projectId = 'e0jpcgds';
const dataset = 'production';
const apiVersion = '2025-06-01';

export const SANITY_READ_URL = `https://${projectId}.apicdn.sanity.io/v${apiVersion}`;
export const CREATE_USER_URL = 'https://waaw-user-create.vercel.app/api/user';

export const getApiUrl = (query: string) =>
  `${SANITY_READ_URL}/data/query/${dataset}?query=${encodeURIComponent(query)}`;

export type PortfolioSong = {
  _key: string;
  title: string;
  artist: string;
  audio: string;
};

export type Portfolio = {
  _id: string;
  aboutText: string;
  songs: PortfolioSong[];
  image: string;
  logo: string;
  secretMix: string;
};

export type User = {
  _id: string;
  id: string;
  name: string;
  length: number;
  colour: string;
  score: number;
  points: number;
};

export type UserInput = {
  id: string;
  name: string;
  length: number;
  colour: string;
  score?: number;
  points: number;
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
    "secretMix": secretMix.asset->url
  }
`;

export const USERS_QUERY = `
  *[_type == "user"] | order(score desc, _createdAt desc){
    _id,
    id,
    name,
    length,
    colour,
    "score": coalesce(score, 0),
    points
  }
`;

type PortfolioResponse = {
  result: Portfolio | null;
};

type UsersResponse = {
  result: User[];
};

export const fetchPortfolio = async (): Promise<Portfolio | null> => {
  const response = await fetch(getApiUrl(PORTFOLIO_QUERY));

  if (!response.ok) {
    throw new Error(`Failed to fetch portfolio: ${response.status}`);
  }

  const { result } = (await response.json()) as PortfolioResponse;
  return result;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(getApiUrl(USERS_QUERY));

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`);
  }

  const { result } = (await response.json()) as UsersResponse;
  return result;
};

export const createUser = async (user: UserInput) => {
  const response = await fetch(CREATE_USER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.status}`);
  }

  return response.json();
};
