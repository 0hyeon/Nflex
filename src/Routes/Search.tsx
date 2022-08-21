import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult } from "../api";
import {
  getSearchKey,
  getSearchMovie,
  getSearchTv,
  IGetSearchKey,
} from "../api";
import { IGetTv } from "../api";
import Loader from "../Components/Loader";
import MovieSlider from "../Components/MovieSlider";
// import TvSlider from "../Components/tv/TvSlider";

const Wrapper = styled.div`
  margin-top: 80px;
  height: 40vh;
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
  height: 250px;
  color: white;
  margin-top: 20px;
  padding-top: 40px;
  padding-left: 20px;
`;
const Title = styled.h2``;

const KeyResult = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  margin: 10px;
`;
const Key = styled.div`
  margin: 10px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
`;
const Nothing = styled.div`
  margin-top: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  span:nth-child(2) {
    font-size: 18px;
    margin-top: 20px;
  }
`;

function Search() {
  // Header에서 보낸 query-argument를 파싱한다.
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  // 검색어 API 가져오기 (keyword가 존재할 때만)
  const { data: keyData, isLoading: keyLoading } = useQuery<IGetSearchKey>(
    ["search", "key"],
    () => getSearchKey(keyword!),
    { enabled: !!keyword }
  );
  const { data: movieData, isLoading: movieLoading } =
    useQuery<IGetMoviesResult>(
      ["search", "movie"],
      () => getSearchMovie(keyword!),
      { enabled: !!keyword }
    );
  const { data: tvData, isLoading: tvLoading } = useQuery<IGetTv>(
    ["search", "tv"],
    () => getSearchTv(keyword!),
    { enabled: !!keyword }
  );

  return (
    <Wrapper>
      {keyLoading && movieLoading && tvLoading ? (
        <Loader />
      ) : (
        <>
          <Helmet>
            <title>SEARCH: </title>
          </Helmet>

          {keyData?.results.length &&
          movieData?.results.length &&
          tvData?.results.length ? (
            <>
              <Div>
                <Title>다음과 관련된 콘텐츠 &rarr;</Title>
                <KeyResult>
                  {keyData.results.slice(0, 18).map((key) => (
                    <Key key={key.id}>{key.name ? key.name : key.title}</Key>
                  ))}
                </KeyResult>
              </Div>
              <MovieSlider kind="search" data={movieData} />
              {/* <TvSlider kind="search" data={tvData} /> */}
            </>
          ) : (
            <Nothing>
              <span>검색결과가 없습니다.</span>
              <span>상단 오른쪽의 검색 아이콘을 클릭하여 검색해주세요!</span>
            </Nothing>
          )}
        </>
      )}
    </Wrapper>
  );
}
export default Search;
