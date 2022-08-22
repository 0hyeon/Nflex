const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  overview: string;
  release_date: string;
  poster_path: string;
  original_title: string;
  title?: string;
  vote_average: string;
}
interface IVedeos {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: string;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export interface IGetVideosResult {
  id: string;
  results: IVedeos[];
}

export function getMovies(category: string) {
  return fetch(
    `${BASE_PATH}/movie/${category}?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}
export function getVideo(id: number) {
  return fetch(
    `${BASE_PATH}/movie/${id}/videos?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export interface IGetMovieDetail {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  original_title: string;
  overview: string;
  vote_average: number;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  tagline: string;
}
export interface IGetMovieCredit {
  id: number;
  cast: [
    {
      id: number;
      name: string;
      original_name: string;
      character: string;
      profile_path: string;
    }
  ];
  crew: [
    {
      id: number;
      known_for_department: string;
      name: string;
      original_name: string;
      profile_path: string;
    }
  ];
}

export async function getMovieDetail(id: string) {
  return await (
    await fetch(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}&language=ko`)
  ).json();
}
export async function getMovieCredit(id: string) {
  return await (
    await fetch(
      `${BASE_PATH}/movie/${id}/credits?api_key=${API_KEY}&language=ko`
    )
  ).json();
}

// 검색기능
interface ISearchResult {
  id: number;
  name?: string;
  title?: string;
}

export interface IGetSearchKey {
  page: number;
  results: ISearchResult[];
  total_pages: number;
  total_results: number;
}

export async function getSearchKey(keyword: string) {
  return await (
    await fetch(
      `${BASE_PATH}/search/multi?api_key=${API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false&region=KR`
    )
  ).json();
}

export async function getSearchMovie(keyword: string) {
  return await (
    await fetch(
      `${BASE_PATH}/search/movie?api_key=${API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false&region=KR`
    )
  ).json();
}
export async function getSearchTv(keyword: string) {
  return await (
    await fetch(
      `${BASE_PATH}/search/tv?api_key=${API_KEY}&language=ko&&page=1&query=${keyword}&include_adult=false`
    )
  ).json();
}

//tv
interface ITv {
  backdrop_path: string;
  id: number;
  name: string;
  original_name: string;
  overview: string;
  vote_average: number;
  first_air_date: string;
  poster_path: string;
}

export interface IGetTv {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export interface IGetTvDetail {
  backdrop_path: string;
  poster_path: string;
  name: string;
  original_name: string;
  overview: string;
  vote_average: number;
  id: number;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  last_episode_to_air: {
    air_date: string;
    name: string;
    episode_number: number;
  };
  next_episode_to_air: {
    air_date: string;
    name: string;
    episode_number: number;
  };
}
export interface IGetTvCredit {
  id: number;
  cast: [
    {
      id: number;
      name: string;
      original_name: string;
      character: string;
      profile_path: string;
    }
  ];
  crew: [
    {
      id: number;
      known_for_department: string;
      name: string;
      original_name: string;
      profile_path: string;
    }
  ];
}
export async function getTv(kind: string) {
  return await (
    await fetch(`${BASE_PATH}/tv/${kind}?api_key=${API_KEY}&language=ko&page=1`)
  ).json();
}

export async function getTvDetail(id: string) {
  return await (
    await fetch(`${BASE_PATH}/tv/${id}?api_key=${API_KEY}&language=ko`)
  ).json();
}
export async function getTvCredit(id: string) {
  return await (
    await fetch(`${BASE_PATH}/tv/${id}/credits?api_key=${API_KEY}&language=ko`)
  ).json();
}
